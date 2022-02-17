//rfce -> func component, rcc -> class component
import React, { useEffect } from "react";
import axios from "axios";
import { logoutUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((res) => {
      console.log(res);
    });
  }, []);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(logoutUser())
      .then((res) => {
        if (res.payload.success) {
          navigate("/login");
        } else {
          alert("logout fail");
        }
      })
      .catch((err) => console.log(err));
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
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>Log Out</button>
    </div>
  );
}

export default LandingPage;
