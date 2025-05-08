// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  //regionDictionary
  app.get(
    "/regionDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(`SELECT * FROM region`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  app.put(
    "/regionDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { name, desc } = req.body;
      pool.query(
        `INSERT INTO region (region_name, region_desk) VALUES(?,?)`,
        [name, desc],
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
    "/regionDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { name, desc } = req.body;
      pool.query(
        `UPDATE region SET 
      region_name='${name}',
      region_desk='${desc}',
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
    "/regionDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM region WHERE id=${id}`, (error, result) => {
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
