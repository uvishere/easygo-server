// "use strict";

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Error is Invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain password');
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

//Remove password and hash from the Usesr Payload
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//Generate Authentication Token
UserSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Find by Passed credentials
UserSchema.statics.findByCredentials = async (email, password) => {
  const verifiedUser = await User.findOne({ email: email });

  if (!verifiedUser) {
    throw new Error('Unable to find User in our system');
  }

  const isMatch = await bcrypt.compare(password, verifiedUser.password);

  if (!isMatch) {
    reject(new Error('Unable to login'));
  }

  return verifiedUser;
};

//hash the plain text password before saving
UserSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

///Create User Model
const User = mongoose.model('User', UserSchema);

module.exports = User;
