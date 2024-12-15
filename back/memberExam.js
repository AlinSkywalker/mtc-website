// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const memberExamRouter = (app, passport) => {

  app.get('/memberList/:memberId/exam', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.memberId;
    pool.query(`SELECT * FROM membalpzach 
                  WHERE zachmemb=${id}`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })
  app.put('/memberList/:memberId/exam', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.memberId;
    const { zach_name,
      zach_note,
      zach_e2,
      zach_e1,
      zach_grade,
    } = req.body;
    pool.query(`INSERT INTO membalpzach ( zachmemb, zach_name, zach_note, zach_e2, zach_e1, zach_grade) VALUES(?,?,?,?,?,?)`,
      [id, zach_name, zach_note, zach_e2, zach_e1, zach_grade], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);

      });
  })
  app.post('/memberList/:memberId/exam/:examId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.examId;
    const { zach_name,
      zach_note,
      zach_e2,
      zach_e1,
      zach_grade,
    } = req.body;
    pool.query(`UPDATE membalpzach SET 
      zach_name=?,
      zach_note=?,
      zach_e2=?,
      zach_e1=?,
      zach_grade=?,
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`, [zach_name, zach_note, zach_e2, zach_e1, zach_grade], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      res.send(result);
    });
  })

  app.delete('/memberList/:id/exam/:examId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.examId;
    pool.query(`DELETE FROM membalpzach WHERE id=${id}`, (error, result) => {
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
module.exports = memberExamRouter;