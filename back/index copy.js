const express = require('express');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const bodyParser = require('body-parser');

const pool = require("./mysql")

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'bb70ee193c249bb7c856f8c408dfaed81458e8773a05364e7bc6b726e4f83e0d'
};

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  // console.log('jwt_payload', jwt_payload)
  const token = jwt.sign(jwt_payload, jwtOptions.secretOrKey);
  pool.query(`SELECT * FROM user_token ut RIGHT JOIN user u ON ut.user_id=u.id WHERE token='${token}'`, (error, result) => {
    if (error) {
      console.log(error);
      return done(err, false);
    }
    const user = result[0];
    if (user) {
      return done(null, { ...user, token });
    }
    else {
      return done(null, false);
    }
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});



app = express();
const port = 3000

// app.use(express.cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Passport:
app.use(passport.initialize());
app.use(passport.session());

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = createUser(username, password);
  res.json({ success: true, user });
});
app.get('/logout', passport.authenticate('jwt', { session: false }), function (req, res) {
  const token = req.user.token

  pool.query(`DELETE FROM user_token WHERE token='${token}'`, (error, result) => {
    if (error) console.log(error);
    res.send("Logout done");
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  pool.query(`SELECT * FROM user WHERE login='${username}'`, (error, result) => {
    if (error) console.log(result);
    const user = result[0];
    // console.log('user', user)
    // if (!user || !bcrypt.compareSync(password, user.password)) {
    if (!user || password != user.password) {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ user_id: user.id, user_name: user.login, timestamp: Date.now() }, jwtOptions.secretOrKey);
    // записать в базу токен и айди пользователя
    pool.query('INSERT INTO user_token (user_id, token) VALUES(?,?)', [user.id, token], (error, result) => {
      if (error) console.log(error);
      res.json({ success: true, token, user_role: user.user_role, user_id: user.id });
    })

  });
});

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  pool.query('SELECT * FROM user', (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})

app.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('user', req.user)
  res.send({ id: req.user.user_id, role: req.user.user_role });
})

app.get('/profile/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT * FROM mtc_db.user u RIGHT JOIN member m on m.user_id=u.id WHERE u.id=${id}`, (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})
app.post('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  pool.query('SELECT * FROM user', (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})

app.get('/eventList/', passport.authenticate('jwt', { session: false }), (req, res) => {
  pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
    JOIN base b ON e.event_base=b.id 
    JOIN member m_ob on e.event_ob = m_ob.id
    JOIN member m_st on e.event_st = m_st.id`, (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})
app.get('/eventList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, b.base_name FROM eventalp e 
    JOIN base b ON e.event_base=b.id 
    JOIN member m_ob on e.event_ob = m_ob.id
    JOIN member m_st on e.event_st = m_st.id WHERE e.id='${id}'`, (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})


app.get('/memberList/', passport.authenticate('jwt', { session: false }), (req, res) => {
  pool.query(`SELECT m.*, c. FROM member m JOIN city c on m.memb_city = c.id`, (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})
app.get('/memberList/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT * FROM member m WHERE m.id='${id}`, (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
})


app.get("*", (req, res) => {
  // console.log(req.params)
  res.send("PAGE NOT FOUND");
});
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`));