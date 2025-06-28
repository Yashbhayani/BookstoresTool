import React, { useContext, useEffect, useState } from "react";
import Pagination from "../../../Module/PaginationComponent/Pagination";
import { useNavigate, useParams } from "react-router-dom";
import Authcontex from "../../../../Context/Auth/AuthContext";
import Customercontex from "../../../../Context/CustomerList/CustomerContext";
import * as apiroute from "../../../../Context/API/ApiRouter";
import toast from "react-hot-toast";
import PageTitle from "../../../../PageTitle/PageTitle";
import ListOfApplyUserAdmin from "./ListApplyUserAdminComponent/ListOfApplyUserAdmin";
import "./viewapplyuseradmininfo.css";

const ViewApplyUserAdminInfo = (props: any) => {
    const navigate = useNavigate();
    let { id } = useParams<string>();
    console.log("ViewApplyUserAdminInfo props", props);

    const Back = () => {
        navigate('/apply-user-admin');
    }
    return (
        <div>
            <h4>Apply User Admin Info List</h4>
            <hr />
            <div className="navbar navbar-light">
                <div className="container-fluid">
                    <i className="btn btn-outline-primary bi bi-box-arrow-left" onClick={Back}> Back</i>
                </div>
            </div>


            <div className="row align-items-center">
                <div className="col-8">
                    One of three columns
                </div>
                <div className="col-4">
                    <div className="overflow-auto border-start p-3 scrollbar-container" style={{
                        maxHeight: "400px",
                        borderLeft: "2px solid #ccc", // Left border only
                        overflowY: "scroll",
                        
                    }}>
                        <ListOfApplyUserAdmin></ListOfApplyUserAdmin>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ViewApplyUserAdminInfo
