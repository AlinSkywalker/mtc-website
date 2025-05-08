// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  // routeDictionary
  app.get(
    "/routeDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT r.*, m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name  FROM route r 
                LEFT JOIN mount m ON r.rout_mount=m.id
                LEFT JOIN raion rai ON m.mount_rai=rai.id
                LEFT JOIN region reg ON rai.rai_reg = reg.id
                ORDER BY rai.rai_num, m.mount_name, r.rout_name`,
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
    "/routeDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        rout_mount,
        rout_desc,
        rout_per,
        rout_sup,
        rout_tip,
        rout_comp,
        rout_name,
        rout_winter,
      } = req.body;
      pool.query(
        `INSERT INTO route (rout_mount, rout_desc, rout_per, rout_sup, rout_tip, rout_comp, rout_name,rout_winter) VALUES(?,?,?,?,?,?,?,?)`,
        [
          rout_mount,
          rout_desc,
          rout_per || null,
          rout_sup,
          rout_tip,
          rout_comp,
          rout_name,
          rout_winter,
        ],
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
    "/routeDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        rout_mount,
        rout_desc,
        rout_per,
        rout_sup,
        rout_tip,
        rout_comp,
        rout_name,
        rout_winter,
      } = req.body;
      pool.query(
        `UPDATE route SET 
      rout_mount=${rout_mount},
      rout_desc='${rout_desc}', 
      rout_per=?, 
      rout_sup='${rout_sup}',
      rout_tip='${rout_tip}', 
      rout_comp='${rout_comp}', 
      rout_name='${rout_name}',
      rout_winter=${rout_winter},
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        [rout_per || null],
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
    "/routeDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM route WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
        return;
      });
    }
  );
};

// Export the router
module.exports = dictionaryRouter;
