import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Confirmpass, setConfirmpass] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onConfirmpassHandler = (e) => {
    setConfirmpass(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault(); //page refresh가 되는걸 막아준다.

    if (Password !== Confirmpass) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    let dataToSubmit = {
      email: Email,
      name: Name,
      password: Password,
    };

    dispatch(registerUser(dataToSubmit)).then((res) => {
      if (res.payload.success) {
        navigate("/login");
      } else {
        alert("회원가입 실패");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={Confirmpass}
          onChange={onConfirmpassHandler}
        />

        <br />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default RegisterPage;
