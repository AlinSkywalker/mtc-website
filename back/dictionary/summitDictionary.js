// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  // summitDictionary
  app.get(
    "/summitDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT m.*, r.rai_name, r.rai_reg, reg.region_name FROM mount m 
                LEFT JOIN raion r ON m.mount_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                ORDER BY r.rai_num, m.mount_name`,
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
    "/summitDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { mount_rai, mount_desc, mount_height, mount_name } = req.body;
      pool.query(
        `INSERT INTO mount (mount_rai, mount_desc, mount_height, mount_name) VALUES(?,?,?,?)`,
        [mount_rai, mount_desc, mount_height || null, mount_name],
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
    "/summitDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { mount_rai, mount_desc, mount_height, mount_name } = req.body;
      pool.query(
        `UPDATE mount SET 
      mount_rai='${mount_rai}',
      mount_desc='${mount_desc}', 
      mount_height='${mount_height || null}', 
      mount_name='${mount_name}',
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
    "/summitDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM mount WHERE id=${id}`, (error, result) => {
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
module.exports = dictionaryRouter;
