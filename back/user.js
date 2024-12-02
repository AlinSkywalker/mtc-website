const bcrypt = require('bcryptjs');
const pool = require('./mysql')
const users = [];

const dbUsers = []
const authUser = null
function setDbUsers(users) {

}
function setAuthUser(user) {
  authUser = user
}
function createUser(username, password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return user;
}

function getUser(username) {
  return pool.query(`SELECT * FROM mtc_db.user WHERE login='${username}'`, (error, result) => {
    if (error) console.log(result);
    return result;
  });
}

module.exports = {
  createUser,
  getUser,

}