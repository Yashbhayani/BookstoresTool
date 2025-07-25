import React, { useState } from "react";
import * as apiroute from "../API/ApiRouter";
import Reportcontex from "./ReportsContext";

const ReportState = () => {
    return (
        <Reportcontex.Provider></Reportcontex.Provider>
    );
};

export default ReportState;