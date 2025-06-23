import React from "react";
import * as apiroute  from "../API/ApiRouter";
import Customercontex from "./CustomerContext";

const CustomerState = (props) => {

        const AdminList = async (report) => {
            try {
                let jsonString = JSON.stringify(report);
                let reportParam = encodeURIComponent(jsonString);
                let urlWithParams = `${apiroute.host}${apiroute.adminurl}?report=${reportParam}`;
                const response = await fetch(urlWithParams, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                return json;
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        const UserAdminList = async (report) => {
            try {
                let jsonString = JSON.stringify(report);
                let reportParam = encodeURIComponent(jsonString);
                let urlWithParams = `${apiroute.host}${apiroute.useradminurl}?report=${reportParam}`;
                const response = await fetch(urlWithParams, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                return json;
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        const ApplyUserAdminList = async (report) => {
            try {
                let jsonString = JSON.stringify(report);
                let reportParam = encodeURIComponent(jsonString);
                let urlWithParams = `${apiroute.host}${apiroute.applyuseradminurl}?report=${reportParam}`;
                const response = await fetch(urlWithParams, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                return json;
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        const UserList = async (report) => {
            try {
                let jsonString = JSON.stringify(report);
                let reportParam = encodeURIComponent(jsonString);
                let urlWithParams = `${apiroute.host}${apiroute.userurl}?report=${reportParam}`;
                const response = await fetch(urlWithParams, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                return json;
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };


        const ApplyUserAdminInfoList = async (uid) => {
            try {

                let urlWithParams = `${apiroute.host}${apiroute.applyuserinfolist}?uid=${encodeURIComponent(uid)}`;
                const response = await fetch(urlWithParams, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                return json;
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

    return (
        <Customercontex.Provider
            value={{
                AdminList,
                UserAdminList,
                UserList,
                ApplyUserAdminList,
                ApplyUserAdminInfoList
        }}
        >
            {props.children}
        </Customercontex.Provider>
    );
}

export default CustomerState;