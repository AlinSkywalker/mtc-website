// Load the MySQL pool connection
const pool = require("./mysql");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const transporter = nodemailer.createTransport({
  host: "mail.hosting.reg.ru",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "info@mtc-tritonn.ru", // Your Gmail email address
    pass: "fHreL67ZT!", // Your Gmail password
  },
});
const defaultMailOptions = {
  from: {
    name: "ЦАП Тритонн",
    address: "info@mtc-tritonn.ru",
  },
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    "bb70ee193c249bb7c856f8c408dfaed81458e8773a05364e7bc6b726e4f83e0d",
};

const sendSuccessfulRegistrationEmail = (email, callback, errorCallback) => {
  const mailOptions = {
    ...defaultMailOptions,
    to: email, // Recipient's email address
    subject: "Регистрация в системе ЦАП", // Subject line
    text: "Вы зарегистрировались в системе ЦАП Тритонн. Добро пожаловать!", // Plain text body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Ошибка отправки:", error);
      errorCallback?.()
    } else {
      callback();
    }
  });
};

const sendResetPasswordEmail = (email, token, callback, errorCallback) => {
  const mailOptions = {
    ...defaultMailOptions,
    to: email, // Recipient's email address
    subject: "Восстановление пароля от системы ЦАП", // Subject line
    html: `<p>Добрый день!</p>
<p>Вы запросили восстановление пароля для учетной записи email в ЦАП.</p>
<p><a href="https://mtc-tritonn.ru/reset-password?token=${token}">Восстановить пароль</a></p>
<p>Для восстановления пароля перейдите по ссылке</p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Ошибка отправки:", error);
      errorCallback?.()
    } else {
      callback();
    }
  });
};

function generateSecureRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  // Создаем массив для хранения случайных значений
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomValues[i] % charactersLength];
  }

  return result;
}

// Route the app
const authRouter = (app, passport) => {
  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    pool.query(
      `SELECT u.*, m.id as user_member_id FROM user u 
      LEFT OUTER JOIN member m ON m.user_id=u.id
      WHERE u.login='${username}'`,
      (error, result) => {
        if (error) console.log(result);
        const user = result[0];
        // console.log('user', user)
        // if (!user || !bcrypt.compareSync(password, user.password)) {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          res
            .status(500)
            .json({ success: false, message: "Invalid username or password" });
          return;
        }

        const token = jwt.sign(
          {
            user_id: user.id,
            user_name: user.login,
            user_role: user.user_role,
            user_member_id: user.user_member_id,
            iat: Date.now(),
          },
          jwtOptions.secretOrKey
        );
        // записать в базу токен и айди пользователя
        pool.query(
          "INSERT INTO user_token (user_id, token) VALUES(?,?)",
          [user.id, token],
          (error, result) => {
            if (error) console.log(error);
            res.json({
              success: true,
              token,
              user_role: user.user_role,
              user_id: user.id,
              user_member_id: user.user_member_id
            });
          }
        );
      }
    );
  });
  app.get(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
      const token = req.user.token;

      pool.query(
        `DELETE FROM user_token WHERE token='${token}'`,
        (error, result) => {
          if (error) console.log(error);
          res.send("Logout done");
        }
      );
    }
  );
  app.post("/register", (req, res) => {
    const { email, fio, date_birth, password, gender } = req.body;
    pool.query(`SELECT * FROM user WHERE login='${email}'`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return;
      }
      const user = result[0];

      if (user) {
        res.status(500).json({
          success: false,
          message: "Пользователь с таким email уже существует",
        });
        return;
      }
      else {
        pool.query(
          `SELECT * FROM member WHERE fio='${fio}' AND date_birth='${date_birth}'`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            const member = result[0];
            if (member?.user_id) {
              res.status(500).json({
                success: false,
                message: "Пользователь с таким ФИО и датой рождения уже существует",
              });
              return;
            } else {
              const hashPassword = bcrypt.hashSync(password, 10);
              pool.query(
                "INSERT INTO user (login, password, user_role) VALUES(?,?, 'USER_ROLE')",
                [email, hashPassword],
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                  }
                  const userId = result.insertId;
                  if (member) {
                    pool.query(
                      `UPDATE member SET user_id=${userId}, memb_email='${email}'  WHERE id=${member.id} AND user_id IS NULL`,
                      (error, result) => {
                        if (error) {
                          console.log(error);
                          res.status(500).json({ success: false, message: error });
                          return;
                        }
                        const token = jwt.sign(
                          {
                            user_id: userId,
                            user_name: email,
                            user_role: "USER_ROLE",
                            iat: Date.now(),
                          },
                          jwtOptions.secretOrKey
                        );

                        // sendSuccessfulRegistrationEmail(email, () => {});
                        res.json({
                          success: true,
                          token,
                          user_role: "USER_ROLE",
                          user_id: userId,
                        });
                      }
                    );
                  } else {
                    pool.query(
                      "INSERT INTO member (fio, date_birth, gender, user_id,memb_email) VALUES(?,?,?,?,?)",
                      [fio, date_birth, gender, userId, email],
                      (error, result) => {
                        if (error) {
                          console.log(error);
                          res.status(500).json({ success: false, message: error });
                          return;
                        }

                        const newMemberId = result.insertId;
                        pool.query(
                          `INSERT INTO membalp (id) VALUES(?)`,
                          [newMemberId],
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              res
                                .status(500)
                                .json({ success: false, message: error });
                              return;
                            }
                            const token = jwt.sign(
                              {
                                user_id: userId,
                                user_name: email,
                                user_role: "USER_ROLE",
                                iat: Date.now(),
                              },
                              jwtOptions.secretOrKey
                            );
                            sendSuccessfulRegistrationEmail(email, () => {
                              res.json({
                                success: true,
                                token,
                                user_role: "USER_ROLE",
                                user_id: userId,
                              });
                            });
                          }
                        );
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  });
  app.post("/verify-token", (req, res) => {
    const { token } = req.body;
    pool.query(
      `SELECT u.* FROM user u 
      WHERE u.password_reset_token='${token}' AND password_reset_date>=SUBTIME(CURRENT_TIMESTAMP, '01:00:00')`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        const user = result[0];
        if (!user) {
          pool.query(
            `DELETE FROM user u 
              WHERE u.password_reset_token='${token}'`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              res
                .status(500)
                .json({ success: false });
            }
          );
        }
        else {
          res.json({});
        }
      }
    );
  });
  app.post("/reset-password", (req, res) => {
    const { token, password, username } = req.body;
    if (!token) {
      const newToken = generateSecureRandomString(20)
      pool.query(
        `UPDATE user SET password_reset_token='${newToken}', password_reset_date=CURRENT_TIMESTAMP 
          WHERE login='${username}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `SELECT * FROM user WHERE login='${username}'`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              const user = result[0]
              if (user) {
                sendResetPasswordEmail(username, newToken, () => {
                  res.json({
                    success: true,
                  });
                }, () => {
                  res.status(500).json({ success: false });
                });
              }
              else {
                res.json({
                  success: true,
                });
              }

            }
          );
        }
      );
    }
    else {
      const hashPassword = bcrypt.hashSync(password, 10);
      pool.query(
        `UPDATE user SET password='${hashPassword}', password_reset_token=NULL, password_reset_date=NULL
          WHERE password_reset_token='${token}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          // sendSuccessfulRegistrationEmail(email, () => {});
          res.json({});
        }
      );
    }

  });
};

// Export the router
module.exports = authRouter;
