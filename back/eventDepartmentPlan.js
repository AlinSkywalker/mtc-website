// Load the MySQL pool connection
const pool = require("./mysql");
const getDatesInRange = require("./getDatesInRange");

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
                pp.prog_tem, pp.prog_razd
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON m.mount_rai=rai.id
                  LEFT JOIN region reg ON rai.rai_reg = reg.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN raion l_rai ON l.laba_rai=l_rai.id
                  LEFT JOIN region l_reg ON l_rai.rai_reg = l_reg.id
                  LEFT JOIN progr_pod pp ON dp.progp = pp.id
                WHERE department='${departmentId}' ORDER BY dp.start ASC`,
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
    "/eventList/:eventId/department/:departmentId/plan/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, departmentId } = req.params;
      const { route, start, ob_agreement, type, laba, progp } = req.body;
      pool.query(
        `INSERT INTO depart_plan 
      ( department, route, start, ob_agreement,type,laba,progp) 
      VALUES(?,?,?,?,?,?,?)`,
        [
          departmentId,
          route || null,
          start,
          ob_agreement,
          type,
          laba || null,
          progp || null,
        ],
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
    "/eventList/:eventId/department/:departmentId/plan/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      const { route, start, ob_agreement, type, laba, progp } = req.body;
      pool.query(
        `UPDATE depart_plan SET 
      route=?,
      start=?,
      ob_agreement=?,
      type=?,
      laba=?,
      progp=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [route || null, start, ob_agreement, type, laba || null, progp || null],
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
    "/eventList/:eventId/department/:departmentId/plan/:id/accept",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id, departmentId, eventId } = req.params;
      pool.query(
        `SELECT dp.*, r.rout_name, r.rout_mount, r.rout_comp, 
                m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name,
                l.laba_name, l.laba_rai, l_rai.rai_name as l_rai_name, l_rai.rai_reg  as l_rai_reg, l_reg.region_name as l_region_name,
                pp.prog_tem, pp.prog_razd, d.depart_inst, d.depart_tip
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON m.mount_rai=rai.id
                  LEFT JOIN region reg ON rai.rai_reg = reg.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN raion l_rai ON l.laba_rai=l_rai.id
                  LEFT JOIN region l_reg ON l_rai.rai_reg = l_reg.id
                  LEFT JOIN progr_pod pp ON dp.progp = pp.id
                  LEFT JOIN depart d ON d.id = dp.department
                WHERE dp.id='${id}' ORDER BY dp.start ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const { route, start, depart_inst, depart_tip } = result[0];
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
              let memberCount = result.length;
              // if (
              //   result.includes(depart_inst) &&
              //   ["НП1", "НП2", "СП1", "СП2"].includes(depart_tip)
              // ) {
              //   memberCount = memberCount - 1;
              // }
              const queries = [];
              result.forEach((resultItem) => {
                const { id: memberId } = resultItem;
                const role = "Участник";
                const query = new Promise((resolve, reject) => {
                  pool.query(
                    `INSERT INTO ascent (asc_event, asc_memb, asc_route, asc_date, asc_typ, asc_kolu)
                        SELECT ${eventId}, ${memberId}, ${route}, '${start}', 'Участник', ${memberCount} WHERE NOT EXISTS (
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
                    `UPDATE depart_plan dp SET accepted=1,updated_date=CURRENT_TIMESTAMP WHERE dp.id='${id}'`,
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
