Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key];
});

const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");

const pool = require("./mysql");

const baseDictionaryRouter = require("./dictionary/baseDictionary");
const cityDictionaryRouter = require("./dictionary/cityDictionary");
const contractorDictionaryRouter = require("./dictionary/contractorDictionary");
const districtDictionaryRouter = require("./dictionary/districtDictionary");
const laboratoryDictionaryRouter = require("./dictionary/laboratoryDictionary");
const regionDictionaryRouter = require("./dictionary/regionDictionary");
const routeDictionaryRouter = require("./dictionary/routeDictionary");
const summitDictionaryRouter = require("./dictionary/summitDictionary");
const trainingProgramRouter = require("./dictionary/trainingProgram");

const eventListRouter = require("./event/eventList");
const eventSmenaRouter = require("./event/eventSmena");
const eventDepartmentRouter = require("./event/eventDepartment");
const eventMemberRouter = require("./event/eventMember");
const eventBaseRouter = require("./event/eventBase");
const eventFileRouter = require("./event/eventFile");
const eventContractorRouter = require("./event/eventContractor");
const eventDepartmentPlanRouter = require("./event/eventDepartmentPlan");
const eventDepartmentPlanJournalRouter = require("./event/eventDepartmentPlanJournal");
const eventProtocolRouter = require("./event/eventProtocol");
const eventManagementStuffRouter = require("./event/eventManagementStuff");
const eventInstructionLogRouter = require("./event/eventInstructionLog");

const memberListRouter = require("./member/memberList");
const memberExamRouter = require("./member/memberExam");
const memberAscentRouter = require("./member/memberAscent");
const memberSportCategoryRouter = require("./member/memberSportCategory");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    "bb70ee193c249bb7c856f8c408dfaed81458e8773a05364e7bc6b726e4f83e0d",
};

passport.use(
  new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    // console.log('jwt_payload', jwt_payload)
    const token = jwt.sign(jwt_payload, jwtOptions.secretOrKey);
    if (jwt_payload.iat + 3 * 24 * 60 * 60 * 1000 < Date.now()) {
      // pool.query(`DELETE FROM user_token WHERE token='${token}'`);
      return done(null, false);
    } else {
      return done(null, jwt_payload);
    }
    // pool.query(`SELECT * FROM user_token ut RIGHT JOIN user u ON ut.user_id=u.id WHERE token='${token}'`, (error, result) => {
    //   if (error) {
    //     console.log(error);
    //     return done(error, false);
    //   }
    //   const user = result[0];
    //   if (user) {
    //     return done(null, { ...user, token });
    //   }
    //   else {
    //     return done(null, false);
    //   }
    // });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app = express();
const port = 3000;

// app.use(express.cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);
// Passport:
app.use(passport.initialize());
app.use(passport.session());

const transporter = nodemailer.createTransport({
  host: "mail.hosting.reg.ru",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "info@mtc-tritonn.ru", // Your Gmail email address
    pass: "fHreL67ZT", // Your Gmail password
  },
});
const defaultMailOptions = {
  from: {
    name: "ЦАП Тритонн",
    address: "info@mtc-tritonn.ru",
  },
};

const sendSuccessfulRegistrationEmail = (email, callback) => {
  const mailOptions = {
    ...defaultMailOptions,
    to: email, // Recipient's email address
    subject: "Hello from Nodemailer", // Subject line
    text: "This is a test email sent using Nodemailer!", // Plain text body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Ошибка отправки:", error);
    } else {
      callback();
    }
  });
};

