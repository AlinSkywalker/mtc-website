// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {

  // laboratoryDictionary
  app.get(
    "/laboratoryDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT l.*, r.rai_name, r.rai_reg, reg.region_name FROM laba l 
                LEFT JOIN raion r ON l.laba_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                ORDER BY laba_name ASC`,
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
    "/laboratoryDictionaryByName/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { name } = req.query;
      pool.query(
        `SELECT l.*, r.rai_name, r.rai_reg, reg.region_name FROM laba l 
                LEFT JOIN raion r ON l.laba_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                WHERE laba_name='${name}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result[0]);
        }
      );
    }
  );

  app.put(
    "/laboratoryDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { laba_name, laba_desk, laba_rai } = req.body;
      pool.query(
        `INSERT INTO laba (laba_name, laba_desk, laba_rai) VALUES(?,?,?)`,
        [laba_name, laba_desk, laba_rai],
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
    "/laboratoryDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { laba_name, laba_desk, laba_rai } = req.body;
      pool.query(
        `UPDATE laba SET 
      laba_name='${laba_name}',
      laba_desk='${laba_desk}', 
      laba_rai='${laba_rai}',
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
    "/laboratoryDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM laba WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );
  app.get(
    "/laboratoryDictionaryForEvent/:eventId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT l.*, r.rai_name, r.rai_reg, reg.region_name FROM laba l 
                LEFT JOIN raion r ON l.laba_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                WHERE laba_rai IN (SELECT raion_m FROM eventalp_in_raion WHERE event_m=${eventId})`,
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

  // laboratoryRouteDictionary
  app.get(
    "/laboratoryRouteDictionary/:laboratoryId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.laboratoryId;
      if (id === "undefined") {
        res.send([]);
        return;
      }
      pool.query(
        `SELECT * FROM laba_tr WHERE labatr_lab=${id}`,
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
    "/laboratoryRouteDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        labatr_name,
        labatr_typ,
        labatr_sl,
        labatr_dl,
        labatr_kolb,
        labatr_lab,
        labatr_desk,
      } = req.body;
      pool.query(
        `INSERT INTO laba_tr (labatr_name, labatr_typ, labatr_sl,labatr_dl,labatr_kolb,labatr_lab,labatr_desk) VALUES(?,?,?,?,?,?,?)`,
        [
          labatr_name,
          labatr_typ,
          labatr_sl,
          labatr_dl || 0,
          labatr_kolb || 0,
          labatr_lab,
          labatr_desk,
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
    "/laboratoryRouteDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        labatr_name,
        labatr_typ,
        labatr_sl,
        labatr_dl,
        labatr_kolb,
        labatr_desk,
      } = req.body;
      pool.query(
        `UPDATE laba_tr SET 
      labatr_name='${labatr_name}',
      labatr_typ='${labatr_typ}', 
      labatr_sl='${labatr_sl}',
      labatr_dl=?,
      labatr_kolb=?,
      labatr_desk=?,
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        [labatr_dl || 0, labatr_kolb || 0, labatr_desk],
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
    "/laboratoryRouteDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM laba_tr WHERE id=${id}`, (error, result) => {
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
