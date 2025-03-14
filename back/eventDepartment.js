// Load the MySQL pool connection
const pool = require("./mysql");
const getDatesInRange = require("./getDatesInRange");
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
        ORDER BY d.depart_dates ASC`,
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
      VALUES('${eventId}','${depart_tip}',CONVERT('${depart_datef}',DATETIME),CONVERT('${depart_dates}',DATETIME),'${depart_name}',${
          depart_inst || null
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
    "/eventList/:eventId/department/:departmentId/member",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const departmentId = req.params.departmentId;
      if (departmentId === "undefined") {
        res.send([]);
        return;
      }
      if (req.query.selectedDate) {
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
      } else {
        pool.query(
          `SELECT m_d.membd_memb as id, m.fio as member_fio FROM member_in_depart m_d
        LEFT JOIN eventmemb e_m ON e_m.id=m_d.membd_memb
        LEFT JOIN member m on m.id=e_m.eventmemb_memb
        WHERE m_d.membd_dep=${departmentId} 
        GROUP BY m_d.membd_memb`,
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
  app.put(
    "/eventList/:eventId/department/:departmentId/member",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const departmentId = req.params.departmentId;
      const { membd_memb } = req.body;
      const { selectedDate } = req.query;
      if (selectedDate) {
        pool.query(
          `INSERT INTO member_in_depart ( membd_dep, membd_memb, membd_date) 
        VALUES (?,?,?)`,
          [departmentId, membd_memb, selectedDate],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else {
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
              `SELECT * FROM eventmemb WHERE id=${membd_memb}`,
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
                  .map((item) => `(${departmentId},${membd_memb}, '${item}')`)
                  .join(", ");
                pool.query(
                  `INSERT INTO member_in_depart ( membd_dep, membd_memb, membd_date) 
          VALUES ${insertValueString}`,
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
  app.delete(
    "/eventList/:eventId/department/:departmentId/member/:memberId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { departmentId, memberId } = req.params;
      const { selectedDate } = req.query;
      if (selectedDate) {
        pool.query(
          `DELETE FROM member_in_depart 
                  WHERE membd_dep=${departmentId} AND membd_memb=${memberId} AND membd_date='${selectedDate}'`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else {
        pool.query(
          `DELETE FROM member_in_depart WHERE membd_dep=${departmentId} AND membd_memb=${memberId}`,
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
  app.get(
    "/eventList/:eventId/memberForDepartment/:departmentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, departmentId } = req.params;
      const { selectedDate } = req.query;

      if (selectedDate) {
        pool.query(
          `SELECT e_m.*, m.fio, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu
        FROM eventmemb e_m
        LEFT JOIN member m on m.id=e_m.eventmemb_memb
        JOIN membalp ma on m.id=ma.id
        WHERE eventmemb_even=${eventId} AND e_m.id NOT IN (SELECT membd_memb from member_in_depart WHERE membd_date='${selectedDate}')`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else {
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
              `SELECT e_m.*, m.fio, ma.alprazr, ma.alpinstr
                      FROM eventmemb e_m
                      LEFT JOIN member m on m.id=e_m.eventmemb_memb
                      JOIN membalp ma on m.id=ma.id
                      WHERE eventmemb_even=${eventId} AND 
                      e_m.id NOT IN (
                        SELECT membd_memb from member_in_depart 
                        WHERE membd_date>='${depart_dates}' AND membd_date<='${depart_datef}' GROUP BY membd_memb)`,
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
    }
  );
};

// Export the router
module.exports = eventDepartmentRouter;
