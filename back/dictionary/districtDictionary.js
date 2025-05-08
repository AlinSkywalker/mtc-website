// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {

  // districtDictionary
  app.get(
    "/districtDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT r.*, reg.id AS region_id, reg.region_name FROM raion r 
                LEFT JOIN region reg on reg.id=r.rai_reg`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const returnType = req.query.returnType;
          if (returnType == "objectType") {
            const newResult = {};
            result.forEach((item) => {
              newResult[item.id] = { ...item, name: item.rai_name, parent: item.region_name };
            });
            res.send(newResult);
          } else {
            res.send(result);
          }
        }
      );
    }
  );
  app.put(
    "/districtDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { rai_name, rai_desc, rai_num, rai_reg } = req.body;
      pool.query(
        `INSERT INTO raion (rai_name, rai_desc, rai_num, rai_reg) VALUES(?,?,?,?)`,
        [rai_name, rai_desc, rai_num, rai_reg],
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
    "/districtDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { rai_name, rai_desc, rai_num, rai_reg } = req.body;
      pool.query(
        `UPDATE raion SET 
      rai_name='${rai_name}',
      rai_desc='${rai_desc}', 
      rai_num='${rai_num}', 
      rai_reg='${rai_reg}',
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
    "/districtDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM raion WHERE id=${id}`, (error, result) => {
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
