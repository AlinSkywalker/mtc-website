const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const pool = require("./mysql");

const eventListRouter = require("./eventList");
const memberListRouter = require("./memberList");

const dictionaryRouter = require("./dictionary");

const eventSmenaRouter = require("./eventSmena");
const eventDepartmentRouter = require("./eventDepartment");
const eventMemberRouter = require("./eventMember");
const eventBaseRouter = require("./eventBase");
const eventFileRouter = require("./eventFile");

const memberExamRouter = require("./memberExam");
const memberAscentRouter = require("./memberAscent");

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
  })
);
// Passport:
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const user = createUser(username, password);
  res.json({ success: true, user });
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
      if (!user || password != user.password) {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
        return;
      }

      const token = jwt.sign(
        { user_id: user.id, user_name: user.login, iat: Date.now() },
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
    // console.log('user', req.user)
    res.send({ id: req.user.user_id, role: req.user.user_role });
  }
);

app.get(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    pool.query(
      `SELECT * FROM mtc_db.user u RIGHT JOIN member m on m.user_id=u.id WHERE u.id=${id}`,
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
app.post(
  "/profile",
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

eventListRouter(app, passport);
memberListRouter(app, passport);

dictionaryRouter(app, passport);

eventSmenaRouter(app, passport);
eventDepartmentRouter(app, passport);
eventMemberRouter(app, passport);
eventBaseRouter(app, passport);
eventFileRouter(app, passport);

memberExamRouter(app, passport);
memberAscentRouter(app, passport);

app.get("*", (req, res) => {
  // console.log(req.params)
  res.status(404).send("PAGE NOT FOUND");
});
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
