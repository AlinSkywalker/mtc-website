// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const companyDataRouter = (app, passport) => {
  app.get(
    "/companyData/",
    (req, res) => {
      pool.query(
        `SELECT * FROM company_data`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result?.[0] || {});
        }
      );
    }
  );
  app.get(
    "/companyData/file",
    (req, res) => {
      const { fileId } = req.params;
      pool.query(
        `SELECT * FROM company_data`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const filePath = result[0].company_charter_file_path
          const fileName = filePath.split('/').slice(-1)[0]

          const file = `${__dirname}/../${filePath}`;

          var newFileName = encodeURIComponent(fileName);

          res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + newFileName);
          res.download(file); // Set disposition and send it.
        }
      );
    }
  );
};

// Export the router
module.exports = companyDataRouter;
