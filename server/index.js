const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//application/x-www-form-urlencoded 데이터를 분석하여 가져오는 것
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 데이터를 분석하여 가져오는 것
app.use(bodyParser.json());
app.use(cookieParser());

//mongoose 모듈 가져오기
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요 !");
});

//register router
app.post("/api/users/register", (req, res) => {
  //회원 가입할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 일치한지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });
      //비밀번호까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //토근을 쿠키에 저장
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});
// auth -> middleware
app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃이란 로그인 된 상태라는 말인데 그러면 auth middleware가 필요
app.get("/api/users/logout", auth, (req, res) => {
  //로그아웃하려는 유저를 데이터베이스에서 찾는다.
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
