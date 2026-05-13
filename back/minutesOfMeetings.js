// Load the MySQL pool connection
const pool = require("./mysql");
const checkAdminAccess = require('./authAdminRoleMiddleware');

// Route the app
const minutesOfMeetingsRouter = (app, passport) => {
  app.get(
    "/minutesOfMeetings/",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      pool.query(
        `SELECT * FROM minutes_of_meetings ORDER BY file_date DESC`,
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
  app.get(
    "/minutesOfMeetings/file/:fileId",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const { fileId } = req.params;
      pool.query(
        `SELECT * FROM minutes_of_meetings WHERE id=${fileId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const filePath = result[0].file_path
          const fileName = result[0].file_name

          const file = `${__dirname}/${filePath}`;

          var newFileName = encodeURIComponent(fileName);
          console.log('newFileName', newFileName)
          console.log('file', file)

          res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + newFileName);
          res.download(file); // Set disposition and send it.
        }
      );
    }
  );
};

// Export the router
module.exports = minutesOfMeetingsRouter;
