import React, { useContext, useEffect, useState } from "react";
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

    const context = useContext(Authcontex);
    const Customercontext = useContext(Customercontex);
    const { CheckuserFunction } = context;
    const { GetUserInfo } = Customercontext;

    const [selectedUiid, setSelectedUiid] = useState<string | null>(null);

    useEffect(() => {
        document.title = PageTitle.ViewApplyUser;
        const token = sessionStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
            CallCheckuser();
        } else {
            navigate("/login");
        }
    }, []);

    const CallCheckuser = async () => {
        props.setLoading(true);
        try {
            const response = await CheckuserFunction();
            if (response.Success === true) {
                if (!response.data) {
                    props.setLoading(false);
                    navigate("/");
                } else {
                    CallUserInfo(decodeURIComponent(id as string), 0);
                }
            } else {
                props.setLoading(false);
            }
        } catch {
            toast.error("Server is not working", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                duration: 2000,
            });
            props.setLoading(false);
        }
    };

    const CallUserInfo = async (userid: string, userinfoid: any ) => {
    try {
        props.setLoading(true);
        let jsonObject = {
                        userid: userid,
                        userinfoid: userinfoid == null ? 0 : userinfoid, 
                    };
        let response = await GetUserInfo(jsonObject);
        if(response.Success){
            if (!response.data) {
                props.setLoading(false);
                navigate("/");
            }else{
                console.log("GetUserInfo response", response);
                props.setLoading(false);
            }
        }else{
            props.setLoading(false);   
        }
        console.log("GetUserInfo response", response);
        
    } catch (error) {
         toast.error("Server is not working", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                duration: 2000,
            });
            props.setLoading(false);
    }            
    }

    const Back = () => {
        navigate('/apply-user-admin');
    }

    const handleChildButtonClick = (uid: string) => {
        console.log("Button clicked from ListOfApplyUserAdmin", uid);
        setSelectedUiid(uid);
        CallUserInfo(decodeURIComponent(id as string), uid);
    };

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
                        <ListOfApplyUserAdmin
                            setLoading={props.setLoading}
                            onButtonClick={handleChildButtonClick}
                            selectedUiid={selectedUiid}
                        ></ListOfApplyUserAdmin>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ViewApplyUserAdminInfo
