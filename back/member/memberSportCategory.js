// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const memberSportCategoryRouter = (app, passport) => {
  app.get(
    "/memberList/:memberId/sportCategory",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId } = req.params;
      pool.query(
        `SELECT *   
                  FROM member_sport_category m 
                  WHERE m.member = ${memberId}
                  ORDER BY m.date_pr DESC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );


  app.put(
    "/memberList/:memberId/sportCategory",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId } = req.params;
      const {
        type,
        ball,
        date_pr,
      } = req.body;
      pool.query(
        `INSERT INTO member_sport_category ( member,type,ball,date_pr) 
            VALUES(?,?,?,?)`,
        [
          memberId,
          type,
          ball,
          date_pr || null
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );
  app.post(
    "/memberList/:memberId/sportCategory/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        type,
        ball,
        date_pr,
      } = req.body;
      pool.query(
        `UPDATE member_sport_category SET 
      type=?,
      ball=?,
      date_pr=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [
          type,
          ball,
          date_pr || null
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.delete(
    "/memberList/:memberId/sportCategory/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM member_sport_category WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
};

// Export the router
module.exports = memberSportCategoryRouter;
