import React, { useContext, useEffect, useState } from "react";
import { ISelectModel } from "../../../../../models/model";
import Productcontex from "../../../../../Context/Product/ProductContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DebounceInput } from "react-debounce-input";
import PageTitle from "../../../../../PageTitle/PageTitle";
import AuthContext from "../../../../../Context/Auth/AuthContext";
import { ISubCategorySaveModel } from "../../../../../models/savemodel";
import Categorycontext from "../../../../../Context/Category/CategoryContext";
import SubCategorycontext from "../../../../../Context/SubCategory/SubCategoryContext";

const EditSubCategory = (props: any) => {
  const navigate = useNavigate();
  let { id } = useParams<string>();
  const context = useContext(AuthContext);
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
    GetSubCategoryFunction,
    UpdateSubCategoryFuncation,
  } = SubCategoryContex;
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    productId: "",
    categoryId: "",
  });
  const [ProductList, setProductList] = useState<ISelectModel[]>([]);
  const [CategoryList, setCategoryList] = useState<ISelectModel[]>([]);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isChecked, setIsChecked] = useState(true);
  const [name, setName] = useState("");



  useEffect(() => {
    document.title = PageTitle.EditSubCategory;
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
          setProductList(response_ProductList.data.listdata);
          GetSubCategoryData();
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


  const GetSubCategoryData = async () => {
    props.setLoading(true);
    try {
      const response = await GetSubCategoryFunction(
        decodeURIComponent(id as string)
      );
      console.log(response);
      if (response.Success === true && response.data) {
        setProductId(response.data.pID);
        setCategoryId(response.data.cID);       
        setName(response.data.name);
        setIsChecked(response.data.isActive);
        CategoryListFunction(response.data.pID);
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
    CategoryListFunction(value);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setCategoryId(value || undefined); // Use undefined if no product is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      productId: "",
    }));
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
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

      if (categoryId === undefined) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          categoryId: "Category is required",
        }));
      }
      props.setLoading(false);
      return;
    }

    let subcategory: ISubCategorySaveModel = {
      scID: decodeURIComponent(id as string),
      pID: Number(productId),
      cID: Number(categoryId),
      name: name,
      isActive: isChecked,
    };

    const response = await UpdateSubCategoryFuncation(subcategory);
    console.log(response);
    if (response.Success) {
      setProductId(undefined);
      setCategoryId(undefined);
      setName("");
      setIsChecked(true);
      setErrors({
        productId: "",
        categoryId: "",
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
      navigate("/subcategory");
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
      navigate("/subcategory");
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
              value={productId}
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
              value={categoryId}
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

export default EditSubCategory;
