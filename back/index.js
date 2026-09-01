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


const pool = require("./mysql");

const authRouter = require("./auth");
const profileRouter = require("./profile");


const baseDictionaryRouter = require("./dictionary/baseDictionary");
const cityDictionaryRouter = require("./dictionary/cityDictionary");
const contractorDictionaryRouter = require("./dictionary/contractorDictionary");
const districtDictionaryRouter = require("./dictionary/districtDictionary");
const laboratoryDictionaryRouter = require("./dictionary/laboratoryDictionary");
const regionDictionaryRouter = require("./dictionary/regionDictionary");
const routeDictionaryRouter = require("./dictionary/routeDictionary");
const summitDictionaryRouter = require("./dictionary/summitDictionary");
const trainingProgramRouter = require("./dictionary/trainingProgram");
const equipmentRouter = require("./dictionary/equipment");


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
const eventDepartPlanLabaAscentRouter = require("./event/eventDepartPlanLabaAscent");
const eventApplicationRouter = require("./event/eventApplication");
const eventStatisticRouter = require("./event/eventStatistic");
const eventEquipmentRouter = require("./event/eventEquipment");
const eventChartsRouter = require("./event/eventCharts");


const memberListRouter = require("./member/memberList");
const memberExamRouter = require("./member/memberExam");
const memberAscentRouter = require("./member/memberAscent");
const memberSportCategoryRouter = require("./member/memberSportCategory");
const memberLabaAscentRouter = require("./member/memberLabaAscent");
const memberEquipmentRouter = require("./member/memberEquipment");


const applicationRouter = require("./application");
const boardMembersRouter = require("./boardMembers");
const regionalOfficesRouter = require("./regionalOffices");
const companyDataRouter = require("./companyData");
const minutesOfMeetingsRouter = require("./minutesOfMeetings");
const membershipApplicationRouter = require("./membershipApplication");

const bithdayReminder = require('./bithdayReminder')

require('./bithdayReminderScheduler')


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

const app = express();
const port = 8000;

// app.use(express.cookieParser());
// app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
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

app.post(
  "/bithdayReminder",
  (req, res) => {
    bithdayReminder();
    res.send('ok');
  }
);




authRouter(app, passport);
profileRouter(app, passport);

baseDictionaryRouter(app, passport);
cityDictionaryRouter(app, passport);
contractorDictionaryRouter(app, passport);
districtDictionaryRouter(app, passport);
laboratoryDictionaryRouter(app, passport);
regionDictionaryRouter(app, passport);
routeDictionaryRouter(app, passport);
summitDictionaryRouter(app, passport);
trainingProgramRouter(app, passport);
equipmentRouter(app, passport);

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
eventDepartPlanLabaAscentRouter(app, passport);
eventApplicationRouter(app, passport);
eventStatisticRouter(app, passport);
eventEquipmentRouter(app, passport);
eventChartsRouter(app, passport);

memberListRouter(app, passport);
memberExamRouter(app, passport);
memberAscentRouter(app, passport);
memberSportCategoryRouter(app, passport);
memberLabaAscentRouter(app, passport);
memberEquipmentRouter(app, passport);

applicationRouter(app, passport);
boardMembersRouter(app, passport);
regionalOfficesRouter(app, passport);
companyDataRouter(app, passport);
minutesOfMeetingsRouter(app, passport);
membershipApplicationRouter(app, passport);



app.get(/(.*)/, (req, res) => {
  // console.log(req.params);
  res.status(404).send("PAGE NOT FOUND");
});
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
