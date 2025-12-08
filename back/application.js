// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const applicationRouter = (app, passport) => {
  app.get('/applicationList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pool.query(`SELECT e_a.*, e.event_name, e.event_start, e.event_finish, m.fio 
                FROM event_application e_a
                LEFT OUTER JOIN eventalp e on e.id = e_a.event
                LEFT OUTER JOIN member m on m.id = e_a.member
                ORDER BY created_date DESC
                `, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/applicationList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId, member, date_start, date_finish, department_type } = req.body;
    pool.query(`INSERT INTO event_application ( event, member, date_start, date_finish, department_type) 
      VALUES('${eventId}',${member},'${date_start}','${date_finish}','${department_type}')`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.post('/applicationList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params;
    const { date_start, date_finish, department_type } = req.body;
    pool.query(`UPDATE event_application SET 
      department_type='${department_type}',
      date_start='${date_start}',
      date_finish='${date_finish}',
      updated_date=CURRENT_TIMESTAMP 
      WHERE id=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.post('/applicationList/:id/accept', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params;
    pool.query(`SELECT e_a.*
                FROM event_application e_a
                 WHERE id=${id}
                `, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      const applicationData = result[0]
      pool.query(
        `INSERT INTO eventmemb 
        ( eventmemb_memb, eventmemb_dates, eventmemb_datef,eventmemb_even) 
         VALUES(${applicationData.member},'${applicationData.date_start}','${applicationData.date_finish}',
         ${applicationData.event})
         ON DUPLICATE KEY UPDATE updated_date=CURRENT_TIMESTAMP`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(`UPDATE event_application SET 
            accepted=1,
            updated_date=CURRENT_TIMESTAMP 
            WHERE id=${id}`, (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return
            }
            res.send(result);
          });
        }
      );
    });
  })
  app.delete('/applicationList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params;
    pool.query(`DELETE FROM event_application WHERE id=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

}

// Export the router
module.exports = applicationRouter;