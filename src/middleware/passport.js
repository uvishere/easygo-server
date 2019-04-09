
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');

const secret  = process.env.SECRET

const UserModel = require('../models/user');


//Define Local strategy for email/ Password Authentication
passport.use(new LocalStrategy( async (email, password, done) => {
  try {
    const userDocument = await UserModel.findOne({email: email}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      return done(null, userDocument);
    } else {
      return done('Incorrect email / Password');
    }
  } catch (error) {
    done(error);
  }
}));


//Define JWT Strategy to verify JWT Payload
passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: secret,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
));