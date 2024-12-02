// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventListRouter = (app, passport) => {
  app.get('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
      JOIN base b ON e.event_base=b.id 
      JOIN member m_ob on e.event_ob = m_ob.id
      JOIN member m_st on e.event_st = m_st.id`, (error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  })
  app.get('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
      JOIN base b ON e.event_base=b.id 
      JOIN member m_ob on e.event_ob = m_ob.id
      JOIN member m_st on e.event_st = m_st.id WHERE e.id='${id}'`, (error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  })

}

// Export the router
module.exports = eventListRouter;