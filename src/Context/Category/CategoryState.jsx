import React, { useState } from "react";
import Categorycontext from "./CategoryContext";
import * as apiroute from "../API/ApiRouter";

const CategoryState = (props) => {

    const CategoryFunction = async (report) => {
        try {
            let jsonString = JSON.stringify(report);
            let reportParam = encodeURIComponent(jsonString);
            let urlWithParams = `${apiroute.host}${apiroute.categoryurl}?report=${reportParam}`;
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





    const CategoryCodeFunction = async (code) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.categorycodeurl}?code=${code}`;
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

    const CategoryPathFunction = async (path) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.categorypathurl}?path=${path}`;
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

    const SelectCategoryListFunction = async (Pid) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.select_category_list
                }?pid=${encodeURIComponent(Pid)}`;
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


    const ActivetedCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.activecategoryurl}?cid=${encodeURIComponent(Pid)}`,
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

    const DeActivetedCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deactivecategoryurl}?cid=${encodeURIComponent(Pid)}`,
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


    const SaveCategoryFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.savecategoryurl, {
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


    const GetCategoryFunction = async (cid) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.getcategoryurl}?cid=${encodeURIComponent(
                cid
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

    const DeleteCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deletecategoryurl}?cid=${encodeURIComponent(Pid)}`,
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

    const RestoreCategoryFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.restorecategoryurl}?cid=${encodeURIComponent(Pid)}`,
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

    const UpdateCategoryFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.updatecategoryurl, {
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
        <Categorycontext.Provider
            value={{
                //Category
                CategoryFunction,
                CategoryCodeFunction,
                CategoryPathFunction,
                SelectCategoryListFunction,
                GetCategoryFunction,
                SaveCategoryFuncation,
                UpdateCategoryFuncation,
                DeleteCategoryFuncation,
                ActivetedCategoryFuncation,
                RestoreCategoryFuncation,
                DeActivetedCategoryFuncation,

            }}
        >
            {props.children}
        </Categorycontext.Provider>
    );
};
export default CategoryState;
