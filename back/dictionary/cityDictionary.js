// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  // cityDictionary
  app.get(
    "/cityDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT c.*, s.sub_name, o.okr_name, ctry.count_name FROM city c
          LEFT JOIN subekt s on s.id = c.city_sub
          LEFT JOIN okrug o on o.id = s.sub_okr
          LEFT JOIN country ctry on ctry.id = o.okr_count
        ORDER BY name_city ASC`,
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
    "/cityDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { name_city, desc_city, pred_city, tel_city, email, city_sub } =
        req.body;
      pool.query(
        `INSERT INTO city ( name_city, desc_city, pred_city, tel_city, email, city_sub) VALUES(?,?,?,?,?,?)`,
        [name_city, desc_city, pred_city, tel_city, email, city_sub || null],
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
    "/cityDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { name_city, desc_city, pred_city, tel_city, email, city_sub } =
        req.body;
      pool.query(
        `UPDATE city SET 
      name_city='${name_city}',
      desc_city='${desc_city}',
      pred_city='${pred_city}',
      tel_city='${tel_city}',
      email='${email}',
      city_sub='${city_sub || null}',
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
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
    "/cityDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM city WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );

  app.get(
    "/countryDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT * FROM country ORDER BY count_name ASC`,
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
  app.get(
    "/okrugDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT * FROM okrug ORDER BY okr_name ASC`,
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
  app.get(
    "/subektDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT s.id, s.sub_name, o.okr_name, c.count_name FROM subekt s
          LEFT JOIN okrug o on o.id = s.sub_okr
          LEFT JOIN country c on c.id = o.okr_count
          ORDER BY sub_name ASC`,
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
};
// Export the router
module.exports = dictionaryRouter;
