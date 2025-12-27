const pool = require("../mysql");

// Route the app
const equipmentRouter = (app, passport) => {
  //storage
  app.get(
    "/dictionary/storage",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT *
        FROM storage s
        ORDER BY stor_name ASC`,
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
    "/dictionary/storage",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { stor_name, stor_desk, morg, stor_user } =
        req.body;
      pool.query(
        `INSERT INTO storage ( stor_name, stor_desk, morg, stor_user) VALUES(?,?,?,?)`,
        [stor_name, stor_desk, morg, stor_user || null],
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
    "/dictionary/storage/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { stor_name, stor_desk, morg } =
        req.body;
      pool.query(
        `UPDATE storage SET 
      stor_name='${stor_name}',
      stor_desk='${stor_desk}',
      morg='${morg}',
      updated_date=CURRENT_TIMESTAMP 
      WHERE id=${id}`,
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
    "/dictionary/storage/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM storage WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );

  //equipmentType
  app.get(
    "/dictionary/equipmentType",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT * FROM equip e
        ORDER BY equip_name ASC`,
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
    "/dictionary/equipmentType",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { equip_name, equip_desk, equip_type, equip_price, equip_loss_price } =
        req.body;
      pool.query(
        `INSERT INTO equip ( equip_name, equip_desk, equip_type, equip_price, equip_loss_price) VALUES(?,?,?,?,?)`,
        [equip_name, equip_desk, equip_type, equip_price || null, equip_loss_price || null],
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
    "/dictionary/equipmentType/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { equip_name, equip_desk, equip_type, equip_price, equip_loss_price } =
        req.body;
      pool.query(
        `UPDATE equip SET 
          equip_name='${equip_name}',
          equip_desk='${equip_desk}',
          equip_type='${equip_type}',
          equip_price='${equip_price || null}',
          equip_loss_price='${equip_loss_price || null}',
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
    "/dictionary/equipmentType/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM equip WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  //eqipmentTemplate
  app.get(
    "/dictionary/equipmentTemplate",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT * FROM equipment_template e
        ORDER BY template_name ASC`,
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
module.exports = equipmentRouter;
