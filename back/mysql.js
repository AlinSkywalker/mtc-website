const mysql = require('mysql2');

const dbConfig = {
  host: '109.120.142.80',
  user: 'alinsky_remote',
  password: 'fHreL67ZT',
  database: 'mtc_db',
  insecureAuth: "true",
};
const pool = mysql.createPool(dbConfig);

module.exports = pool