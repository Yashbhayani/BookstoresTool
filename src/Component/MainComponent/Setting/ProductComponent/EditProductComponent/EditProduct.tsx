import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../../../Context/Auth/AuthContext";
import toast from "react-hot-toast";
import PageTitle from "../../../../../PageTitle/PageTitle";
import { IProductSaveModel } from "../../../../../models/savemodel";
import { DebounceInput } from "react-debounce-input";
import Productcontex from "../../../../../Context/Product/ProductContext";

const EditProduct = (props: any) => {
  let { id } = useParams<string>();
  const context = useContext(AuthContext);
  const ProductContext = useContext(Productcontex);
  const { CheckuserFunction } = context;
  const { ProductCodeFunction, UpdateProductFuncation, GetProductFunction } =
    ProductContext;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    code: "",
    name: "",
  });

  useEffect(() => {
    document.title = PageTitle.EditProduct;
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
      if (response.Success === true) {
        if (response.data) {
          GetProductData();
        } else {
          navigate("/");
        }
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

  const GetProductData = async () => {
    props.setLoading(true);
    try {
      const response = await GetProductFunction(
        decodeURIComponent(id as string)
      );
      if (response.Success === true && response.data) {
        setName(response.data.name);
        setIsChecked(response.data.active);
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    props.setLoading(true);

    if (!name.trim()) {
      setErrors({
        name: !name.trim() ? "Name is required" : "",
      });
      props.setLoading(false);
      return;
    }

    let product: IProductSaveModel = {
      pid: decodeURIComponent(id as string)!,
      name: name,
      isActive: isChecked,
    };

    try {
      const response = await UpdateProductFuncation(product);
      if (response.Success) {
        toast.success(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
        navigate("/product");
      } else {
        toast.error(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
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

  const CheckCode = async (value: string) => {
    try {
      const response = await ProductCodeFunction(value);
      if (response.data) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          code: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          code: "Code is already added",
        }));
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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    //    setCode(value.toUpperCase().replace(/\s/g, ''));
    props.setLoading(true);
    CheckCode(value.toUpperCase().replace(/\s/g, ""));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const back = () => {
    navigate("/product");
  };

  return (
    <div>
      <h4>Edit Product</h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
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

export default EditProduct;
