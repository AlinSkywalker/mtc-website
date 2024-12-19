// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const eventFileRouter = (app, passport) => {
  app.get(
    "/eventList/:id/files",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `SELECT * FROM event_files WHERE event=${id}`,
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
    "/eventList/:eventId/files",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params;
      if (!req.files || !req.files.event_file) {
        return res.status(422).send("No files were uploaded");
      }
      const uploadedFile = req.files.event_file;
      uploadedFile.mv(`uploads_mtc/${eventId}/${uploadedFile.name}`);
      // Print information about the file to the console
      console.log(`File Name: ${uploadedFile.name}`);
      console.log(`File Size: ${uploadedFile.size}`);
      console.log(`File MD5 Hash: ${uploadedFile.md5}`);
      console.log(`File Mime Type: ${uploadedFile.mimetype}`);
      res.send();
    }
  );

  app.get(
    "/eventList/:eventId/files/:fileId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { fileId } = req.params;
      pool.query(
        `SELECT * FROM event_files WHERE id=${fileId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result[0]);
        }
      );
    }
  );

  app.delete(
    "/eventList/:id/files/:fileId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { fileId } = req.params;
      pool.query(
        `DELETE FROM event_files WHERE id=${fileId}`,
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
module.exports = eventFileRouter;
