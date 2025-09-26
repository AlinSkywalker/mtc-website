// Load the MySQL pool connection
const pool = require("../mysql");
const getDatesInRange = require("../getDatesInRange");

// Route the app
const eventInstructionLogRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/eventInstructionLog/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT *
                FROM event_instruction_log e_m_s 
                WHERE event=${eventId}
                ORDER BY date `,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.put(
    "/eventList/:eventId/eventInstructionLog/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      const { date, instruction } = req.body;
      pool.query(
        `INSERT INTO depart ( event, date, instruction, manual) VALUES(${eventId},'${date}','${instruction}', 1`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.post(
    "/eventList/:eventId/eventInstructionLog/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      const { date, instruction } = req.body;
      pool.query(
        `UPDATE event_management_staff SET 
            date=?,
            instruction=?
            WHERE id='${id}'`,
        [date, instruction],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );
  app.put(
    "/eventList/:eventId/generateEventInstructionLog",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      const queries = [];
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT e.* , m_ob.fio as ob_fio, m_st.fio as st_fio, e_m.member_fio, e_m.eventmemb_dates
                FROM eventalp  e
                LEFT JOIN member m_ob on e.event_ob = m_ob.id
                LEFT JOIN member m_st on e.event_st = m_st.id
                LEFT JOIN (
                    SELECT
                    e_m.eventmemb_even as eventmemb_even,
                    GROUP_CONCAT(m.fio SEPARATOR ', ') as member_fio,
                    e_m.eventmemb_dates
                    FROM eventmemb e_m
                    LEFT JOIN member m on m.id = e_m.eventmemb_memb
                    GROUP BY e_m.eventmemb_even, e_m.eventmemb_dates
                    ) e_m ON e_m.eventmemb_even = e.id AND e_m.eventmemb_dates = e.event_start
                WHERE e.id=${eventId}`,
            (error, result) => {
              if (error) {
                reject(error);
              }
              const { event_start, ob_fio, event_name, st_fio, member_fio } =
                result[0];

              pool.query(
                `INSERT INTO event_instruction_log ( event, date, instruction) 
                        VALUES (${eventId} ,'${event_start}','Альпинисткое мероприятие ${event_name} обьявляется открытым.'),
                        (${eventId} ,'${event_start}', 'Зачислить на Альпинисткое мероприяти следующих участников: ${member_fio}'),
                        (${eventId} ,'${event_start}', 'Назначить СТ - ${st_fio}'),
                        (${eventId} ,'${event_start}', 'Назначить ОБ - ${ob_fio}')`,
                (error, result) => {
                  if (error) {
                    reject(error);
                  }
                  resolve({ success: true });
                }
              );
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT dp.*, l.laba_name, r.rout_name, m.mount_name, r.rout_comp, d.depart_tip, d.depart_name, pp_dp.program_names
                        FROM depart_plan dp 
                        LEFT JOIN depart d ON dp.department=d.id
                        LEFT JOIN laba l on l.id=dp.laba
                        LEFT JOIN route r on r.id=dp.route
                        LEFT JOIN mount m on m.id=r.rout_mount
                        LEFT JOIN (
                            SELECT
                            pp_dp.depart_plan,
                            GROUP_CONCAT(prog_razd SEPARATOR ', ') as program_names
                            FROM progrp_in_depart_plan pp_dp
                            LEFT JOIN progr_pod_razd pp ON pp.id = pp_dp.progr_p
                            GROUP BY
                            pp_dp.depart_plan) pp_dp on pp_dp.depart_plan = dp.id
                        WHERE d.depart_event=${eventId}`,
            (error, result) => {
              if (error) {
                reject(error);
              }
              const insertValuesArray = [];
              result.forEach((resultItem) => {
                let instruction = "";
                const {
                  type,
                  mount_name,
                  depart_name,
                  rout_comp,
                  rout_name,
                  laba_name,
                  program_names,
                } = resultItem;
                if (type === "Отдых") {
                  instruction = `Отделению ${depart_name} обьявить день отдыха`;
                } else if (type === "Восхождение") {
                  instruction = `Разрешить отделению ${depart_name} выход на восхождение на вершину ${mount_name}, по маршруту ${rout_name} (${rout_comp})`;
                } else if (type === "Занятие") {
                  instruction = `Разрешить отделению ${depart_name} выход на занятия ${
                    program_names || ""
                  } в ${laba_name}`;
                }
                if (instruction) {
                  insertValuesArray.push(
                    `(${eventId} ,'${resultItem.start}', '${instruction}')`
                  );
                }
              });
              const insertValues = insertValuesArray.join(",");
              pool.query(
                `INSERT INTO event_instruction_log ( event, date, instruction) 
                        VALUES ${insertValues}`,
                (error, result) => {
                  if (error) {
                    reject(error);
                  }
                  resolve({ success: true });
                }
              );
            }
          );
        })
      );
      pool.query(
        `DELETE FROM event_instruction_log WHERE event =${eventId} AND manual<>0`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          Promise.all(queries)
            .then((resultsArray) => {
              res.send(resultsArray);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ success: false, message: error });
              return;
            });
        }
      );
    }
  );
};

// Export the router
module.exports = eventInstructionLogRouter;
