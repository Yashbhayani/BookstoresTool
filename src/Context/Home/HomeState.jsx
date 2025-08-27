import React, { useState } from "react";
import HomeContext from "./HomeContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";

const HomeState = (props) => {
  const [book, setbook] = useState(true);

  const DashboardFunction = () =>
    apiRequest({
      url: `${apiroute.host}${apiroute.dashboardurl}`,
      method: "GET",
    });

  return (
    <HomeContext.Provider
      value={{
        DashboardFunction,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};

export default HomeState;
