// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventDepartmentRouter = (app, passport) => {
  app.get('/eventList/:eventId/department/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    pool.query(`SELECT d.*, m.fio as inst_fio FROM depart d LEFT JOIN member m on m.id=d.depart_inst WHERE depart_event='${eventId}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  // depart_event
  // depart_datef
  // depart_dates
  // depart_name
  // depart_tip
  app.put('/eventList/:eventId/department/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    const { depart_tip, depart_datef, depart_dates, depart_name, depart_inst } = req.body;
    pool.query(`INSERT INTO depart ( depart_event, depart_tip, depart_datef, depart_dates, depart_name,depart_inst) 
      VALUES('${eventId}','${depart_tip}',CONVERT('${depart_datef}',DATETIME),CONVERT('${depart_dates}',DATETIME),'${depart_name}',${depart_inst || null})`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.post('/eventList/:eventId/department/:departmentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const departmentId = req.params.departmentId;
    const { depart_tip, depart_datef, depart_dates, depart_name, depart_inst } = req.body;
    pool.query(`UPDATE depart SET 
      depart_tip='${depart_tip}',
      depart_datef=CONVERT('${depart_datef}',DATETIME),
      depart_dates=CONVERT('${depart_dates}',DATETIME),
      depart_name='${depart_name}',
      depart_inst=${depart_inst},
      updated_date=CURRENT_TIMESTAMP WHERE id=${departmentId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.delete('/eventList/:eventId/department/:departmentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const departmentId = req.params.departmentId;
    pool.query(`DELETE FROM depart WHERE id=${departmentId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.get('/eventList/:eventId/department/:departmentId/member', passport.authenticate('jwt', { session: false }), (req, res) => {
    const departmentId = req.params.departmentId;
    if (departmentId === 'undefined') {
      res.send([]);
      return
    }
    pool.query(`SELECT m_d.membd_memb as id, m.fio as member_fio FROM membdepart m_d
                  LEFT JOIN eventmemb e_m ON e_m.id=m_d.membd_memb
                  LEFT JOIN member m on m.id=e_m.eventmemb_memb
                  WHERE m_d.membd_dep=${departmentId} 
                  GROUP BY m_d.membd_memb`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/eventList/:eventId/department/:departmentId/member', passport.authenticate('jwt', { session: false }), (req, res) => {
    const departmentId = req.params.departmentId;
    const { membd_memb } = req.body;
    pool.query(`SELECT * FROM depart WHERE id=${departmentId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      const { depart_datef, depart_dates } = result[0]
      function getDatesInRange(startDate, endDate) {
        const date = new Date(startDate.getTime());

        const dates = [];

        while (date <= endDate) {
          dates.push(new Date(date).toISOString().substring(0, 10));
          date.setDate(date.getDate() + 1);
        }

        return dates;
      }
      const dates = getDatesInRange(new Date(depart_dates), new Date(depart_datef))
      // console.log(dates);
      const insertValueString = dates.map(item => `(${departmentId},${membd_memb}, '${item}')`).join(', ')
      // console.log(insertValueString);
      pool.query(`INSERT INTO membdepart ( membd_dep, membd_memb, membd_date) 
        VALUES ${insertValueString}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    })
  })
  app.delete('/eventList/:eventId/department/:departmentId/member/:memberId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { departmentId, memberId } = req.params;
    pool.query(`DELETE FROM membdepart WHERE membd_dep=${departmentId} AND membd_memb=${memberId}`, (error, result) => {
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
module.exports = eventDepartmentRouter;