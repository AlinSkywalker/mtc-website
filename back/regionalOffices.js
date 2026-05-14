// Load the MySQL pool connection
const pool = require("./mysql");
const checkAdminAccess = require('./authAdminRoleMiddleware');

// Route the app
const regionalOfficesRouter = (app, passport) => {
  app.get(
    "/regionalOffices/",
    (req, res) => {
      pool.query(
        `SELECT ro.*, m.fio, m.tel_1, m.memb_email, s.sub_name, CONVERT(m.photo_preview USING utf8) as photo_preview
                FROM regional_offices ro
                LEFT JOIN member m ON m.id=ro.director_member_id
                LEFT JOIN subekt s ON s.id=ro.region`,
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
    "/regionalOffices",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const { member_id, position } = req.body;
      pool.query(
        `INSERT INTO regional_offices (member_id, position) VALUES(?,?)`,
        [member_id, position],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.json({ success: true });
        }
      );
    }
  );
  app.post(
    "/regionalOffices/:id",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const id = req.params.id;
      const { member_id, position } = req.body;
      pool.query(
        `UPDATE regional_offices SET 
      member_id='${member_id}',
      position='${position}', 
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.json({ success: true });
        }
      );
    }
  );
  app.delete(
    "/regionalOffices/:id",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM regional_offices WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );
};

// Export the router
module.exports = regionalOfficesRouter;
