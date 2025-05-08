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
        `SELECT * FROM city ORDER BY name_city ASC`,
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
      const { name_city, desc_city, pred_city, tel_city, email } = req.body;
      pool.query(
        `INSERT INTO city ( name_city, desc_city, pred_city, tel_city, email) VALUES(?,?,?,?,?)`,
        [name_city, desc_city, pred_city, tel_city, email],
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
      const { name_city, desc_city, pred_city, tel_city, email } = req.body;
      pool.query(
        `UPDATE city SET 
      name_city='${name_city}',
      desc_city='${desc_city}',
      pred_city='${pred_city}',
      tel_city='${tel_city}',
      email='${email}',
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
    "/trainingProgram",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(`SELECT * FROM progr_pod`, (error, resultAll) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        pool.query(
          `SELECT prog_razd FROM progr_pod GROUP BY prog_razd`,
          (error, resultUnique) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            const returnType = req.query.returnType;
            if (returnType == "objectType") {
              const newResult = {};
              resultAll.forEach((item) => {
                newResult[item.id] = { ...item, name: item.prog_tem, parent: item.prog_razd };
              });
              res.send({
                data: newResult,
                razdelList: resultUnique.map((item) => item.prog_razd),
              });
            } else {
              res.send(
                resultAll,
              );
            }

          }
        );
      });
    }
  );
};

// Export the router
module.exports = dictionaryRouter;