app.post("/testEmail", (req, res) => {
  // const mailOptions = {
  //   ...defaultMailOptions,
  //   to: "alinskywalker@yandex.ru", // Recipient's email address
  //   subject: "Hello from Nodemailer", // Subject line
  //   text: "This is a test email sent using Nodemailer!", // Plain text body
  // };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log("Ошибка отправки:", error);
  //   } else {
  //     console.log("Successful send email");
  //     res.json({});
  //   }
  // });
  pool.query(`SELECT * FROM user`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
      return;
    }
    const queries = [];
    result.forEach(user => {
      const hashPassword = bcrypt.hashSync(user.password, 10);
      const query = new Promise((resolve, reject) => {
        pool.query(
          `UPDATE user SET password='${hashPassword}' WHERE id=${user.id}`,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
      queries.push(query);
    })

  })

});

app.post("/register", (req, res) => {
  const { email, fio, date_birth, password, gender } = req.body;
  pool.query(`SELECT * FROM user WHERE login='${email}'`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
      return;
    }
    const user = result[0];
    // console.log('user', user)
    // if (!user || !bcrypt.compareSync(password, user.password)) {
    if (user) {
      res.status(500).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
      return;
    }
    pool.query(
      `SELECT * FROM member WHERE fio='${fio}' AND date_birth='${date_birth}'`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        const member = result[0];
        if (!!member?.user_id) {
          res.status(500).json({
            success: false,
            message: "Пользователь с таким ФИО и датой рождения уже существует",
          });
          return;
        }
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
                "INSERT INTO member (fio, date_birth, gender, user_id) VALUES(?,?,?,?)",
                [fio, date_birth, gender, userId],
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                  }

                  const newMemberId = result.insertId;
                  pool.query(
                    `INSERT INTO membalp ( id) VALUES(?)`,
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
    );
  });
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

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    `SELECT * FROM user WHERE login='${username}'`,
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
          });
        }
      );
    }
  );
});

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    pool.query("SELECT * FROM user", (error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  }
);

app.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log("user", req.user);
    res.send({ id: req.user.user_id, role: req.user.user_role });
  }
);

app.get(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    pool.query(
      `SELECT u.*, m.*, c.name_city FROM mtc_db.user u 
      RIGHT JOIN member m on m.user_id=u.id 
      LEFT JOIN city c on c.id=m.memb_city
      WHERE u.id=${id}`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        const { name_city, memb_city } = result[0];
        res.send({ ...result[0], city: { name_city, id: memb_city } });
      }
    );
  }
);
app.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, size_cloth, size_shoe, tel_1, tel_2, gender, fio, date_birth } =
      req.body;
    pool.query(
      `UPDATE member 
      SET size_cloth='${size_cloth}',
      size_shoe='${size_shoe}',
      tel_1='${tel_1}',
      tel_2='${tel_2}',
      gender='${gender}',
      fio='${fio}',
      date_birth='${date_birth}'
      WHERE id=${id}`,
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
app.post(
  "/confirm_email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    pool.query("SELECT * FROM user", (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return;
      }
      res.send(result);
    });
  }
);

baseDictionaryRouter(app, passport);
cityDictionaryRouter(app, passport);
contractorDictionaryRouter(app, passport);
districtDictionaryRouter(app, passport);
laboratoryDictionaryRouter(app, passport);
regionDictionaryRouter(app, passport);
routeDictionaryRouter(app, passport);
summitDictionaryRouter(app, passport);
trainingProgramRouter(app, passport);

eventListRouter(app, passport);
eventSmenaRouter(app, passport);
eventDepartmentRouter(app, passport);
eventMemberRouter(app, passport);
eventBaseRouter(app, passport);
eventFileRouter(app, passport);
eventContractorRouter(app, passport);
eventDepartmentPlanRouter(app, passport);
eventDepartmentPlanJournalRouter(app, passport);
eventProtocolRouter(app, passport);
eventManagementStuffRouter(app, passport);
eventInstructionLogRouter(app, passport);

memberListRouter(app, passport);
memberExamRouter(app, passport);
memberAscentRouter(app, passport);
memberSportCategoryRouter(app, passport);

app.get(/(.*)/, (req, res) => {
  // console.log(req.params);
  res.status(404).send("PAGE NOT FOUND");
});
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
