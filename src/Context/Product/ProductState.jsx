import React from "react";
import Productcontex from "./ProductContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";


const ProductState = (props) => {
  // ✅ Product Functions using dynamic apiRequest
  const ProductFunction = (report) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.producturl}`,
      method: "GET",
      params: { report: JSON.stringify(report) },
    });

  const ProductCodeFunction = (code) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.productcodeurl}`,
      method: "GET",
      params: { code },
    });

  const SaveProductFuncation = (formdata) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.saveproducturl}`,
      method: "POST",
      body: formdata,
    });

  const UpdateProductFuncation = (formdata) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.updateproducturl}`,
      method: "PUT",
      body: formdata,
    });

  const DeleteProductFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.deleteproducturl}`,
      method: "DELETE",
      params: { pid: Pid },
    });

  const RestoreProductFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.restoreproducturl}`,
      method: "PUT",
      params: { pid: Pid },
    });

  const ActiveteProductFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.activeproducturl}`,
      method: "PUT",
      params: { pid: Pid },
    });

  const DeActiveProductFuncation = (Pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.deactiveproducturl}`,
      method: "PUT",
      params: { pid: Pid },
    });

  const SelectProductListFunction = () =>
    apiRequest({
      url: `${apiroute.host}${apiroute.select_product_list}`,
      method: "GET",
    });

  const GetProductFunction = (pid) =>
    apiRequest({
      url: `${apiroute.host}${apiroute.getproducturl}`,
      method: "GET",
      params: { pid },
    });

  return (
    <Productcontex.Provider
      value={{
        ProductFunction,
        ProductCodeFunction,
        SaveProductFuncation,
        UpdateProductFuncation,
        DeleteProductFuncation,
        RestoreProductFuncation,
        ActiveteProductFuncation,
        DeActiveProductFuncation,
        SelectProductListFunction,
        GetProductFunction,
      }}
    >
      {props.children}
    </Productcontex.Provider>
  );
};

export default ProductState;
