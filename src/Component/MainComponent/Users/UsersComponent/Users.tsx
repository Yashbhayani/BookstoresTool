import React, { useContext, useEffect, useState } from "react";
import Authcontex from "../../../../Context/Auth/AuthContext";
import Customercontex from "../../../../Context/CustomerList/CustomerContext";
import { useNavigate } from "react-router-dom";
import { ICustomerModel } from "../../../../models/model";
import PageTitle from "../../../../PageTitle/PageTitle";
import toast from "react-hot-toast";
import * as apiroute from "../../../../Context/API/ApiRouter";
import Pagination from "../../../Module/PaginationComponent/Pagination";

const Users = (props: any) => {
  const navigate = useNavigate();

  const context = useContext(Authcontex);
  const Customercontext = useContext(Customercontex);
  const { CheckuserFunction } = context;
  const { UserList } = Customercontext;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState(0);
  const [IsActive, setIsActive] = useState("ALL");
  const [IsDeleted, setDeleted] = useState("ALL");

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(10);

  const [customerList, setCustomerList] = useState<ICustomerModel[]>([]);

  useEffect(() => {
    document.title = PageTitle.UserAdmin;
    const token = sessionStorage.getItem("token");
    if (token !== null && token !== undefined && token !== "") {
      CallCheckuser();
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
          navigate("/");
        } else {
          await CallUser(
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
      props.setLoading(false);
    }
  };

  const CallUser = async (
    cP: any,
    iP: any,
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
        searchKey: searchTerm, // search key
        showActiveType: Active, //showActiveType,
        showDeleteType: Deleted, //showDeleteType
        onset_val: (Number(cP) - 1) * Number(iP), // offset
        offset_val: Number(iP), // limit
      };

      let response = await UserList(jsonObject);
      if (response.Success) {
        //console.log(response.data);
        setTotalRecords(response.data.count);
        setCustomerList(response.data.listdata);
        props.setLoading(false);
      } else {
        setTotalRecords(response.data.count);
        setCustomerList([]);
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
    await CallUser(
      currentPage,
      itemsPerPage,
      columnName,
      sortOrder,
      IsActive,
      IsDeleted
    );
  };

  const onPageChange = (page: any) => {
    const newCurrentPage = Number(page);
    setCurrentPage(newCurrentPage);
    CallUser(
      newCurrentPage,
      itemsPerPage,
      sortBy,
      sortOrder,
      IsActive,
      IsDeleted
    );
  };

  const onchangeItemsPerPage = (iPerPage: any) => {
    const newItemsPerPage = Number(iPerPage);
    setItemsPerPage(newItemsPerPage);
    CallUser(1, newItemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
  };

  const handleDeleteStatusChange = (event: any) => {
    const deleteStatus = event.target.value;
    setDeleted(deleteStatus);
  };

  const handleStatusChange = (event: any) => {
    const status = event.target.value;
    setIsActive(status);
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const searchData = () => {
    CallUser(1, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted);
  };

  return (
    <div>
      <h4>Users</h4>
      <hr />

      
      <div className="navbar navbar-light">
        <div className="container-fluid">
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
              ID{" "}
            </th>
            <th scope="col">Image</th>
            <th scope="col" onClick={() => handleSort("FirstName")}>
              Name{" "}
            </th>
            <th scope="col" onClick={() => handleSort("Email")}>
              Email
            </th>
            <th scope="col">Active</th>
            <th scope="col">Delete</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer: ICustomerModel, index) => (
            <tr key={customer.id}>
              <th scope="row">{index + 1}</th>
              <td>
                <img
                  className="rounded-circle"
                  src={`${apiroute.host}${apiroute.customerimage}${customer.image}`}
                  alt={`${index}_${customer.firstName} ${customer.firstName}`}
                />
              </td>
              <td>
                {customer.firstName} {customer.lastName}{" "}
              </td>
              <td>{customer.email}</td>
              <td>
                {customer.isActive ? (
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
                {customer.isDeleted ? (
                  <span role="img" aria-label="Active">
                    &#128994;
                  </span>
                ) : (
                  <span role="img" aria-label="Inactive">
                    &#128308;
                  </span>
                )}
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        recordsPerPage={totalRecords}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onchangeItemsPerPage={onchangeItemsPerPage} // Correct prop name
      />
    </div>
  );
};

export default Users;
