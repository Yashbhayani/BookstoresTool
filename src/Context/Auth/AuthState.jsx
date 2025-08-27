import React from "react";
import Authcontex from "./AuthContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";

const AuthState = (props) => {
  // ✅ Dynamic API calls
  const LoginFunction = (formdata) =>
    apiRequest({
      url: apiroute.host + apiroute.loginurl,
      method: "POST",
      body: formdata,
    });

  const CheckuserFunction = () =>
    apiRequest({
      url: apiroute.host + apiroute.checkuserurl,
      method: "GET",
    });

  return (
    <Authcontex.Provider
      value={{
        LoginFunction,
        CheckuserFunction,
      }}
    >
      {props.children}
    </Authcontex.Provider>
  );
};

export default AuthState;
