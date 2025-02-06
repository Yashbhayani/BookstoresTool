import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Authcontex from "../../../../../Context/Auth/AuthContext";
import Productcontex from "../../../../../Context/Product/ProductContext";
import { DebounceInput } from "react-debounce-input";
import toast from "react-hot-toast";
import { ISelectModel } from "../../../../../models/model";
import { ICategorySaveModel } from "../../../../../models/savemodel";
import PageTitle from "../../../../../PageTitle/PageTitle";
import Categorycontext from "../../../../../Context/Category/CategoryContext";

const AddCategory = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Authcontex);
  const ProductContext = useContext(Productcontex);
  const CategoryContext = useContext(Categorycontext);
  const { CheckuserFunction } = context;
  const {
    SelectProductListFunction
  } = ProductContext;
  const {
    CategoryCodeFunction,
    CategoryPathFunction,
    SaveCategoryFuncation,
  } = CategoryContext;
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    code: "",
    name: "",
    scpath: "",
    productId: "",
    categoryId: "",
  });
  const [isChecked, setIsChecked] = useState(true);

  const [ProductList, setProductList] = useState<ISelectModel[]>([]);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [cpath, setCpath] = useState("");

  useEffect(() => {
    document.title = PageTitle.AddCategory;
    const token = sessionStorage.getItem("token");
    if (token) {
      CallCheckuser();
    } else {
      navigate("/login");
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCode(value.toUpperCase().replace(/\s/g, ""));
    props.setLoading(true);
    CheckCode(value.toUpperCase().replace(/\s/g, ""));
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCpath(value.toLowerCase().replace(/\s/g, "-"));
    props.setLoading(true);
    CheckPath(value.toLowerCase().replace(/\s/g, "-"));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: "",
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setProductId(value || undefined); // Use undefined if no product is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      productId: "",
    }));
  };

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

  const CheckPath = async (value: string) => {
    try {
      const response = await CategoryPathFunction(value);
      if (response.Success) {
        if (!response.data) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            cpath: "Path is Alredy added",
          }));
          props.setLoading(false);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            cpath: "",
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

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setLoading(true);
    if (
      !code.trim() ||
      !name.trim() ||
      !cpath.trim() ||
      productId === undefined
    ) {
      if (!code.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          code: "Code is required",
        }));
      }
      if (!name.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Name is required",
        }));
      }
      if (!cpath.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cpath: "Path is required",
        }));
      }

      if (productId === undefined) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          productId: "Product is required",
        }));
      }
      props.setLoading(false);
      return;
    }

    let category: ICategorySaveModel = {
      sID: "",
      pID: Number(productId),
      code: code,
      path: cpath,
      name: name,
      isActive: isChecked,
    };

    const response = await SaveCategoryFuncation(category);
    console.log(response);
    if (response.Success) {
      setProductId(undefined);
      setCode("");
      setCpath("");
      setName("");
      setIsChecked(true);
      setErrors({
        productId: "",
        cpath: "",
        code: "",
        name: "",
      });
      props.setLoading(false);
      toast.success(response.Message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });
    } else {
      props.setLoading(false);
      toast.error(response.Message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });
    }
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
          setProductList(response_ProductList.data.listdata);
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

  return (
    <div>
      <h4>Add Category</h4>
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
        <div className="row g-3 mb-2">
          <div className="col-md-6">
            <label htmlFor="inputCpath" className="form-label">
              Category Path
            </label>
            <DebounceInput
              type="text"
              minLength={3}
              debounceTimeout={300}
              className={`form-control ${errors.cpath ? "is-invalid" : ""}`}
              id="inputCpath"
              value={cpath}
              onChange={handlePathChange}
            />
            {errors.cpath && (
              <div className="invalid-feedback">{errors.cpath}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="inputName"
              value={name}
              onChange={handleNameChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="inputName">
              Is Active
            </label>
            <div>
              <label className="switch m-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-outline-primary m-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
