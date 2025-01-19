import React, { useState } from "react";
import Productcontex from "./ProductContext";
import * as apiroute from "../API/ApiRouter";

const ProductState = (props) => {
    const ProductFunction = async (report) => {
        try {
            let jsonString = JSON.stringify(report);
            let reportParam = encodeURIComponent(jsonString);
            let urlWithParams = `${apiroute.host}${apiroute.producturl}?report=${reportParam}`;
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


    const ProductCodeFunction = async (code) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.productcodeurl}?code=${code}`;
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

    const SaveProductFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.saveproducturl, {
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

    const UpdateProductFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host + apiroute.updateproducturl, {
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

    const DeleteProductFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deleteproducturl}?pid=${encodeURIComponent(Pid)}`,
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

    const RestoreProductFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.restoreproducturl}?pid=${encodeURIComponent(Pid)}`,
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

    const ActiveteProductFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.activeproducturl}?pid=${encodeURIComponent(Pid)}`,
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

    const DeActiveProductFuncation = async (Pid) => {
        try {
            const response = await fetch(
                `${apiroute.host}${apiroute.deactiveproducturl}?pid=${encodeURIComponent(Pid)}`,
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


    const SelectProductListFunction = async () => {
        try {
            const response = await fetch(apiroute.host + apiroute.select_product_list, {
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


    const GetProductFunction = async (pid) => {
        try {
            let urlWithParams = `${apiroute.host}${apiroute.getproducturl}?pid=${encodeURIComponent(
                pid
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



    return (
        <Productcontex.Provider
            value={{
                //Product
                ProductFunction,
                ProductCodeFunction,
                SaveProductFuncation,
                SelectProductListFunction,
                GetProductFunction,
                UpdateProductFuncation,
                DeleteProductFuncation,
                RestoreProductFuncation,
                ActiveteProductFuncation,
                DeActiveProductFuncation,
            }}
        >
            {props.children}
        </Productcontex.Provider>
    );
};
export default ProductState;
