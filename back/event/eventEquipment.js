// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const eventEquipmentRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/equipment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT e_e.*, e.equip_name as equip_type
                  FROM event_equipment e_e
                  LEFT JOIN equip e on e.id = e_e.equip
                  WHERE e_e.event_id = ${eventId}
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
    "/eventList/:eventId/equipment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      const { equip_id, quantity, type } =
        req.body;
      pool.query(
        `INSERT INTO event_equipment ( event_id,equip_id, quantity, type) 
            VALUES(?,?,?,?,)`,
        [
          eventId, equip_id || null, quantity, type
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
    "/eventList/:eventId/equipment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { equip_id, quantity, type } =
        req.body;
      pool.query(
        `UPDATE event_equipment SET 
          equip_id=?,
          quantity=?,
          type=?,
          updated_date=CURRENT_TIMESTAMP 
          WHERE id=${id}`,
        [
          equip_id, quantity, type
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
    "/eventList/:eventId/equipment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `DELETE FROM event_equipment WHERE id=${id}`,
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
module.exports = eventEquipmentRouter;
