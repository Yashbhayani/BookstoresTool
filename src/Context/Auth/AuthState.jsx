import React from "react";
import Authcontex from "./AuthContext";
import * as apiroute  from "../API/ApiRouter";

const AuthState = (props) => {
    const LoginFunction = async (formdata) => {
        const response = await fetch( apiroute.host + apiroute.loginurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formdata),
        });
        const json = await response.json();
        return json;
    };
    const CheckuserFunction = async () => {
        const response = await fetch(apiroute.host + apiroute.checkuserurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": sessionStorage.getItem("token")
            },
        });
        const json = await response.json();
        return json;
    };
    return (
        <Authcontex.Provider
            value={{
                LoginFunction,
                CheckuserFunction
            }}
        >
            {props.children}
        </Authcontex.Provider>
    );
}
export default AuthState;