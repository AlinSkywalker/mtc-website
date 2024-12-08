// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventListRouter = (app, passport) => {
  app.get('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
      JOIN base b ON e.event_base=b.id 
      JOIN member m_ob on e.event_ob = m_ob.id
      JOIN member m_st on e.event_st = m_st.id`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { event_name,
      event_base,
      event_start,
      event_finish,
      event_st,
      event_ob,
      event_desc } = req.body;
    pool.query(`INSERT INTO eventalp (event_name, event_base, event_start,event_finish, event_st, event_ob,event_desc) 
                  VALUES('${event_name}',
                  ${event_base},
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
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
      JOIN base b ON e.event_base=b.id 
      JOIN member m_ob on e.event_ob = m_ob.id
      JOIN member m_st on e.event_st = m_st.id WHERE e.id='${id}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      if (result.length == 0) {
        res.send('Ничего не найдено');
        return
      }
      const { ob_fio, event_ob, st_fio, event_st, base_name, event_base } = result[0]
      const fullResult = { ...result[0], ob: { fio: ob_fio, id: event_ob }, st: { fio: st_fio, id: event_st }, base: { base_name, id: event_base } }
      res.send(fullResult);
    });
  })
  app.post('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    const { event_name,
      event_base,
      event_start,
      event_finish,
      event_st,
      event_ob,
      event_desc } = req.body;
    pool.query(`UPDATE eventalp SET 
        event_name='${event_name}',
        event_start=CONVERT('${event_start}',DATETIME),
        event_finish=CONVERT('${event_finish}',DATETIME),
        event_base=${event_base},
        event_st=${event_st},
        event_ob=${event_ob},
        event_desc='${event_desc}',
        updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, (error, result) => {
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