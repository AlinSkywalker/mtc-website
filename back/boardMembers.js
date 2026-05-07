// Load the MySQL pool connection
const pool = require("./mysql");
const checkAdminAccess = require('./authAdminRoleMiddleware');

// Route the app
const boardMembersRouter = (app, passport) => {
  app.get(
    "/boardMembers/",
    (req, res) => {
      //, CONVERT(m_p.photo USING utf8) as member_photo
      //LEFT JOIN member_photo m_p ON m_p.id=bm.member_id
      pool.query(
        `SELECT bm.*, m.fio, m.tel_1, m.memb_email
                FROM board_members bm
                
                LEFT JOIN member m ON m.id=bm.member_id`,
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
    "/boardMembers",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const { member_id, position } = req.body;
      pool.query(
        `INSERT INTO board_members (member_id, position) VALUES(?,?)`,
        [member_id, position],
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
    "/boardMembers/:id",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const id = req.params.id;
      const { member_id, position } = req.body;
      pool.query(
        `UPDATE board_members SET 
      member_id='${member_id}',
      position='${position}', 
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
    "/boardMembers/:id",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM board_members WHERE id=${id}`, (error, result) => {
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
module.exports = boardMembersRouter;
