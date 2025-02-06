import React, { useContext, useEffect, useState } from "react";
import { ISelectModel } from "../../../../../models/model";
import PageTitle from "../../../../../PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import Authcontex from "../../../../../Context/Auth/AuthContext";
import Productcontex from "../../../../../Context/Product/ProductContext";
import toast from "react-hot-toast";
import { DebounceInput } from "react-debounce-input";
import { ISubCategorySaveModel } from "../../../../../models/savemodel";
import SubCategorycontext from "../../../../../Context/SubCategory/SubCategoryContext";
import Categorycontext from "../../../../../Context/Category/CategoryContext";

const AddSubCategory = (props: any) => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    code: "",
    name: "",
    cpath: "",
    productId: "",
    categoryId: "",
  });
  const [cpath, setCpath] = useState("");
  const [name, setName] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [code, setCode] = useState("");
  const [ProductList, setProductList] = useState<ISelectModel[]>([]);
  const [CategoryList, setCategoryList] = useState<ISelectModel[]>([]);
  const context = useContext(Authcontex);
  const ProductContex = useContext(Productcontex);
  const CategoryContex = useContext(Categorycontext);
  const SubCategoryContex = useContext(SubCategorycontext);
  

  const { CheckuserFunction } = context;
  const {
    SelectProductListFunction
  } = ProductContex;
  const {
    SelectCategoryListFunction
  } = CategoryContex;
  const {
    SubCategoryCodeFunction,
    SubCategoryPathFunction,
    SaveSubCategoryFuncation,
  } = SubCategoryContex;
  useEffect(() => {
    document.title = PageTitle.AddSubCategory;
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

  const CategoryListFunction = async (pid: any) => {
    props.setLoading(true);
    try {
      const response_CategoryList = await SelectCategoryListFunction(pid);
      if (response_CategoryList.Success) {
        if (!response_CategoryList.Success) {
          navigate("/");
          props.setLoading(false);
        } else {
          setCategoryList(response_CategoryList.data.listdata);
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
      const response = await SubCategoryCodeFunction(value);
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
      const response = await SubCategoryPathFunction(value);
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

      if (categoryId === undefined) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          categoryId: "Category is required",
        }));
      }
      props.setLoading(false);
      return;
    }

    let category: ISubCategorySaveModel = {
      scID: "",
      pID: Number(productId),
      cID: Number(categoryId),
      code: code,
      path: cpath,
      name: name,
      isActive: isChecked,
    };

    const response = await SaveSubCategoryFuncation(category);
    console.log(response);
    if (response.Success) {
      setProductId(undefined);
      setCategoryId(undefined);
      setCode("");
      setCpath("");
      setName("");
      setIsChecked(true);
      setErrors({
        productId: "",
        categoryId: "",
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
        </div>
        <div className="row g-3 mb-2">
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

export default AddSubCategory;
