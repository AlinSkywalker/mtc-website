// Load the MySQL pool connection
const pool = require("../mysql");
const getDatesInRange = require("../getDatesInRange");

// Route the app
const eventManagementStuffRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/eventManagementStuff/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT e_m_s.*, m_ob.fio as ob_fio, m_st.fio as st_fio, m_d.fio as doctor_fio
                FROM event_management_staff e_m_s 
                LEFT JOIN member m_ob on e_m_s.ob = m_ob.id
                LEFT JOIN member m_st on e_m_s.st = m_st.id 
                LEFT JOIN member m_d on e_m_s.doctor = m_d.id 
                WHERE event='${eventId}'`,
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
    "/eventList/:eventId/eventManagementStuff/:date",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { date, eventId } = req.params;
      const { ob, st, doctor } = req.body;
      pool.query(
        `UPDATE event_management_staff SET 
            ob=?,
            st=?,
            doctor=?
            WHERE date='${date}' and event=${eventId}`,
        [ob || null, st || null, doctor || null],
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
    "/eventList/:eventId/eventManagementStuffFromEvent",
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
          const {
            event_start,
            event_finish,
            event_st,
            event_ob,
            event_doctor,
          } = result[0];
          console.log();
          const eventDateStart = new Date(event_start);
          const eventDateFinish = new Date(event_finish);
          const dates = getDatesInRange(eventDateStart, eventDateFinish);
          const insertValueString = dates
            .map(
              (item) =>
                `(${eventId},${event_st},${event_ob},${event_doctor}, '${item}')`
            )
            .join(", ");
          pool.query(
            `INSERT INTO event_management_staff ( event, st, ob,doctor, date) 
              VALUES ${insertValueString}  ON DUPLICATE KEY UPDATE st=${event_st}, ob=${event_ob}, doctor=${event_doctor}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              res.json({ success: true });
            }
          );
        }
      );
    }
  );
};

// Export the router
module.exports = eventManagementStuffRouter;
