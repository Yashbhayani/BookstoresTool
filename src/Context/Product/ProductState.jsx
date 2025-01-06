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
            let urlWithParams = `${apiroute.host}${apiroute.categorycodepath}?code=${path}`;
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

    const SaveCategoryFuncation = async (formdata) => {
        try {
            const response = await fetch(apiroute.host +apiroute.savecategoryurl, {
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

    const ActivetedDeleteSubCategoryFuncation = async (Pid) => {
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
                
                //SubCategory
                SubCategoryFunction,
                DeleteSubCategoryFuncation,
                ActivetedDeleteSubCategoryFuncation,
                UpdateSubCategoryFuncation,
            }}
        >
            {props.children}
        </Productcontex.Provider>
    );
};
export default ProductState;
