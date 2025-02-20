// Load the MySQL pool connection
const pool = require("./mysql");
const getDatesInRange = require("./getDatesInRange");

// Route the app
const eventDepartmentPlanJournalRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/departments/allDepartmentPlanJournal/:date",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, date } = req.params;
      pool.query(
        `SELECT dpj.*, d.id as dept_id
                  FROM depart_plan_journal dpj
                  LEFT JOIN depart_plan dp ON dp.id = dpj.plan
                  LEFT JOIN depart d ON d.id=dp.department
                  WHERE d.depart_event=${eventId} AND dp.start='${date}'`,
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
    "/eventList/:eventId/department/:departmentId/planJournal",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { departmentId } = req.params;
      const { date, comm_time, place_plan, direction, place_fact } = req.body;
      pool.query(
        `SELECT * FROM depart_plan dp WHERE dp.department=${departmentId} AND start='${date}'`,
        (error, result) => {
          if (error || !result[0]) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `INSERT INTO depart_plan_journal 
          ( department, comm_time, place_plan, direction, place_fact) 
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
    "/eventList/:eventId/department/:departmentId/planJournal/:id",
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
    "/eventList/:eventId/department/:departmentId/plan/:id",
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

  // app.put(
  //   "/eventList/:eventId/department/addPlanJournalTime",
  //   passport.authenticate("jwt", { session: false }),
  //   (req, res) => {
  //     const { eventId } = req.params;
  //     const { date } = req.body;

  //     pool.query(
  //       `INSERT INTO depart_plan_journal
  //         ( department, comm_time, place_plan, direction, place_fact)
  //         VALUES(?,?,?,?,?)`,
  //       [result[0].id, comm_time, place_plan, direction, place_fact],
  //       (error, result) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).json({ success: false, message: error });
  //           return;
  //         }
  //         res.send(result);
  //       }
  //     );
  //   }
  // );
};

// Export the router
module.exports = eventDepartmentPlanJournalRouter;
