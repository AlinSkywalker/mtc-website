// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const memberListRouter = (app, passport) => {
  app.get(
    "/memberList/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { possibleRole, eventId } = req.query;
      if (!possibleRole && !eventId) {
        pool.query(
          `SELECT m.*, c.name_city, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu   
                  FROM member m 
                  LEFT JOIN city c on m.memb_city=c.id
                  JOIN membalp ma on m.id=ma.id
                  ORDER BY m.fio ASC`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else if (eventId) {
        pool.query(
          `SELECT m.*, e_m.id, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu   
                  FROM eventmemb e_m 
                  LEFT JOIN member m on m.id=e_m.eventmemb_memb
                  JOIN membalp ma on m.id=ma.id 
                  WHERE eventmemb_even='${eventId}'
                  ORDER BY m.fio ASC`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else if (possibleRole == "ob") {
        pool.query(
          `SELECT m.*, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu    
                  FROM member m 
                  JOIN membalp ma on m.id=ma.id 
                  WHERE ma.alpinstr IS NOT NULL 
                  AND ma.alpzeton IS NOT NULL
                  ORDER BY m.fio ASC`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else if (possibleRole == "st") {
        pool.query(
          `SELECT m.*, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu    FROM member m JOIN membalp ma on m.id=ma.id 
                  WHERE ma.alpinstr='1' OR ma.alpinstr='2' ORDER BY m.fio ASC`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else if (possibleRole == "instructor") {
        pool.query(
          `SELECT m.*, ma.alprazr, ma.alpinstr, ma.skali, ma.ledu  
                  FROM member m JOIN membalp ma on m.id=ma.id WHERE ma.alpinstr IS NOT NULL ORDER BY m.fio ASC`,
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
        pool.query(
          `SELECT m.*, c.name_city, ma.alprazr, ma.alpinstr 
                  FROM member m 
                  LEFT JOIN city c on m.memb_city=c.id 
                  JOIN membalp ma on m.id=ma.id
                  ORDER BY m.fio ASC`,
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
    }
  );

  app.get(
    "/memberList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `SELECT m.*, ma.*, c.name_city FROM member m 
                  JOIN membalp ma ON ma.id=m.id
                  LEFT JOIN city c ON c.id=m.memb_city
                  WHERE m.id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const { name_city, memb_city } = result[0];
          res.send({ ...result[0], city: { name_city, id: memb_city } });
        }
      );
    }
  );
  app.put(
    "/memberList",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        fio,
        gender,
        date_birth,
        memb_city,
        tel_1,
        tel_2,
        memb_email,
        size_cloth,
        size_shoe,
        alpzeton,
        date_zeton,
        alpinstrnom,
        skali,
        ledu,
        memb,
      } = req.body;
      pool.query(
        `INSERT INTO member ( fio,gender,date_birth,memb_city,tel_1,tel_2,memb_email,size_cloth,size_shoe,memb) VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [
          fio,
          gender,
          date_birth || null,
          memb_city || null,
          tel_1,
          tel_2,
          memb_email,
          size_cloth,
          size_shoe,
          memb,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const memberId = result.insertId;
          pool.query(
            `INSERT INTO membalp ( id, alpzeton,date_zeton,alpinstrnom,skali,ledu) 
            VALUES(?,?,?,?,?,?)`,
            [
              memberId,
              alpzeton,
              date_zeton,
              alpinstrnom,
              skali,
              ledu,
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
    }
  );
  app.post(
    "/memberList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        fio,
        gender,
        date_birth,
        memb_city,
        tel_1,
        tel_2,
        memb_email,
        size_cloth,
        size_shoe,
        alpzeton,
        date_zeton,
        alpinstrnom,
        skali,
        ledu,
        memb,
      } = req.body;
      pool.query(
        `UPDATE member SET 
      fio=?,
      gender=?,
      date_birth=?,
      memb_city=?,
      tel_1=?,
      tel_2=?,
      memb_email=?,
      size_cloth=?,
      size_shoe=?,
      memb=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [
          fio,
          gender,
          date_birth,
          memb_city,
          tel_1,
          tel_2,
          memb_email,
          size_cloth,
          size_shoe,
          memb,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `UPDATE membalp SET 
        alpzeton=?,
        date_zeton=?,
        alpinstrnom=?,
        skali=?,
        ledu=?,
        updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
            [
              alpzeton,
              date_zeton,
              alpinstrnom,
              skali,
              ledu,
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
    }
  );

  app.delete(
    "/memberList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM member WHERE id=${id}`, (error, result) => {
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
    "/memberList/:id/events",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `SELECT e.*
          FROM eventmemb em
                  LEFT JOIN eventalp e ON e.id=em.eventmemb_even
                  WHERE em.eventmemb_memb=${id}`,
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
module.exports = memberListRouter;
