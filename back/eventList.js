// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventListRouter = (app, passport) => {
  app.get('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, rai.rai_name FROM eventalp e 
      LEFT JOIN raion rai on e.event_raion=rai.id
      LEFT JOIN member m_ob on e.event_ob = m_ob.id
      LEFT JOIN member m_st on e.event_st = m_st.id`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      // console.log(result[0].event_start)
      res.send(result);
    });
  })
  app.put('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { event_name,
      event_raion,
      event_start,
      event_finish,
      event_st,
      event_ob,
      event_desc } = req.body;
    pool.query(`INSERT INTO eventalp (event_name, event_raion, event_start,event_finish, event_st, event_ob,event_desc) 
                  VALUES('${event_name}',
                  ${event_raion},
                  CONVERT('${event_start}',DATETIME),
                  CONVERT('${event_finish}',DATETIME),
                  ${event_st},
                  ${event_ob},
                  '${event_desc}')`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.json({ success: true });
      })
  })

  app.get('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, rai.rai_name FROM eventalp e 
      LEFT JOIN raion rai on e.event_raion=rai.id
      LEFT JOIN member m_ob on e.event_ob = m_ob.id
      LEFT JOIN member m_st on e.event_st = m_st.id WHERE e.id='${id}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      if (result.length == 0) {
        res.send('Ничего не найдено');
        return
      }
      const { ob_fio, event_ob, st_fio, event_st, rai_name, event_raion } = result[0]
      const fullResult = { ...result[0], ob: { fio: ob_fio, id: event_ob }, st: { fio: st_fio, id: event_st }, raion: { rai_name, id: event_raion } }
      res.send(fullResult);
    });
  })
  app.post('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    const { event_name,
      event_raion,
      event_start,
      event_finish,
      event_st,
      event_ob,
      event_desc } = req.body;
    pool.query(`UPDATE eventalp SET 
        event_name=?,
        event_start=?,
        event_finish=?,
        event_raion=${event_raion},
        event_st=${event_st},
        event_ob=${event_ob},
        event_desc=?,
        updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [event_name, event_start, event_finish, event_desc], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.delete('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`DELETE FROM eventalp WHERE id=${id}`, (error, result) => {
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
module.exports = eventListRouter;