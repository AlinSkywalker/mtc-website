// Load the MySQL pool connection
const pool = require("../mysql")
const sendTelegramMessage = require("../telegram");

// Route the app
const eventApplicationRouter = (app, passport) => {
  app.get('/eventList/:eventId/eventApplication/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId } = req.params;
    pool.query(`SELECT * FROM event_application WHERE event='${eventId}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/eventList/:eventId/eventApplication/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId } = req.params;
    const { member, date_start, date_finish, department_type } = req.body;
    pool.query(`INSERT INTO event_application ( event, member, date_start, date_finish, department_type) 
      VALUES('${eventId}',${member},'${date_start}','${date_finish}','${department_type}')`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        sendTelegramMessage('Получена новая заявка', '1663445325')
        return
      }
      res.send(result);
    });
  })
  app.post('/eventList/:eventId/eventApplication/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
  app.delete('/eventList/:eventId/eventApplication/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
module.exports = eventApplicationRouter;