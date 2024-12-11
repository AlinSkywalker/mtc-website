// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventSmenaRouter = (app, passport) => {
  app.get('/eventList/:eventId/smena/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    pool.query(`SELECT * FROM smena WHERE smena_event='${eventId}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  //smena_tip
  // smena_datef
  // smena_dates
  // smena_name
  app.put('/eventList/:eventId/smena/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    const { smena_tip, smena_datef, smena_dates, smena_name } = req.body;
    pool.query(`INSERT INTO smena ( smena_event, smena_tip, smena_datef, smena_dates, smena_name) 
      VALUES('${eventId}','${smena_tip}',CONVERT('${smena_datef}',DATETIME),CONVERT('${smena_dates}',DATETIME),'${smena_name}')`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.post('/eventList/:eventId/smena/:smenaId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const smenaId = req.params.smenaId;
    const { smena_tip, smena_datef, smena_dates, smena_name } = req.body;
    pool.query(`UPDATE smena SET 
      smena_tip='${smena_tip}',
      smena_datef=CONVERT('${smena_datef}',DATETIME),
      smena_dates=CONVERT('${smena_dates}',DATETIME),
      smena_name='${smena_name}',
      updated_date=CURRENT_TIMESTAMP WHERE id=${smenaId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.delete('/eventList/:eventId/smena/:smenaId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const smenaId = req.params.smenaId;
    pool.query(`DELETE FROM smena WHERE id=${smenaId}`, (error, result) => {
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
module.exports = eventSmenaRouter;