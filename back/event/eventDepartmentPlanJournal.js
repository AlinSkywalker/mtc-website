// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const eventDepartmentPlanJournalRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/departments/allDepartmentPlanJournal/:date",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, date } = req.params;
      pool.query(
        `SELECT dpj.*, d.id as dept_id, dp.id as plan_id
                  FROM depart_plan_journal dpj
                  LEFT JOIN depart_plan dp ON dp.id = dpj.plan
                  LEFT JOIN depart d ON d.id=dp.department
                  WHERE d.depart_event=${eventId} AND dpj.comm_time LIKE '${date}%'
                  ORDER BY dpj.comm_time ASC`,
        // `SELECT dpj.*, d.id as dept_id
        //   FROM depart_plan dp
        //   LEFT JOIN depart_plan_journal dpj ON dpj.plan = dp.id
        //   LEFT JOIN depart d ON dp.department=d.id
        //   WHERE d.depart_event=${eventId} AND dp.start='${date}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = {};
          result.forEach((item) => {
            fullResult[item.comm_time] = {
              ...fullResult[item.comm_time],
              [item.dept_id]: item,
            };
          });
          res.send(fullResult);
        }
      );
    }
  );

  app.put(
    "/eventList/:eventId/departments/planJournal",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { comm_time, place_plan, direction, place_fact, dept_id } =
        req.body;
      pool.query(
        `SELECT * FROM depart_plan dp WHERE dp.department=${dept_id} 
          AND start='${comm_time.substring(0, 10)}'`,
        (error, result) => {
          if (error || !result[0]) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `INSERT INTO depart_plan_journal 
            ( plan, comm_time, place_plan, direction, place_fact) 
            VALUES(?,?,?,?,?)`,
            [result[0].id, comm_time, place_plan, direction, place_fact],
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
  app.post(
    "/eventList/:eventId/departments/planJournal/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      const { place_plan, direction, place_fact } = req.body;
      pool.query(
        `UPDATE depart_plan_journal SET 
      place_plan=?,
      direction=?,
      place_fact=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [place_plan, direction, place_fact],
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
    "/eventList/:eventId/departments/planJournal/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(
        `DELETE FROM depart_plan_journal WHERE id=${id}`,
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
    "/eventList/:eventId/departments/allDepartmentPlanJournal/:date/addPlanJournalTime",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, date } = req.params;
      const { dateTime } = req.body;
      pool.query(
        `SELECT dp.*
              FROM depart_plan dp 
              LEFT JOIN depart d ON dp.department=d.id
              WHERE d.depart_event=${eventId} AND dp.start='${date}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const queries = [];
          result.forEach((resultItem) => {
            const query = new Promise((resolve, reject) => {
              pool.query(
                `INSERT INTO depart_plan_journal (plan, comm_time) 
          VALUES(?,?);`,
                [resultItem.id, dateTime],
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
              res.send("allright");
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
module.exports = eventDepartmentPlanJournalRouter;
