// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const memberEquipmentRouter = (app, passport) => {
  app.get(
    "/memberList/:memberId/equipment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId } = req.params;
      pool.query(
        `SELECT e_m.*, e.equip_name as equip_type, s.stor_name 
                  FROM equip_mtc e_m
                  LEFT JOIN equip e on e.id = e_m.equip
                  LEFT JOIN storage s on s.id = e_m.equip_storage
                  WHERE e_m.equip_member = ${memberId}
                  ORDER BY e.equip_name DESC`,
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
    "/memberList/:memberId/equipment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId } = req.params;
      const { equip, equip_storage, loss, quantity, equip_name } =
        req.body;
      pool.query(
        `INSERT INTO equip_mtc ( equip_member,equip, equip_storage, loss, quantity, equip_name) 
            VALUES(?,?,?,?,?,?)`,
        [
          memberId, equip, equip_storage || null, loss, quantity, equip_name
        ],
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
    "/memberList/:memberId/equipment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { equip, equip_storage, loss, quantity, equip_name } =
        req.body;
      pool.query(
        `UPDATE equip_mtc SET 
          equip=?,
          equip_storage=?,
          loss=?,
          quantity=?,
          equip_name=?,
          updated_date=CURRENT_TIMESTAMP 
          WHERE id=${id}`,
        [
          equip, equip_storage || null, loss, quantity, equip_name
        ],
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
    "/memberList/:memberId/equipment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `DELETE FROM equip_mtc WHERE id=${id}`,
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
module.exports = memberEquipmentRouter;
