import React, { useContext, useEffect, useState } from "react";
import { ISelectModel } from "../../../../../models/model";
import PageTitle from "../../../../../PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import Authcontex from "../../../../../Context/Auth/AuthContext";
import Productcontex from "../../../../../Context/Product/ProductContext";
import toast from "react-hot-toast";
import { DebounceInput } from "react-debounce-input";

const AddSubCategory = (props: any) => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    code: "",
    name: "",
    cpath: "",
    productId: "",
  });  
  
  const [code, setCode] = useState("");
  const [ProductList, setProductList] = useState<ISelectModel[]>([]);
  const [CategoryList, setCategoryList] = useState<ISelectModel[]>([]);
  const context = useContext(Authcontex);
  const Productcontext = useContext(Productcontex);
  const { CheckuserFunction } = context;
  const {
    SelectProductListFunction,
    SelectCategoryListFunction,
    CategoryCodeFunction,
    CategoryPathFunction,
    SaveCategoryFuncation,
  } = Productcontext;
  useEffect(() => {
    document.title = PageTitle.AddCategory;
    const token = sessionStorage.getItem("token");
    if (token) {
      CallCheckuser();
    } else {
      navigate("/login");
    }
  }, []);

  const CallCheckuser = async () => {
    props.setLoading(true);
    try {
      const response = await CheckuserFunction();
      if (response.Success) {
        if (!response.data) {
          navigate("/");
          props.setLoading(false);
        } else {
          ProductListFunction();
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

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setProductId(value || undefined); // Use undefined if no product is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      productId: "",
    }));
    CategoryListFunction(value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setCategoryId(value || undefined); // Use undefined if no product is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      productId: "",
    }));
  };

  const ProductListFunction = async () => {
    props.setLoading(true);
    try {
      const response_ProductList = await SelectProductListFunction();
      if (response_ProductList.Success) {
        if (!response_ProductList.Success) {
          navigate("/");
          props.setLoading(false);
        } else {
          setProductList(response_ProductList.data);
          props.setLoading(false);
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

  const CategoryListFunction = async (pid: any) => {
    props.setLoading(true);
    try {
      const response_CategoryList = await SelectCategoryListFunction(pid);
      if (response_CategoryList.Success) {
        if (!response_CategoryList.Success) {
          navigate("/");
          props.setLoading(false);
        } else {
          setCategoryList(response_CategoryList.data);
          props.setLoading(false);
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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCode(value.toUpperCase().replace(/\s/g, ""));
    props.setLoading(true);
    CheckCode(value.toUpperCase().replace(/\s/g, ""));
  };
  const CheckCode = async (value: string) => {
    try {
      const response = await CategoryCodeFunction(value);
      if (response.Success) {
        if (!response.data) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            code: "Code is Alredy added",
          }));
          props.setLoading(false);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            code: "",
          }));
          props.setLoading(false);
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
    // Implement code validation logic here
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { };
  return (
    <div>
      <h4>Add SubCategory</h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-2">
          <div className="col-md-6">
            <label htmlFor="inputProduct" className="form-label">
              Select Product
            </label>
            <select
              className={`form-control ${errors.productId ? "is-invalid" : ""}`}
              id="inputProduct"
              onChange={handleProductChange}
            >
              <option value="">Select</option>
              {ProductList.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <div className="invalid-feedback">{errors.productId}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="inputCategory" className="form-label">
              Select Category
            </label>
            <select
              className={`form-control ${errors.productId ? "is-invalid" : ""}`}
              id="inputCategory"
              onChange={handleCategoryChange}
            >
              <option value="">Select</option>
              {CategoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <div className="invalid-feedback">{errors.productId}</div>
            )}
          </div>
        </div>
        <div className="row g-3 mb-2">
            <div className="col-md-6">
                      <label htmlFor="inputCode" className="form-label">
                        Code
                      </label>
                      <DebounceInput
                        type="text"
                        minLength={3}
                        debounceTimeout={300}
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        id="inputCode"
                        value={code}
                        onChange={handleCodeChange}
                      />
                      {errors.code && (
                        <div className="invalid-feedback">{errors.code}</div>
                      )}
                    </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
