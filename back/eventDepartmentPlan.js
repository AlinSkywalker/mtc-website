// Load the MySQL pool connection
const pool = require("./mysql")
const getDatesInRange = require("./getDatesInRange")

// Route the app
const eventDepartmentPlanRouter = (app, passport) => {
  app.get('/eventList/:eventId/departments/allDepartmentPlan/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('allDepartmentPlan')
    const { eventId, departmentId } = req.params;
    pool.query(`SELECT * FROM eventalp WHERE id=${eventId}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      pool.query(`SELECT dp.*, l.laba_name, r.rout_name, m.mount_name, r.rout_comp
                  FROM depart_plan dp 
                  LEFT JOIN depart d ON dp.department=d.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  WHERE d.depart_event=${eventId}
                  `, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    })

  })
  app.get('/eventList/:eventId/department/:departmentId/plan/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('/eventList/:eventId/department/:departmentId/plan/')
    const { eventId, departmentId } = req.params;
    pool.query(`SELECT dp.*, r.rout_name, r.rout_mount, r.rout_comp, 
                m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name,
                l.laba_name, l.laba_rai, l_rai.rai_name as l_rai_name, l_rai.rai_reg  as l_rai_reg, l_reg.region_name as l_region_name
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON m.mount_rai=rai.id
                  LEFT JOIN region reg ON rai.rai_reg = reg.id
                  LEFT JOIN laba l on l.id=dp.laba
                  LEFT JOIN raion l_rai ON l.laba_rai=l_rai.id
                  LEFT JOIN region l_reg ON l_rai.rai_reg = l_reg.id
                WHERE department='${departmentId}' ORDER BY dp.start ASC`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })


  app.put('/eventList/:eventId/department/:departmentId/plan/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { eventId, departmentId } = req.params;
    const { route, start, ob_agreement, ascplan_ruk, type, laba } = req.body;
    pool.query(`INSERT INTO depart_plan 
      ( department, route, start, ob_agreement, ascplan_ruk,type,laba) 
      VALUES(?,?,?,?,?,?,?)`,
      [departmentId, route || null, start, ob_agreement, ascplan_ruk || null, type, laba || null], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
  })
  app.post('/eventList/:eventId/department/:departmentId/plan/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params;
    const { route, start, ob_agreement, ascplan_ruk, type, laba } = req.body;
    pool.query(`UPDATE depart_plan SET 
      route=?,
      start=?,
      ob_agreement=?,
      ascplan_ruk=?,
      type=?,
      laba=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [route || null, start, ob_agreement, ascplan_ruk || null, type, laba || null], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });

  })
  app.delete('/eventList/:eventId/department/:departmentId/plan/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id } = req.params;
    pool.query(`DELETE FROM depart_plan WHERE id=${id}`, (error, result) => {
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
module.exports = eventDepartmentPlanRouter;