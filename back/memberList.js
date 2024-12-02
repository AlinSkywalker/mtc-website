// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const memberListRouter = (app, passport) => {
  app.get('/memberList/', passport.authenticate('jwt', { session: false }), (req, res) => {
    pool.query(`SELECT m.*, c.name_city FROM member m JOIN city c on m.memb_city=c.id`, (error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  })
  app.get('/memberList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM member m WHERE m.id='${id}`, (error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  })

}

// Export the router
module.exports = memberListRouter;