// Load the MySQL pool connection
const pool = require("../mysql");
const getDatesInRange = require("../getDatesInRange");

const getDeptPlanDescription = (deptPlan) => {
  const {
    plan_type,
    mount_name,
    rout_name,
    rout_comp,
    laba_name,
    program_names } = deptPlan

  let departmentPlanDescription = String(plan_type)
  if (plan_type === 'Восхождение') {
    departmentPlanDescription += `, ${mount_name}, ${rout_name || ''} (${rout_comp})`
  }
  else if (plan_type === 'Занятие') {
    departmentPlanDescription += `, ${laba_name || ''} (${program_names?.replace("||", ', ') || ''})`
  }
  return departmentPlanDescription
}
// Route the app
const eventDepartmentRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/department/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT d.*, m.fio as inst_fio, e.event_start, e.event_finish FROM depart d 
        LEFT JOIN member m on m.id=d.depart_inst 
        LEFT JOIN eventalp e on e.id=d.depart_event
        WHERE depart_event='${eventId}'
        ORDER BY 
    		CASE WHEN d.depart_tip = 'ХЗ' THEN 1 ELSE 0 END,
    		d.depart_dates ASC`,
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
    "/eventList/:eventId/department/:departmentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.departmentId;
      pool.query(
        `SELECT d.*, m.fio as inst_fio FROM depart d LEFT JOIN member m on m.id=d.depart_inst WHERE d.id='${id}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result[0]);
        }
      );
    }
  );
  // depart_event
  // depart_datef
  // depart_dates
  // depart_name
  // depart_tip
  app.put(
    "/eventList/:eventId/department/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      const {
        depart_tip,
        depart_datef,
        depart_dates,
        depart_name,
        depart_inst,
      } = req.body;
      pool.query(
        `INSERT INTO depart ( depart_event, depart_tip, depart_datef, depart_dates, depart_name,depart_inst) 
      VALUES('${eventId}','${depart_tip}',CONVERT('${depart_datef}',DATETIME),CONVERT('${depart_dates}',DATETIME),'${depart_name}',${depart_inst || null
        })`,
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
    "/eventList/:eventId/department/:departmentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const departmentId = req.params.departmentId;
      const {
        depart_tip,
        depart_datef,
        depart_dates,
        depart_name,
        depart_inst,
      } = req.body;
      pool.query(
        `UPDATE depart SET 
      depart_tip='${depart_tip}',
      depart_datef=CONVERT('${depart_datef}',DATETIME),
      depart_dates=CONVERT('${depart_dates}',DATETIME),
      depart_name='${depart_name}',
      depart_inst=${depart_inst},
      updated_date=CURRENT_TIMESTAMP WHERE id=${departmentId}`,
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
  app.delete(
    "/eventList/:eventId/department/:departmentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const departmentId = req.params.departmentId;
      pool.query(
        `DELETE FROM depart WHERE id=${departmentId}`,
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
    "/eventList/:eventId/departments/allDepartmentMembers/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT * FROM eventalp WHERE id=${eventId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `SELECT m_i_d.*, m.fio
                  FROM member_in_depart m_i_d
                  LEFT JOIN depart d ON d.id=m_i_d.membd_dep
                  LEFT JOIN eventmemb em ON em.id=m_i_d.membd_memb
                  LEFT JOIN member m ON m.id=em.eventmemb_memb
                  WHERE d.depart_event=${eventId}
                  ORDER BY membd_date ASC, m.fio ASC
                  `,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              const fullResult = {};
              result.forEach((item) => {
                const deptMembers =
                  fullResult[item.membd_date]?.[item.membd_dep] || [];
                fullResult[item.membd_date] = {
                  ...fullResult[item.membd_date],
                  [item.membd_dep]: [...deptMembers, item.fio],
                };
              });
              res.send(fullResult);
            }
          );
        }
      );
    }
  );

  app.get(
    "/eventList/:eventId/member/:memberId/departmentByDate",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, memberId } = req.params;
      pool.query(
        `SELECT * FROM eventmemb em WHERE id=${memberId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const { eventmemb_dates, eventmemb_datef } = result[0];
          const dates = getDatesInRange(new Date(eventmemb_dates), new Date(eventmemb_datef));
          pool.query(
            `SELECT m_d.*, d.depart_name, d.depart_dates, d.depart_datef, d.depart_tip,
                pp_dp.program_names, l.laba_name, m.mount_name,r.rout_name,r.rout_comp, dp.type as plan_type, dp.start
              FROM member_in_depart m_d 
              LEFT JOIN depart d on d.id = m_d.membd_dep
              LEFT JOIN depart_plan dp on dp.department = d.id 
              LEFT JOIN route r on r.id=dp.route
              LEFT JOIN mount m on m.id=r.rout_mount
              LEFT JOIN laba l on l.id=dp.laba
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
              WHERE m_d.membd_memb=${memberId}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              const fullResult = dates.map((date, index) => {
                const existedDept = result.find(depData => depData.membd_date === date)
                let dept
                if (existedDept) {
                  const { depart_dates,
                    depart_datef,

                    depart_name,
                    depart_tip,

                  } = existedDept

                  const deptStart = depart_dates.substring(8, 10) + '.' + depart_dates.substring(5, 7)
                  const deptEnd = depart_datef.substring(8, 10) + '.' + depart_datef.substring(5, 7)

                  const existedDeptPlan = result.find(depData => (depData.membd_date === date && depData.start === date))
                  let departmentPlan = ''
                  if (existedDeptPlan) {
                    departmentPlan = getDeptPlanDescription(existedDeptPlan)
                  }
                  dept = {
                    ...existedDept,
                    department: `${depart_tip} ${depart_name} (${deptStart} - ${deptEnd})`,
                    existedDept: true,
                    depart_plan: departmentPlan,
                  }
                }
                else {
                  dept = { id: index, membd_date: date, existedDept: false }
                }
                return dept
              }
              )
              res.send(fullResult);
              // ?????
            }
          );
        }
      );
    }
  );
  app.get(
    "/eventList/:eventId/departmentForMember/:memberId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, memberId } = req.params;
      const { selectedDate } = req.query;

      if (selectedDate) {
        pool.query(
          `SELECT d.*, pp_dp.program_names, l.laba_name, m.mount_name,r.rout_name,r.rout_comp, dp.type as plan_type, dp.start
            FROM depart d
              LEFT JOIN depart_plan dp on dp.department = d.id 
              LEFT JOIN route r on r.id=dp.route
              LEFT JOIN mount m on m.id=r.rout_mount
              LEFT JOIN laba l on l.id=dp.laba
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
              WHERE d.depart_event=${eventId} AND d.depart_dates<='${selectedDate}' AND d.depart_datef>='${selectedDate}'`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            let fullResult = result.reduce((accumulator, currentValue) => {
              const id = currentValue.id
              const {
                start } = currentValue
              const departmentPlanDescription = getDeptPlanDescription(currentValue)
              const departPlans = accumulator[id]?.['depart_plans'] ?
                { ...accumulator[id]['depart_plans'], [start]: departmentPlanDescription } :
                {}
              accumulator[id] = {
                ...accumulator[id],
                ...currentValue,
                depart_plans: departPlans
              }
              return accumulator
            }, {})
            fullResult = Object.values(fullResult).map(item => item)
            res.send(fullResult);
          }
        );
      } else {
        pool.query(
          `SELECT * FROM depart d WHERE d.depart_event=${eventId}`,
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
    }
  );
  app.post(
    "/eventList/:eventId/member/:memberId/departmentForDate",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

      const { memberId } = req.params;
      const { membd_date, membd_dep, existedDept } = req.body;
      if (existedDept && membd_dep) {
        pool.query(
          `UPDATE member_in_depart 
            SET membd_dep=${membd_dep}
            WHERE membd_memb=${memberId} AND membd_date='${membd_date}'`,
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
      else if (existedDept && !membd_dep) {
        pool.query(
          `DELETE FROM member_in_depart 
            WHERE membd_memb=${memberId} AND membd_date='${membd_date}'`,
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
      else {
        pool.query(
          `INSERT INTO member_in_depart (membd_memb, membd_date, membd_dep) VALUES (${memberId},'${membd_date}',${membd_dep})`,
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

    }
  );
  app.post(
    "/eventList/:eventId/member/:memberId/departmentForAllDates",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

      const { memberId } = req.params;
      const { departmentId } = req.body;
      if (!departmentId) {
        pool.query(
          `DELETE FROM member_in_depart 
            WHERE membd_memb=${memberId}`,
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
      else {
        pool.query(
          `SELECT * FROM depart WHERE id=${departmentId}`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            const { depart_datef, depart_dates } = result[0];
            pool.query(
              `SELECT * FROM eventmemb WHERE id=${memberId}`,
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ success: false, message: error });
                  return;
                }
                const { eventmemb_dates, eventmemb_datef } = result[0];
                const departDateStart = new Date(depart_dates);
                const departDateFinish = new Date(depart_datef);
                const memberDateStart = new Date(eventmemb_dates);
                const memberDateFinish = new Date(eventmemb_datef);
                const rangeDateStart =
                  departDateStart > memberDateStart
                    ? departDateStart
                    : memberDateStart;
                const rangeDateFinish =
                  departDateFinish < memberDateFinish
                    ? departDateFinish
                    : memberDateFinish;
                const dates = getDatesInRange(rangeDateStart, rangeDateFinish);
                const insertValueString = dates
                  .map((item) => `(${departmentId},${memberId}, '${item}')`)
                  .join(", ");
                //INSERT INTO ... ON DUPLICATE KEY UPDATE
                pool.query(
                  `INSERT INTO member_in_depart ( membd_dep, membd_memb, membd_date) 
              VALUES ${insertValueString} ON DUPLICATE KEY UPDATE membd_dep=${departmentId}`,
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
      }
    }
  );

  app.get(
    "/eventList/:eventId/department/:departmentId/member",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const departmentId = req.params.departmentId;
      if (departmentId === "undefined") {
        res.send([]);
        return;
      }
      pool.query(
        `SELECT m_d.membd_memb as id, m.fio as member_fio, m.id as member_id FROM member_in_depart m_d
        LEFT JOIN eventmemb e_m ON e_m.id=m_d.membd_memb
        LEFT JOIN member m on m.id=e_m.eventmemb_memb
        WHERE m_d.membd_dep=${departmentId} AND m_d.membd_date='${req.query.selectedDate}'`,
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
};

// Export the router
module.exports = eventDepartmentRouter;
