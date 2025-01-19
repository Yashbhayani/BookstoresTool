import React, { useState } from "react";
import SubCategorycontext from "./SubCategoryContext";
import * as apiroute from "../API/ApiRouter";

const SubCategoryState = (props) => {

    const SubCategoryFunction = async (report) => {
        try {
            let jsonString = JSON.stringify(report);
            let reportParam = encodeURIComponent(jsonString);
            let urlWithParams = `${apiroute.host}${apiroute.subcategoryurl}?report=${reportParam}`;
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

    const SubCategoryCodeFunction = async (code) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.subcategorycodeurl}?code=${code}`;
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

    const SubCategoryPathFunction = async (path) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.subcategorypathurl}?path=${path}`;
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

    const GetSubCategoryFunction = async (scid) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.getsubcategoryurl}?scid=${encodeURIComponent(
                scid
            )}`;
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



    const SaveSubCategoryFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.savesubcategoryurl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("token"),
                },
                body: JSON.stringify(formdata),
            });
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const RestoreSubCategoryFuncation = async (scid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.restoresubcategoryurl}?scid=${encodeURIComponent(scid)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                }
            );
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const DeleteSubCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deletesubcategoryurl}?scid=${encodeURIComponent(Pid)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                }
            );
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const ActivetedSubCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.activesubcategoryurl}?scid=${encodeURIComponent(
                    Pid
                )}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                }
            );
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const DeActivetedSubCategoryFuncation = async (scid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deactivesubcategoryurl}?scid=${encodeURIComponent(scid)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: sessionStorage.getItem("token"),
                    },
                }
            );
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const UpdateSubCategoryFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.updatesubcategoryurl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("token"),
                },
                body: JSON.stringify(formdata),
            });
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    return (
        <SubCategorycontext.Provider
            value={{
                //SubCategory
                SubCategoryFunction,
                SubCategoryCodeFunction,
                SubCategoryPathFunction,
                GetSubCategoryFunction,
                SaveSubCategoryFuncation,
                DeleteSubCategoryFuncation,
                ActivetedSubCategoryFuncation,
                UpdateSubCategoryFuncation,
                DeActivetedSubCategoryFuncation,
                RestoreSubCategoryFuncation,
            }}
        >
            {props.children}
        </SubCategorycontext.Provider>
    );
};
export default SubCategoryState;
