// Load the MySQL pool connection
const pool = require("../mysql")

// Route the app
const eventMemberRouter = (app, passport) => {
  app.get('/eventList/:eventId/member/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    pool.query(`SELECT e_m.*, m.fio, m.gender, m.tel_1, m.memb_email, m.size_cloth, m.size_shoe, c.name_city, 
                    COUNT(m_i_d.id) as days_with_dept, e.price
                FROM eventmemb e_m
                LEFT JOIN member m on m.id=e_m.eventmemb_memb 
                LEFT JOIN city c on m.memb_city=c.id
                LEFT JOIN member_in_depart m_i_d on m_i_d.membd_memb =e_m.id
                LEFT JOIN eventalp e on e.id=e_m.eventmemb_even
                WHERE eventmemb_even='${eventId}'
                GROUP BY e_m.id
                ORDER BY m.fio ASC`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      const fullResult = result.map(item => {
        const memberDays = (new Date(item.eventmemb_datef) - new Date(item.eventmemb_dates)) / (1000 * 60 * 60 * 24) + 1
        const daysWithDept = item.days_with_dept
        // console.log('fio', item.fio, memberDays, daysWithDept)
        const allDaysWithDept = daysWithDept >= memberDays
        const alerts = []
        if (!allDaysWithDept) {
          alerts.push('У участника не указано отделение на некоторые дни')
        }
        if (item.eventmemb_pred < item.price && item.eventmemb_role === 'Участник') {
          alerts.push('У участника не полная оплата')
        }
        return { ...item, allDaysWithDept, alerts }
      })
      res.send(fullResult);
    });
  })

  app.put('/eventList/:eventId/member/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    const { eventmemb_nstrah, eventmemb_nmed, eventmemb_memb, eventmemb_dates, eventmemb_datef, eventmemb_gen, eventmemb_pred, eventmemb_opl, eventmemb_role } = req.body;
    pool.query(`INSERT INTO eventmemb 
      ( eventmemb_nstrah, eventmemb_nmed, eventmemb_memb, eventmemb_dates, eventmemb_datef,eventmemb_even,eventmemb_gen,eventmemb_pred,eventmemb_opl,eventmemb_role) 
      VALUES(?,?,?,?,?,?,?,?,?,?)`,
      [eventmemb_nstrah, eventmemb_nmed, eventmemb_memb, eventmemb_dates, eventmemb_datef, eventId, eventmemb_gen, eventmemb_pred, eventmemb_opl || 0, eventmemb_role], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
  })
  app.post('/eventList/:eventId/member/:memberId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { memberId, eventId } = req.params;
    const { eventmemb_nstrah, eventmemb_nmed, eventmemb_dates, eventmemb_datef, eventmemb_gen, eventmemb_pred, eventmemb_opl, eventmemb_role } = req.body;
    pool.query(`UPDATE eventmemb SET 
      eventmemb_nstrah=${eventmemb_nstrah},
      eventmemb_nmed=${eventmemb_nmed},
      eventmemb_dates='${eventmemb_dates}',
      eventmemb_datef='${eventmemb_datef}',
      eventmemb_gen=${eventmemb_gen},
      eventmemb_pred=${eventmemb_pred},
      eventmemb_opl=${eventmemb_opl},
      eventmemb_role='${eventmemb_role}',
      updated_date=CURRENT_TIMESTAMP WHERE id=${memberId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.delete('/eventList/:eventId/member/:memberId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const memberId = req.params.memberId;
    pool.query(`DELETE FROM eventmemb WHERE id=${memberId}`, (error, result) => {
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
module.exports = eventMemberRouter;