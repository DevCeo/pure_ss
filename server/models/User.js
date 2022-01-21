const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const e = require("express");
//saltRounds는 salt가 몇글자인지 정한다.
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //trim -> 이메일 작성시 빈칸 없애기
    trim: true,
    //unique -> 같은 이메일 사용 금지
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// User에 저장하기전에 bcrypt하는 코드
userSchema.pre("save", function (next) {
  var user = this;
  //비밀번호를 변경할떄만 암호화시키게
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword랑 암호화된 비밀번호랑 같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// 스키마를 모델로 감싼다.
const User = mongoose.model("User", userSchema);

// 다른 곳에서도 사용 가능하게
module.exports = { User };
