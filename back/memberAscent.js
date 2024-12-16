// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const memberAscentRouter = (app, passport) => {

  app.get('/memberList/:memberId/ascent', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.memberId;
    pool.query(`SELECT a.*, r.rout_name, r.rout_mount, r.rout_comp, m.mount_name,e.event_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name FROM ascent a
                  LEFT JOIN route r on r.id=a.asc_route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON m.mount_rai=rai.id
                  LEFT JOIN region reg ON rai.rai_reg = reg.id
                  LEFT JOIN eventalp e on e.id=a.asc_event
                  WHERE a.asc_memb=${id}
                  ORDER BY a.asc_date DESC`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/memberList/:memberId/ascent', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.memberId;
    const { asc_event,
      asc_route,
      asc_date,
      asc_typ,
      asc_kolu,
      asc_ruk,
      asc_times,
      asc_timesf
    } = req.body;
    pool.query(`INSERT INTO ascent ( asc_memb, asc_event, asc_route, asc_date, asc_typ,asc_kolu,asc_ruk,asc_times,asc_timesf) VALUES(?,?,?,?,?,?,?,?,?)`,
      [id, asc_event || null, asc_route, asc_date, asc_typ, asc_kolu || null, asc_ruk, asc_times, asc_timesf], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);

      });
  })
  app.post('/memberList/:memberId/ascent/:ascentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.ascentId;
    const { asc_event,
      asc_route,
      asc_date,
      asc_typ,
      asc_kolu,
      asc_ruk,
      asc_times,
      asc_timesf
    } = req.body;
    pool.query(`UPDATE ascent SET 
      asc_event=?,
      asc_route=?,
      asc_date=?,
      asc_typ=?,
      asc_kolu=?,
      asc_ruk=?,
      asc_times=?,
      asc_timesf=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [asc_event || null, asc_route, asc_date, asc_typ, asc_kolu || null, asc_ruk, asc_times, asc_timesf], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.delete('/memberList/:id/ascent/:ascentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.ascentId;
    pool.query(`DELETE FROM ascent WHERE id=${id}`, (error, result) => {
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
module.exports = memberAscentRouter;