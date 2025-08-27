// Load the MySQL pool connection
const pool = require("../mysql");
const getDatesInRange = require("../getDatesInRange");

// Route the app
const eventDepartmentPlanRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/departments/allDepartmentPlan/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, departmentId } = req.params;
      pool.query(
        `SELECT * FROM eventalp WHERE id=${eventId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `SELECT dp.*, l.laba_name, r.rout_name, m.mount_name, r.rout_comp
                  FROM depart_plan dp 
                  LEFT JOIN depart d ON dp.department=d.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  WHERE d.depart_event=${eventId}
                  `,
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
    }
  );
  app.get(
    "/eventList/:eventId/departments/departmentWithPlan/:date",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, date } = req.params;
      pool.query(
        `SELECT d.*
              FROM depart_plan dp 
              LEFT JOIN depart d ON dp.department=d.id
              WHERE d.depart_event=${eventId} AND dp.start='${date}'
              `,
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
  app.get(
    "/eventList/:eventId/department/:departmentId/plan/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, departmentId } = req.params;
      pool.query(
        `SELECT dp.*, r.rout_name, r.rout_mount, r.rout_comp, 
                m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name,
                l.laba_name, l.laba_rai, l_rai.rai_name as l_rai_name, l_rai.rai_reg  as l_rai_reg, l_reg.region_name as l_region_name,
                mem.fio as ascent_head_fio, pp_dp.program_names , pp_dp.program_ids, d.depart_dates as departmentStartDate, d.depart_datef as departmentEndDate
                FROM depart_plan dp
                  LEFT JOIN depart d on d.id=dp.department
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON rai.id = m.mount_rai
                  LEFT JOIN region reg ON reg.id = rai.rai_reg
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN raion l_rai ON l_rai.id = l.laba_rai
                  LEFT JOIN region l_reg ON l_reg.id = l_rai.rai_reg
                  LEFT JOIN member mem ON mem.id = dp.ascent_head
                  LEFT JOIN (
                    SELECT
                      pp_dp.depart_plan,
                      GROUP_CONCAT(prog_razd SEPARATOR '||') as program_names,
                      GROUP_CONCAT(pp.id SEPARATOR '||') as program_ids
                    FROM
                      progrp_in_depart_plan pp_dp
                    LEFT JOIN progr_pod_razd pp on
                      pp.id = pp_dp.progr_p
                    GROUP BY
                      pp_dp.depart_plan) pp_dp on pp_dp.depart_plan = dp.id
                WHERE department='${departmentId}' ORDER BY dp.start ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.map((item) => {
            const program_name_list = item.program_names?.split("||") || [];
            const program_id_list = (item.program_ids?.split("||") || []).map(
              (item) => Number(item)
            );
            const program_name = program_name_list?.join(", ");
            return {
              ...item,
              program_name_list,
              program_id_list,
              program_name,
            };
          });
          res.send(fullResult);
        }
      );
    }
  );

  app.put(
    "/eventList/:eventId/department/:departmentId/plan/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, departmentId } = req.params;
      const {
        route,
        start,
        ob_agreement,
        type,
        laba,
        ascent_head,
        program_id_list,
        place
      } = req.body;
      pool.query(
        `INSERT INTO depart_plan 
      ( department, route, start, ob_agreement,type,laba,ascent_head,place) 
      VALUES(?,?,?,?,?,?,?,?)`,
        [
          departmentId,
          route || null,
          start,
          ob_agreement,
          type,
          laba || null,
          ascent_head || null,
          place
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const planId = result.insertId;
          if (program_id_list && program_id_list?.length !== 0) {
            const planProgramValues = program_id_list
              .map((item) => `(${planId},${item})`)
              .join(", ");
            pool.query(
              `INSERT INTO progrp_in_depart_plan (depart_plan, progr_p) VALUES ${planProgramValues}`,
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ success: false, message: error });
                  return;
                }
                res.json({ success: true });
              }
            );
          } else {
            res.json({ success: true });
          }
        }
      );
    }
  );
  app.post(
    "/eventList/:eventId/department/:departmentId/plan/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      const {
        route,
        start,
        ob_agreement,
        type,
        laba,
        ascent_head,
        program_id_list,
        place
      } = req.body;
      const planProgramValues = program_id_list
        ?.map((item) => `(${id},${item})`)
        .join(", ");
      pool.query(
        `UPDATE depart_plan SET 
      route=?,
      start=?,
      ob_agreement=?,
      type=?,
      laba=?,
      ascent_head=?,
      place=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [
          route || null,
          start,
          ob_agreement,
          type,
          laba || null,
          ascent_head || null,
          place
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `DELETE FROM progrp_in_depart_plan WHERE depart_plan=${id}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              if (program_id_list && program_id_list?.length !== 0) {
                pool.query(
                  `INSERT INTO progrp_in_depart_plan (depart_plan, progr_p) VALUES ${planProgramValues}`,
                  (error, result) => {
                    if (error) {
                      console.log(error);
                      res.status(500).json({ success: false, message: error });
                      return;
                    }
                    res.json({ success: true });
                  }
                );
              } else {
                res.json({ success: true });
              }
            }
          );
        }
      );
    }
  );
  app.delete(
    "/eventList/:eventId/department/:departmentId/plan/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(`DELETE FROM depart_plan WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  app.post(
    "/eventList/:eventId/department/:departmentId/plan/:id/unaccepted",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(
        `UPDATE depart_plan dp SET accepted='Не зачтено',updated_date=CURRENT_TIMESTAMP WHERE dp.id='${id}'`,
        (error, result) => {
          if (error) {
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send("done");
        }
      );
    }
  );
  app.post(
    "/eventList/:eventId/department/:departmentId/plan/:id/accept",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id, departmentId, eventId } = req.params;
      const { acceptedMember, start, finish } = req.body;
      pool.query(
        `SELECT dp.*, r.rout_name, r.rout_mount, r.rout_comp, 
                m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name,
                l.laba_name, l.laba_rai, l_rai.rai_name as l_rai_name, l_rai.rai_reg  as l_rai_reg, l_reg.region_name as l_region_name,
                d.depart_inst, d.depart_tip, mem.fio as ascent_head_fio
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON m.mount_rai=rai.id
                  LEFT JOIN region reg ON rai.rai_reg = reg.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN raion l_rai ON l.laba_rai=l_rai.id
                  LEFT JOIN region l_reg ON l_rai.rai_reg = l_reg.id
                  LEFT JOIN depart d ON d.id = dp.department
                  LEFT JOIN member mem ON mem.id = dp.ascent_head
                WHERE dp.id='${id}' ORDER BY dp.start ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const { route, start, depart_inst, ascent_head, ascent_head_fio } =
            result[0];
          pool.query(
            `SELECT m.id FROM member_in_depart m_in_d
            LEFT JOIN eventmemb em ON em.id=m_in_d.membd_memb
            LEFT JOIN member m ON m.id=em.eventmemb_memb
                    WHERE m_in_d.membd_dep='${departmentId}' AND m_in_d.membd_date = '${start}'`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              let loopError = false;
              let memberCount = acceptedMember.length;

              const queries = [];

              acceptedMember.forEach((memberId) => {
                let role = "Участник";
                if (memberId == depart_inst) {
                  role = "Инструктор";
                } else if (memberId == ascent_head) {
                  role = "Руководитель";
                }
                const query = new Promise((resolve, reject) => {
                  pool.query(
                    `INSERT INTO ascent (asc_event, asc_memb, asc_route, asc_date, asc_typ, asc_kolu, asc_ruk, asc_times, asc_timesf)
                        SELECT ${eventId}, ${memberId}, ${route}, '${start}', '${role}', ${memberCount}, 
                        '${ascent_head_fio}', ${start ? "'" + start + "'" : null}, ${finish ? "'" + finish + "'" : null} 
                        WHERE NOT EXISTS (
                          SELECT 1 FROM ascent WHERE asc_memb = ${memberId} AND asc_route = ${route} AND asc_date='${start}'
                    );`,
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve(result);
                      }
                    }
                  );
                });
                queries.push(query);
              });
              Promise.all(queries)
                .then(() => {
                  pool.query(
                    `UPDATE depart_plan dp SET accepted='Зачтено',updated_date=CURRENT_TIMESTAMP WHERE dp.id='${id}'`,
                    (error, result) => {
                      if (error) {
                        res
                          .status(500)
                          .json({ success: false, message: error });
                        return;
                      }
                      res.send("allright");
                    }
                  );
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
    }
  );
};

// Export the router
module.exports = eventDepartmentPlanRouter;
