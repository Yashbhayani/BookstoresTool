import React from "react";
import Categorycontext from "./CategoryContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";


const CategoryState = (props) => {
  // ✅ Category APIs using apiRequest

  const CategoryFunction = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.categoryurl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const CategoryCodeFunction = (code) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.categorycodeurl}`,
      method: "GET",
      params: { code },
    });

  const CategoryPathFunction = (path) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.categorypathurl}`,
      method: "GET",
      params: { path },
    });

  const SelectCategoryListFunction = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.select_category_list}`,
      method: "GET",
      params: { pid: Pid },
    });

  const GetCategoryFunction = (cid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.getcategoryurl}`,
      method: "GET",
      params: { cid },
    });

  const SaveCategoryFuncation = (formdata) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.savecategoryurl}`,
      method: "POST",
      body: formdata,
    });

  const UpdateCategoryFuncation = (formdata) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.updatecategoryurl}`,
      method: "PUT",
      body: formdata,
    });

  const DeleteCategoryFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.deletecategoryurl}`,
      method: "DELETE",
      params: { cid: Pid },
    });

  const RestoreCategoryFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.restorecategoryurl}`,
      method: "PUT",
      params: { cid: Pid },
    });

  const ActivetedCategoryFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.activecategoryurl}`,
      method: "PUT",
      params: { cid: Pid },
    });

  const DeActivetedCategoryFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.deactivecategoryurl}`,
      method: "PUT",
      params: { cid: Pid },
    });

  return (
    <Categorycontext.Provider
      value={{
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
