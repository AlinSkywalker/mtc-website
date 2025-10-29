// Load the MySQL pool connection
const pool = require("../mysql")

// Route the app
const eventDepartPlanLabaAscentRouter = (app, passport) => {
  app.get('/eventList/:eventId/department/:departmentId/plan/:planId/labaAscents', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { planId } = req.params;
    pool.query(`SELECT * FROM laba_route_ascent WHERE depart_plan='${planId}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.put(
    "/eventList/:eventId/department/:departmentId/plan/:planId/labaAscents",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { planId } = req.params;
      const { withAccept } = req.query;

      const {
        data,
        ascent_date,
      } = req.body;
      let insertStatement = data.map((item) => {
        const { ascent_member, ascent_belay, ascent_type, laba_route } = item
        return `(${planId}, ${ascent_member}, '${ascent_date}', '${ascent_belay}', '${ascent_type}', ${laba_route} )`
      }).join(", ");

      pool.query(
        `DELETE FROM laba_route_ascent 
          WHERE depart_plan=${planId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `INSERT INTO laba_route_ascent 
            ( depart_plan, ascent_member, ascent_date, ascent_belay,ascent_type,laba_route) 
            VALUES ${insertStatement}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              if (withAccept) {
                pool.query(
                  `UPDATE depart_plan dp SET accepted='Зачтено', updated_date=CURRENT_TIMESTAMP WHERE id='${planId}'`,
                  (error, result) => {
                    if (error) {
                      console.log(error);
                      res.status(500).json({ success: false, message: error });
                      return;
                    }
                    res.json({ success: true });
                  })
              }
              else {
                res.json({ success: true });
              }

            }
          );
        }
      );
    }
  );

}

// Export the router
module.exports = eventDepartPlanLabaAscentRouter;