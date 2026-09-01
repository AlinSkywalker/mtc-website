// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const profileRouter = (app, passport) => {
  app.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT m.*, b_m.position FROM member m
      LEFT OUTER JOIN board_members b_m ON b_m.member_id=m.id
      WHERE m.id=${req.user.user_member_id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          if (result[0]) {
            const { memb, position } = result[0];

            res.send({ id: req.user.user_id, role: req.user.user_role, memberId: req.user.user_member_id, isClubMember: memb, isBoardMember: !!position });
            return
          }
          res.status(500).json({ success: false });
        }
      );

    }
  );

  app.get(
    "/profile/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const currentUserId = req.user.user_id

      if (currentUserId != id) {
        res.status(500).json({ result: 'Нельзя получить данные по другому профилю' });
        return
      }
      pool.query(
        `SELECT u.*, m.*, c.name_city,
      CONVERT(m.photo_preview USING utf8) as member_photo 
      FROM mtc_db.user u 
      RIGHT JOIN member m on m.user_id=u.id 
      LEFT JOIN city c on c.id=m.memb_city
      WHERE u.id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          if (result[0]) {
            const { name_city, memb_city, password, password_bckp, password_reset_token, password_reset_date, ...rest } = result[0];

            res.send({ ...rest, city: memb_city ? { name_city, id: memb_city } : null });
            return
          }
          res.status(500).json({ success: false });
        }
      );
    }
  );
  app.get(
    "/profile/:id/photo",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const currentUserId = req.user.user_id

      if (currentUserId != id) {
        res.status(500).json({ result: 'Нельзя получить данные по другому профилю' });
        return
      }
      pool.query(
        `SELECT CONVERT(m_p.photo USING utf8) as member_photo 
      FROM mtc_db.user u 
      RIGHT JOIN member m on m.user_id=u.id 
      LEFT JOIN member_photo m_p on m_p.id=m.id 
      WHERE u.id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          if (result[0]) {
            res.send(result[0]);
            return
          }
          res.status(500).json({ success: false });
        }
      );
    }
  );
  app.post(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { id, size_cloth, size_shoe, tel_1, tel_2, gender, fio, date_birth, memb_city, emergency_contact, about_me } =
        req.body;

      const currentUserMemberId = req.user.user_member_id
      if (currentUserMemberId != id) {
        res.status(500).json({ result: 'Нельзя обновить данные по другому профилю' });
        return
      }

      pool.query(
        `UPDATE member 
      SET size_cloth='${size_cloth}',
      size_shoe='${size_shoe}',
      tel_1='${tel_1}',
      tel_2='${tel_2}',
      gender='${gender}',
      fio='${fio}',
      date_birth='${date_birth}',
      memb_city=?,
      emergency_contact=?,
      about_me=?
      WHERE id=${id}`,
        [memb_city || null, emergency_contact || null, about_me || null],
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
    "/profile/:id/setPhoto",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { newPhoto, newPhotoPreview } =
        req.body;
      pool.query(
        `INSERT INTO member_photo (id, photo)
          VALUES (${id}, '${newPhoto}')
          ON DUPLICATE KEY UPDATE
            photo = '${newPhoto}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `UPDATE member 
            SET photo_preview='${newPhotoPreview}'
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
    }
  );
};

// Export the router
module.exports = profileRouter;
