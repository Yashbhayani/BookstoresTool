import React from "react";
import SubCategorycontext from "./SubCategoryContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";

const SubCategoryState = (props) => {
    const SubCategoryFunction = async (report) => {
        let urlWithParams = `${apiroute.host}${apiroute.subcategoryurl}?report=${encodeURIComponent(JSON.stringify(report))}`;
        return await apiRequest(urlWithParams);
    };

    const SubCategoryCodeFunction = async (code) => {
        let urlWithParams = `${apiroute.host}${apiroute.subcategorycodeurl}?code=${encodeURIComponent(code)}`;
        return await apiRequest(urlWithParams);
    };

    const SubCategoryPathFunction = async (path) => {
        let urlWithParams = `${apiroute.host}${apiroute.subcategorypathurl}?path=${encodeURIComponent(path)}`;
        return await apiRequest(urlWithParams);
    };

    const GetSubCategoryFunction = async (scid) => {
        let urlWithParams = `${apiroute.host}${apiroute.getsubcategoryurl}?scid=${encodeURIComponent(scid)}`;
        return await apiRequest(urlWithParams);
    };

    const SaveSubCategoryFuncation = async (formdata) => {
        return await apiRequest(apiroute.host + apiroute.savesubcategoryurl, "POST", formdata);
    };

    const RestoreSubCategoryFuncation = async (scid) => {
        let urlWithParams = `${apiroute.host}${apiroute.restoresubcategoryurl}?scid=${encodeURIComponent(scid)}`;
        return await apiRequest(urlWithParams, "PUT");
    };

    const DeleteSubCategoryFuncation = async (Pid) => {
        let urlWithParams = `${apiroute.host}${apiroute.deletesubcategoryurl}?scid=${encodeURIComponent(Pid)}`;
        return await apiRequest(urlWithParams, "DELETE");
    };

    const ActivetedSubCategoryFuncation = async (Pid) => {
        let urlWithParams = `${apiroute.host}${apiroute.activesubcategoryurl}?scid=${encodeURIComponent(Pid)}`;
        return await apiRequest(urlWithParams, "PUT");
    };

    const DeActivetedSubCategoryFuncation = async (scid) => {
        let urlWithParams = `${apiroute.host}${apiroute.deactivesubcategoryurl}?scid=${encodeURIComponent(scid)}`;
        return await apiRequest(urlWithParams, "PUT");
    };

    const UpdateSubCategoryFuncation = async (formdata) => {
        return await apiRequest(apiroute.host + apiroute.updatesubcategoryurl, "PUT", formdata);
    };

    // ====================== CONTEXT PROVIDER ======================
    return (
        <SubCategorycontext.Provider
            value={{
                SubCategoryFunction,
                SubCategoryCodeFunction,
                SubCategoryPathFunction,
                GetSubCategoryFunction,
                SaveSubCategoryFuncation,
                RestoreSubCategoryFuncation,
                DeleteSubCategoryFuncation,
                ActivetedSubCategoryFuncation,
                DeActivetedSubCategoryFuncation,
                UpdateSubCategoryFuncation,
            }}
        >
            {props.children}
        </SubCategorycontext.Provider>
    );
};

export default SubCategoryState;
