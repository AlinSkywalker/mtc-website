// Load the MySQL pool connection
const pool = require("../mysql")

// Route the app
const memberLabaAscentRouter = (app, passport) => {
  app.get('/memberList/:memberId/labaAscent', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { memberId } = req.params;
    pool.query(`SELECT l_r_a.*,l_t.labatr_name, l_t.labatr_typ, l_t.labatr_sl, l.laba_name
                  FROM laba_route_ascent l_r_a
                    LEFT OUTER JOIN laba_tr l_t ON l_t.id=l_r_a.laba_route
                    LEFT OUTER JOIN laba l ON l.id = l_t.labatr_lab
                  WHERE ascent_member='${memberId}'
                  ORDER BY ascent_date DESC`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.put('/memberList/:memberId/labaAscent', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { memberId: id } = req.params;
    const {
      ascent_date,
      ascent_belay,
      ascent_type,
      laba_route,
    } = req.body;
    pool.query(`INSERT INTO laba_route_ascent 
              ( ascent_member, ascent_date, ascent_belay, ascent_type,laba_route)  
               VALUES(?,?,?,?,?)`,
      [id, ascent_date, ascent_belay, ascent_type, laba_route], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);

      });
  })
  app.post('/memberList/:memberId/labaAscent/:ascentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { ascentId: id } = req.params
    const {
      ascent_date,
      ascent_belay,
      ascent_type,
      laba_route,
    } = req.body;
    pool.query(`UPDATE laba_route_ascent SET 
      ascent_date=?,
      ascent_belay=?,
      ascent_type=?,
      laba_route=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [ascent_date, ascent_belay, ascent_type, laba_route], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.delete('/memberList/:id/labaAscent/:ascentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { ascentId: id } = req.params
    pool.query(`DELETE FROM laba_route_ascent WHERE id=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  // app.put(
  //   "/eventList/:eventId/department/:departmentId/plan/:planId/labaAscents",
  //   passport.authenticate("jwt", { session: false }),
  //   (req, res) => {
  //     const { planId } = req.params;
  //     const {
  //       data,
  //       ascent_date,
  //     } = req.body;
  //     let insertStatement = data.map((item) => {
  //       const { ascent_member, ascent_belay, ascent_type, laba_route } = item
  //       return `(${planId}, ${ascent_member}, '${ascent_date}', '${ascent_belay}', '${ascent_type}', ${laba_route} )`
  //     }).join(", ");
  //     pool.query(
  //       `INSERT INTO laba_route_ascent 
  //     ( depart_plan, ascent_member, ascent_date, ascent_belay,ascent_type,laba_route) 
  //     VALUES ${insertStatement}`,
  //       (error, result) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).json({ success: false, message: error });
  //           return;
  //         }
  //         res.json({ success: true });
  //       }
  //     );
  //   }
  // );

}

// Export the router
module.exports = memberLabaAscentRouter;