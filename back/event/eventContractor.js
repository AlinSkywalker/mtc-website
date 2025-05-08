// Load the MySQL pool connection
const pool = require("../mysql")

// Route the app
const eventContractorRouter = (app, passport) => {
  app.get('/eventList/:eventId/contractor/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId } = req.params;
    pool.query(`SELECT e_c_s.*, c.cont_fio
                FROM event_contractor_service e_c_s 
                LEFT JOIN contractor c on c.id=e_c_s.contractor 
                WHERE event='${eventId}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.put('/eventList/:eventId/contractor/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId } = req.params;
    const { contractor, tarif, count, transfer, residence, date_start, date_end, service_type } = req.body;
    pool.query(`INSERT INTO event_contractor_service 
      ( event, contractor, tarif, count, transfer,residence,date_start,date_end,service_type) 
      VALUES(?,?,?,?,?,?,?,?,?)`,
      [eventId, contractor, tarif, count, transfer, residence, date_start, date_end, service_type], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
  })
  app.post('/eventList/:eventId/contractor/:contractorId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { contractorId, eventId } = req.params;
    const { tarif, count, transfer, residence, date_start, date_end, service_type } = req.body;
    pool.query(`UPDATE event_contractor_service SET 
      tarif=?,
      count=?,
      transfer=?,
      residence=?,
      date_start=?,
      date_end=?,
      service_type=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${contractorId}`, [tarif, count, transfer, residence, date_start, date_end, service_type], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.delete('/eventList/:eventId/contractor/:contractorId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { contractorId } = req.params;
    pool.query(`DELETE FROM event_contractor_service WHERE id=${contractorId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.get('/eventList/:eventId/contractorForEvent/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId } = req.params;
    pool.query(`SELECT c.* FROM base_in_eventalp bie 
                  LEFT JOIN base b ON b.id=bie.base_m 
                  LEFT JOIN contr_in_base cib ON cib.base_base =b.id 
                  LEFT JOIN contractor c ON c.id=cib.base_contr 
                  WHERE bie.event_m ='${eventId}'`, (error, result) => {
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
module.exports = eventContractorRouter;