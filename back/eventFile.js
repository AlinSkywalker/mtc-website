// Load the MySQL pool connection
const pool = require("./mysql");
const CyrillicToTranslit = require('cyrillic-to-translit-js');
const cyrillicToTranslit = new CyrillicToTranslit();

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
      // const newFileName = cyrillicToTranslit.transform(uploadedFile.name, '_')
      // console.log('newFileName', newFileName)
      const newFilePath = `uploads_mtc/${eventId}/${uploadedFile.name}`

      uploadedFile.mv(newFilePath);
      // Print information about the file to the console
      console.log(`File Name: ${uploadedFile.name}`);
      console.log(`File Size: ${uploadedFile.size}`);
      console.log(`File MD5 Hash: ${uploadedFile.md5}`);
      console.log(`File Mime Type: ${uploadedFile.mimetype}`);
      // console.log(uploadedFile)
      pool.query(
        `INSERT INTO event_files (file_name, file_path, event) 
                  VALUES(?,?,?)`, [uploadedFile.name, newFilePath, eventId],
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
          const filePath = result[0].file_path//.replaceAll('/', '\\')
          const fileName = result[0].file_name
          // console.log('filePath', filePath)
          const file = `${__dirname}/${filePath}`;
          // console.log('file', file)
          var newFileName = encodeURIComponent(fileName);
          // console.log('newFileName', newFileName)
          res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + newFileName);
          res.download(file); // Set disposition and send it.
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
