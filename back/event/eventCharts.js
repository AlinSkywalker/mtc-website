// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const eventChartsRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/ascentChart/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT 
                r.rout_comp,
                COUNT(r.id) as rount_comp_count
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN depart d on d.id=dp.department
                WHERE d.depart_event=${eventId} AND dp.type='Восхождение' AND dp.accepted='Зачтено'
                GROUP BY r.rout_comp
                ORDER BY r.rout_comp ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.reduce((acc, item, index) => {
            acc.push({ rout_comp: item.rout_comp, count: item.rount_comp_count })
            return acc
          }, [])
          res.send(fullResult);
        }
      );
    }
  );
  app.get(
    "/eventList/:eventId/memberChart/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT COUNT(em.id) as member_count,IFNULL(m_s_c.ball, 'б/р') AS alprazr 
          FROM eventmemb em
          LEFT JOIN eventalp e ON e.id=em.eventmemb_even
          LEFT JOIN member_sport_category m_s_c ON m_s_c.id=
                            (SELECT id FROM member_sport_category t1 WHERE type='Разряд' and t1.member=em.eventmemb_memb AND date_completion<e.event_start  
                            ORDER BY date_completion DESC LIMIT 1)
          WHERE em.eventmemb_even =${eventId}
          GROUP BY alprazr`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          let number = 0
          const fullResult = result.reduce((acc, item, index) => {
            acc.push({ value: item.member_count, name: item.alprazr })
            return acc
          }, [])
          res.send(fullResult);
        }
      );
    }
  );
};

// Export the router
module.exports = eventChartsRouter;
