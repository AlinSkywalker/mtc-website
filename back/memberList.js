// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const memberListRouter = (app, passport) => {
  app.get('/memberList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { possibleRole, eventId } = req.query
    if (!possibleRole && !eventId) {
      pool.query(`SELECT m.*, c.name_city, ma.alprazr, ma.alpinstr FROM member m 
                  LEFT JOIN city c on m.memb_city=c.id
                  JOIN membalp ma on m.id=ma.id`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
    else if (eventId) {
      pool.query(`SELECT m.*, e_m.id, ma.alprazr, ma.alpinstr FROM eventmemb e_m LEFT JOIN member m on m.id=e_m.eventmemb_memb WHERE eventmemb_even='${eventId}'`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
    else if (possibleRole == 'ob') {
      pool.query(`SELECT m.*, ma.alprazr, ma.alpinstr  FROM member m JOIN membalp ma on m.id=ma.id 
                  WHERE ma.alpinstr IS NOT NULL 
                  AND ma.alpzeton IS NOT NULL
                  `, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
    else if (possibleRole == 'st') {
      pool.query(`SELECT m.*, ma.alprazr, ma.alpinstr  FROM member m JOIN membalp ma on m.id=ma.id 
                  WHERE ma.alpinstr='1' OR ma.alpinstr='2'`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
    else if (possibleRole == 'instructor') {
      pool.query(`SELECT m.*, ma.alprazr, ma.alpinstr  FROM member m JOIN membalp ma on m.id=ma.id WHERE ma.alpinstr IS NOT NULL`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
    else {
      pool.query(`SELECT m.*, c.name_city, ma.alprazr, ma.alpinstr 
                  FROM member m 
                  LEFT JOIN city c on m.memb_city=c.id 
                  JOIN membalp ma on m.id=ma.id`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    }
  })

  app.get('/memberList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT m.*, ma.*, c.name_city FROM member m 
                  LEFT JOIN membalp ma on ma.id=m.id
                  LEFT JOIN city c on c.id=m.memb_city
                  WHERE m.id=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      const { name_city, memb_city } = result[0]
      res.send({ ...result[0], city: { name_city, id: memb_city } });
    });
  })
  app.put('/memberList', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { fio,
      gender,
      date_birth,
      memb_city,
      tel_1,
      tel_2,
      memb_email,
      size_cloth,
      size_shoe,
      alprazr,
      date_razr,
      alpzeton,
      date_zeton,
      alpinstr,
      alpinstrnom,
      date_instr,
      skali,
      ledu
    } = req.body;
    pool.query(`INSERT INTO member ( fio,gender,date_birth,memb_city,tel_1,tel_2,memb_email,size_cloth,size_shoe) VALUES(?,?,?,?,?,?,?,?,?)`,
      [fio, gender, date_birth, memb_city, tel_1, tel_2, memb_email, size_cloth, size_shoe], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        const memberId = result.insertId
        pool.query(`INSERT INTO membalp ( id, alprazr,date_razr, alpzeton,date_zeton,alpinstr,alpinstrnom,date_instr,skali,ledu) VALUES(?,?,?,?,?,?,?,?,?,?)`,
          [memberId, alprazr, date_razr, alpzeton, date_zeton, alpinstr, alpinstrnom, date_instr, skali, ledu], (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return
            }
            res.send(result);
          });
      });
  })
  app.post('/memberList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    const { fio,
      gender,
      date_birth,
      memb_city,
      tel_1,
      tel_2,
      memb_email,
      size_cloth,
      size_shoe,
      alprazr,
      date_razr,
      alpzeton,
      date_zeton,
      alpinstr,
      alpinstrnom,
      date_instr,
      skali,
      ledu
    } = req.body;
    pool.query(`UPDATE member SET 
      fio=?,
      gender=?,
      date_birth=?,
      memb_city=?,
      tel_1=?,
      tel_2=?,
      memb_email=?,
      size_cloth=?,
      size_shoe=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [fio, gender, date_birth, memb_city, tel_1, tel_2, memb_email, size_cloth, size_shoe], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      pool.query(`UPDATE membalp SET 
        alprazr=?,
        date_razr=?,
        alpzeton=?,
        date_zeton=?,
        alpinstr=?,
        alpinstrnom=?,
        date_instr=?,
        skali=?,
        ledu=?,
        updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [alprazr, date_razr, alpzeton, date_zeton, alpinstr, alpinstrnom, date_instr, skali, ledu], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    });
  })

  app.delete('/memberList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`DELETE FROM member WHERE id=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

}

// Export the router
module.exports = memberListRouter;