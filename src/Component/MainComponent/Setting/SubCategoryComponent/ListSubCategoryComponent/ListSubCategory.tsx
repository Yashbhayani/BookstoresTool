import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Authcontex from "../../../../../Context/Auth/AuthContext";
import { ISubcategoryModel } from "../../../../../models/model";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../../../Redux";
import toast from "react-hot-toast";
import Pagination from "../../../../Module/PaginationComponent/Pagination";
import PageTitle from "../../../../../PageTitle/PageTitle";
import { confirmAlert } from "react-confirm-alert";
import SubCategorycontext from "../../../../../Context/SubCategory/SubCategoryContext";

const ListSubCategory = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(Authcontex);
  const SubCategoryContext = useContext(SubCategorycontext);
  const { CheckuserFunction } = context;
  const {
    SubCategoryFunction,
    DeleteSubCategoryFuncation,
    ActivetedSubCategoryFuncation,
    DeActivetedSubCategoryFuncation,
    RestoreSubCategoryFuncation,
  } = SubCategoryContext;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState(0);
  const action = bindActionCreators(actionCreators, dispatch);
  const [subCategoryList, setSubCategoryList] = useState<ISubcategoryModel[]>(
    []
  );
  const [IsActive, setIsActive] = useState("ALL");
  const [IsDeleted, setDeleted] = useState("ALL");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(100);
  const [id, setId] = useState("");

  useEffect(() => {
    document.title = PageTitle.ListSubCategory;
    const token = sessionStorage.getItem("token");
    if (token !== null && token !== undefined && token !== "") {
      CallCheckuser(); // Await the Checkuser function
    } else {
      navigate("/login");
    }
  }, []); // Empty dependency array ensures this runs only on mount

  const CallCheckuser = async () => {
    props.setLoading(true);
    try {
      const response = await CheckuserFunction();
      if (response.Success === true) {
        if (!response.data) {
          props.setLoading(false);
        } else {
          await CallSubCategory(
            currentPage,
            itemsPerPage,
            sortBy,
            sortOrder,
            IsActive,
            IsDeleted
          );
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
      return false;
    }
  };

  const CallSubCategory = async (
    cP: any,
    iP: number,
    sB: string,
    sO: number,
    Active: string,
    Deleted: string
  ) => {
    props.setLoading(true);
    try {
      let jsonObject = {
        reversestatus: sO, // order by
        qpara: sB, // order type
        searchKey: searchTerm, // search
        showActiveType: Active, //showActiveType,
        showDeleteType: Deleted, //
        onset_val: (cP - 1) * iP, // offset
        offset_val: iP, // limit
      };

      let response = await SubCategoryFunction(jsonObject);
      if (response.Success) {
        setTotalRecords(response.data.count);
        setSubCategoryList(response.data.listdata);
        console.log(response);
        props.setLoading(false);
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

  const handleStatusChange = (event: any) => {
    const status = event.target.value;
    setIsActive(status);
  };

  const handleDeleteStatusChange = (event: any) => {
    const deleteStatus = event.target.value;
    setDeleted(deleteStatus);
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const searchData = () => {
    CallSubCategory(1, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
  };

  const onPageChange = (page: any) => {
    setCurrentPage(Number(page));
    CallSubCategory(page, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
  };

  const onchangeItemsPerPage = (iPerPage: any) => {
    const newItemsPerPage = Number(iPerPage);
    setItemsPerPage(newItemsPerPage);
    CallSubCategory(1, newItemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
  };

  const addCategory = () => {
    navigate("/subcategory/save");
  };

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 0 ? 1 : 0);
  };

  const handleSort = async (columnName: any) => {
    if (sortBy === columnName) {
      toggleSortOrder();
    } else {
      setSortBy(columnName);
      toggleSortOrder();
    }
    await CallSubCategory(
      currentPage,
      itemsPerPage,
      columnName,
      sortOrder,
      IsActive,
      IsDeleted
    );
  };

  const handleActive = async (lid: string) => {
    props.setLoading(true);
    try {
      let response = await ActivetedSubCategoryFuncation(lid);
      setId("");
      if (response.Success) {
        CallCheckuser();
        toast.success(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
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
    } catch (error) {
      toast.error("An error occurred", {
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

  const handleDeActive = async (lid: string) => {
    props.setLoading(true);
    try {
      let response = await DeActivetedSubCategoryFuncation(lid);
      setId("");
      if (response.Success) {
        CallCheckuser();
        toast.success(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
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
    } catch (error) {
      toast.error("An error occurred", {
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

  const handleDelete = async (pid: string) => {
    props.setLoading(true);
    try {
      let response = await DeleteSubCategoryFuncation(pid);
      setId("");
      if (response.Success) {
        CallCheckuser();
        toast.success(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
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
    } catch (error) {
      toast.error("An error occurred", {
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

  const Delete = (scid: string) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => await handleDelete(scid),
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      overlayClassName: "overlay-custom-class-name",
    });
  };

  const Edit = (pid: string) => {
    navigate(`/subcategory/edit/${encodeURIComponent(pid)}`);
  };

  const handleRestore = async (scid: string) => {
    props.setLoading(true);
    try {
      let response = await RestoreSubCategoryFuncation(scid);
      setId("");
      if (response.Success) {
        CallCheckuser();
        toast.success(response.Message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
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
    } catch (error) {
      toast.error("An error occurred", {
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
  const Restore = (scid: string) => {
    confirmAlert({
      title: "Confirm to Restore",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => await handleRestore(scid),
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      overlayClassName: "overlay-custom-class-name",
    });
  };

  const Activeted = (scid: string) => {
    confirmAlert({
      title: "Confirm to activate",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => await handleActive(scid),
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      overlayClassName: "overlay-custom-class-name",
    });
  };

  const DeActivated = (scid: string) => {
    confirmAlert({
      title: "Confirm to Deactivate",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => await handleDeActive(scid),
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      overlayClassName: "overlay-custom-class-name",
    });
  };
  return (
    <div>
      <h4>SubCategory</h4>
      <hr />
      <div className="navbar navbar-light">
        <div className="container-fluid">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={addCategory}
          >
            Add
          </button>
          <div className="d-flex align-items-center ms-3">
            <div className="d-flex align-items-center me-3">
              {/* First Dropdown with Label */}
              <label
                htmlFor="statusFilter"
                className="form-label mb-0 me-2 align-self-center"
              >
                Active:
              </label>
              <select
                id="statusFilter"
                className="form-select"
                aria-label="Filter status"
                onChange={handleStatusChange}
              >
                <option value="ALL">ALL</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>
            <div className="d-flex align-items-center me-3">
              {/* Second Dropdown with Label */}
              <label
                htmlFor="deleteStatusFilter"
                className="form-label mb-0 me-2 align-self-center"
              >
                Delete:
              </label>
              <select
                id="deleteStatusFilter"
                className="form-select"
                aria-label="Filter deletion status"
                onChange={handleDeleteStatusChange}
              >
                <option value="ALL">ALL</option>
                <option value="IsDeleted">Deleted</option>
                <option value="IsNotDeleted">Non Deleted</option>
              </select>
            </div>
            <div className="d-flex align-items-center">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearchChange}
              />
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={searchData}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <table className="m-3 table">
        <thead className="table-primary">
          <tr>
            <th scope="col" onClick={() => handleSort("id")}>
              #{" "}
              {sortBy === "id" && (
                <span>
                  {sortOrder === 1 ? (
                    <i className="bi bi-arrow-up"></i>
                  ) : (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("ProductName")}>
              Product Name{" "}
              {sortBy === "ProductName" && (
                <span>
                  {sortOrder === 1 ? (
                    <i className="bi bi-arrow-up"></i>
                  ) : (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("CategoryName")}>
              Category Name{" "}
              {sortBy === "CategoryName" && (
                <span>
                  {sortOrder === 1 ? (
                    <i className="bi bi-arrow-up"></i>
                  ) : (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("SubCategoryPath")}>
              SubCategory Path{" "}
              {sortBy === "SubCategoryPath" && (
                <span>
                  {sortOrder === 1 ? (
                    <i className="bi bi-arrow-up"></i>
                  ) : (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("SubCategoryValue")}>
              SubCategory Value{" "}
              {sortBy === "SubCategoryValue" && (
                <span>
                  {sortOrder === 1 ? (
                    <i className="bi bi-arrow-up"></i>
                  ) : (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </span>
              )}
            </th>
            <th scope="col"> Active </th>
            <th scope="col"> Delete </th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {subCategoryList &&
            subCategoryList.map((subcategory, index) => (
              <tr key={subcategory.id}>
                <th scope="row">
                  {(currentPage - 1) * itemsPerPage + (index + 1)}
                </th>
                <td>{subcategory.productName}</td>
                <td>{subcategory.categoryName}</td>
                <td>{subcategory.subCategoryPath}</td>
                <td>{subcategory.subCategoryValue}</td>
                <td>
                  {subcategory.isactive ? (
                    <span role="img" aria-label="Active">
                      &#128994;
                    </span>
                  ) : (
                    <span role="img" aria-label="Inactive">
                      &#128308;
                    </span>
                  )}
                </td>
                <td>
                  {subcategory.isdelete ? (
                    <span role="img" aria-label="Active">
                      &#128994;
                    </span>
                  ) : (
                    <span role="img" aria-label="Inactive">
                      &#128308;
                    </span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-info dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Action
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          type="button"
                          className="btn btn-outline-warning m-2"
                          onClick={() => Edit(subcategory.id)}
                        >
                          <span className="bi bi-pencil-square"></span> Edit
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="btn btn-outline-danger m-2"
                          onClick={() => Delete(subcategory.id)}
                          style={{
                            display: subcategory.isdelete
                              ? "none"
                              : "inline-block",
                          }}
                        >
                          <span className="bi bi-trash"></span> Delete
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="btn btn-outline-dark m-2"
                          onClick={() => Restore(subcategory.id)}
                          style={{
                            display: subcategory.isdelete
                              ? "inline-block"
                              : "none",
                          }}
                        >
                          <span className="bi bi-trash"></span> Restore
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="btn btn-outline-success m-2"
                          onClick={() => Activeted(subcategory.id)}
                          style={{
                            display: subcategory.isdelete
                              ? "none"
                              : !subcategory.isactive
                              ? "inline-block"
                              : "none",
                          }}
                        >
                          <span className="bi bi-trash"></span> Activate
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="btn btn-outline-secondary m-2"
                          onClick={() => DeActivated(subcategory.id)}
                          style={{
                            display: subcategory.isdelete
                              ? "none"
                              : subcategory.isactive
                              ? "inline-block"
                              : "none",
                          }}
                        >
                          <span className="bi bi-trash"></span> Deactivate
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        recordsPerPage={itemsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onchangeItemsPerPage={onchangeItemsPerPage} // Correct prop name
      />
    </div>
  );
};

export default ListSubCategory;
