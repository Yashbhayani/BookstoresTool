import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../../../Context/Auth/AuthContext";
import Productcontex from "../../../../../Context/Product/ProductContext";
import PageTitle from "../../../../../PageTitle/PageTitle";
import toast from "react-hot-toast";
import { ISelectModel } from "../../../../../models/model";
import { DebounceInput } from "react-debounce-input";
import { ICategorySaveModel } from "../../../../../models/savemodel";

const EditCategory = (props: any) => {
  let { id } = useParams<string>();
  const context = useContext(AuthContext);
  const ProductContext = useContext(Productcontex);
  const { CheckuserFunction } = context;
  const {
    SelectProductListFunction,
    CategoryCodeFunction,
    CategoryPathFunction,
    GetCategoryFunction,
    UpdateCategoryFuncation
  } = ProductContext;
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    code: "",
    name: "",
    cpath: "",
    productId: "",
  });
  const [ProductList, setProductList] = useState<ISelectModel[]>([]);
  const [productId, setProductId] = useState<any | undefined>(undefined);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [cpath, setCpath] = useState("");
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    document.title = PageTitle.EditCategory;
    const token = sessionStorage.getItem("token");
    if (token) {
      CallCheckuser();
    } else {
      navigate("/login");
    }
    console.log(decodeURIComponent(id as string));
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
          GetCategoryData();
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

  const GetCategoryData = async () => {
    props.setLoading(true);
    try {
      const response = await GetCategoryFunction(
        decodeURIComponent(id as string)
      );
      console.log(response);
      if (response.Success === true && response.data) {
        setProductId(response.data.pID);
        setName(response.data.name);
        setIsChecked(response.data.isActive);
      } else {
        navigate("/");
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
    } finally {
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
      console.log(response);
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

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCpath(value.toLowerCase().replace(/\s/g, "-"));
    props.setLoading(true);
    CheckPath(value.toLowerCase().replace(/\s/g, "-"));
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const CheckPath = async (value: string) => {
    try {
      const response = await CategoryPathFunction(value);
      console.log(response);
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setLoading(true);
    if (
      !name.trim() ||
      productId === undefined
    ) {
      if (!name.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Name is required",
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
      sID:  decodeURIComponent(id as string),
      pID: Number(productId),
      name: name,
      isActive: isChecked,
    };

    const response = await UpdateCategoryFuncation(category);
    console.log(response);
    if (response.Success) {
      setProductId(0);
      setName("");
      setIsChecked(true);
      setErrors({
        productId: "",
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
      navigate("/category");
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
      navigate("/category");
    }
  };

  return (
    <div>
      <div>
        <h4>Update Category</h4>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label htmlFor="inputProduct" className="form-label">
                Select Product
              </label>
              <select
                className={`form-control ${
                  errors.productId ? "is-invalid" : ""
                }`}
                id="inputProduct"
                value={productId}
                onChange={handleProductChange}
              >
                <option value="0">Select</option>
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
    </div>
  );
};

export default EditCategory;
