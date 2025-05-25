// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  // contractorDictionary
  app.get(
    "/contractorDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const baseId = req.query.baseId;
      if (baseId) {
        pool.query(
          `SELECT c.* FROM contr_in_base b_c LEFT JOIN contractor c on c.id = b_c.base_contr WHERE b_c.base_base='${baseId}'`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else {
        pool.query(`SELECT * FROM contractor`, (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const returnType = req.query.returnType;
          if (returnType == "objectType") {
            const newResult = {};
            result.forEach((item) => {
              newResult[item.id] = { ...item, name: item.cont_fio };
            });
            res.send(newResult);
          } else {
            res.send(result);
          }
        });
      }
    }
  );

  app.put(
    "/contractorDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        cont_fio,
        cont_desc,
        cont_email,
        cont_tel3,
        cont_tel2,
        cont_tel1,
        cont_zan,
      } = req.body;
      pool.query(
        `INSERT INTO contractor (cont_fio, cont_desc, cont_email,cont_tel3, cont_tel2, cont_tel1,cont_zan) VALUES(?,?,?,?,?,?,?)`,
        [
          cont_fio,
          cont_desc,
          cont_email,
          cont_tel3,
          cont_tel2,
          cont_tel1,
          cont_zan,
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
    "/contractorDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        cont_fio,
        cont_desc,
        cont_email,
        cont_tel3,
        cont_tel2,
        cont_tel1,
        cont_zan,
      } = req.body;
      pool.query(
        `UPDATE contractor SET 
      cont_fio='${cont_fio}',
      cont_desc='${cont_desc}', 
      cont_email='${cont_email}',
      cont_tel3='${cont_tel3}',
      cont_tel2='${cont_tel2}',
      cont_tel1='${cont_tel1}',
      cont_zan='${cont_zan}',
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
    "/contractorDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM contractor WHERE id=${id}`, (error, result) => {
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
