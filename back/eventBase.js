// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const eventBaseRouter = (app, passport) => {
  // Базы меропрития
  app.get(
    "/eventList/:eventId/eventBase/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT b.*, b_e.id
                FROM base_in_eventalp b_e 
                LEFT JOIN base b ON b.id=b_e.base_m
                WHERE b_e.event_m='${eventId}'`,
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
    "/eventList/:eventId/eventBase/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      // const { eventId } = req.params;
      const { base_m, event_m } = req.body;
      pool.query(
        `INSERT INTO base_in_eventalp 
          ( base_m, event_m) 
          VALUES(?,?)`,
        [base_m, event_m],
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
    "/eventList/:eventId/eventBase/:baseId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseId } = req.params;
      pool.query(
        `DELETE FROM base_in_eventalp WHERE id=${baseId}`,
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

  //Для выпадашки с базами в мероприятии
  app.get(
    "/eventList/:eventId/baseForEvent/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT * FROM base
          WHERE base_rai=(SELECT event_raion FROM eventalp WHERE id=${eventId})
          AND id NOT IN (SELECT base_m FROM base_in_eventalp WHERE event_m=${eventId})`,
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

  // Забронированные Номера
  app.get(
    "/eventList/:eventId/baseHouseRoom/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT b_e.*, bf_n.basenom_name, bf_n.basenom_mest, bf_d.basefd_name, bf_d.id as basehouse_id
                FROM baseroom_in_event b_e 
                LEFT JOIN base_house_room bf_n on bf_n.id=b_e.basefd 
                LEFT JOIN base_house bf_d on bf_d.id=bf_n.basenom_fd 
                
                WHERE event='${eventId}'`,
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
    "/eventList/:eventId/baseHouseRoom/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      const { basefd, date_st, date_f } = req.body;
      pool.query(
        `INSERT INTO baseroom_in_event 
          ( event, basefd, date_st, date_f) 
          VALUES(?,?,?,?)`,
        [eventId, basefd, date_st, date_f],
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
    "/eventList/:eventId/baseHouseRoom/:baseId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseId, eventId } = req.params;
      const { date_st, date_f } = req.body;
      pool.query(
        `UPDATE baseroom_in_event SET 
      date_st='${date_st}',
      date_f='${date_f}',
      updated_date=CURRENT_TIMESTAMP WHERE event=${eventId} AND basefd=${baseId}`,
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
    "/eventList/:eventId/baseHouseRoom/:baseId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseId } = req.params;
      pool.query(
        `DELETE FROM baseroom_in_event WHERE id=${baseId}`,
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

  // Для выпадашки с домами под мероприятием
  app.get(
    "/eventList/:eventId/baseHouseForEvent/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      pool.query(
        `SELECT bf_d.*, b.base_name
                FROM base_house bf_d
                LEFT JOIN base b on b.id=bf_d.basefd_base  
                WHERE bf_d.basefd_base IN (SELECT base_m FROM base_in_eventalp WHERE event_m=${eventId})`,
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

  // Для выпадашки с номерами под мероприятием
  app.get(
    "/eventList/:eventId/baseHouseRoomForEvent/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      const { houseId } = req.query
      let select = `SELECT bf_n.*, bf_d.basefd_name, b.base_name
                FROM base_house_room bf_n
                LEFT JOIN base_house bf_d on bf_d.id=bf_n.basenom_fd
                LEFT JOIN base b on b.id=bf_d.basefd_base  
                WHERE bf_d.basefd_base IN (SELECT base_m FROM base_in_eventalp WHERE event_m=${eventId})`
      if (houseId) select += ` AND bf_n.basenom_fd=${houseId}`
      pool.query(
        select,
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
  //AND bf_n.id NOT IN (SELECT basefd FROM baseroom_in_event WHERE event=${eventId})

  // Участники в номерах
  app.get(
    "/eventList/:eventId/baseHouseRoom/:baseRoomId/member/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseRoomId } = req.params;
      pool.query(
        `SELECT b_e_p.*, m.fio
                FROM eventmember_in_eventroom b_e_p
                LEFT JOIN eventmemb em on em.id = b_e_p.event_per 
                LEFT JOIN member m on m.id = em.eventmemb_memb              
                WHERE base_per='${baseRoomId}'`,
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
    "/eventList/:eventId/baseHouseRoom/:baseRoomId/member/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      const { base_per, event_per, per_desk } = req.body;
      pool.query(
        `INSERT INTO eventmember_in_eventroom 
      ( base_per, event_per, per_desk) 
      VALUES(?,?,?)`,
        [base_per, event_per, per_desk],
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
    "/eventList/:eventId/baseHouseRoom/:baseRoomId/member/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      const { per_desk } = req.body;
      pool.query(
        `UPDATE eventmember_in_eventroom SET 
      per_desk=? WHERE id=${id}`,
        [per_desk],
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
    "/eventList/:eventId/baseHouseRoom/:baseId/member/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(
        `DELETE FROM eventmember_in_eventroom WHERE id=${id}`,
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
  // Для выпадашки с участниками в участниках в номерах под мероприятием
  app.get(
    "/eventList/:eventId/memberForEventRoom/:roomId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId, roomId } = req.params;
      pool.query(
        `SELECT *
                FROM baseroom_in_event 
                WHERE event=${eventId} AND id=${roomId}`,
        (error, result) => {
          const { date_st, date_f } = result[0];
          pool.query(
            `SELECT em.id, m.fio
FROM eventmemb em 
LEFT JOIN member m on m.id=em.eventmemb_memb
WHERE em.eventmemb_even=${eventId} AND em.id NOT IN (SELECT em.id 
                    FROM eventmemb em
                    LEFT JOIN eventmember_in_eventroom e_e ON e_e.event_per=em.id
                    LEFT JOIN baseroom_in_event b_e ON b_e.id=e_e.base_per 
                    WHERE em.eventmemb_even=${eventId}
                    AND ( 
                     NOT(
                    	(b_e.date_st<='${date_st}' AND b_e.date_f<='${date_st}') 
                    	OR (b_e.date_st>='${date_f}' AND b_e.date_f>='${date_f}') )
                    ))`,
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
    }
  );
};

// Export the router
module.exports = eventBaseRouter;
