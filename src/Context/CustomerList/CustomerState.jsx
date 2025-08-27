import React from "react";
import * as apiroute from "../API/ApiRouter";
import Customercontex from "./CustomerContext";
import apiRequest from "../API/ApiRequest";


const CustomerState = (props) => {
  // ✅ Customer functions

  const AdminList = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.adminurl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const UserAdminList = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.useradminurl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const ApplyUserAdminList = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.applyuseradminurl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const UserList = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.userurl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const ApplyUserAdminInfoList = (uid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.applyuserinfolist}`,
      method: "GET",
      params: { uid },
    });

  const GetUserInfo = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.getuserinfo}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  return (
    <Customercontex.Provider
      value={{
        AdminList,
        UserAdminList,
        UserList,
        ApplyUserAdminList,
        ApplyUserAdminInfoList,
        GetUserInfo,
      }}
    >
      {props.children}
    </Customercontex.Provider>
  );
};

export default CustomerState;
