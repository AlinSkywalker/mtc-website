const mysql = require('mysql2');

const dbConfig = {
  host: '109.120.142.80',
  user: process.env.MTC_DB_USER,
  password: process.env.MTC_DB_PASSWORD,
  database: 'mtc_db',
  insecureAuth: "true",
  dateStrings: true,
  // timezone: 'Z',
};
const pool = mysql.createPool(dbConfig);

module.exports = pool