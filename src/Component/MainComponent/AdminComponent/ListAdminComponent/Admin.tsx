import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../PageTitle/PageTitle";
import Authcontex from "../../../../Context/Auth/AuthContext";
import toast from "react-hot-toast";
import Customercontex from "../../../../Context/CustomerList/CustomerContext";
import { ICustomerModel } from "../../../../models/model";
import * as apiroute from "../../../../Context/API/ApiRouter";
import './admin.css';
import Pagination from "../../../Module/PaginationComponent/Pagination";


const initialCustomerList: ICustomerModel[] = [];
const Admin = (props: any) => {
  const navigate = useNavigate();

  const context = useContext(Authcontex);
  const Customercontext = useContext(Customercontex);
  const { CheckuserFunction } = context;
  const { AdminList } = Customercontext;
  
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
    document.title = PageTitle.Admin;
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
          await CallAdmin(
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

  const CallAdmin = async (
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

      let response = await AdminList(jsonObject);
      if (response.Success) {
        //console.log(response.data);
        setTotalRecords(response.data.count);
        setCustomerList(response.data.listdata);
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
    await CallAdmin(currentPage, itemsPerPage, columnName, sortOrder, IsActive, IsDeleted);
  };

  const onPageChange = (page: any) => {
    const newCurrentPage = Number(page);
    setCurrentPage(newCurrentPage);
    CallAdmin(newCurrentPage, itemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
  };

  const onchangeItemsPerPage = (iPerPage: any) => {
      const newItemsPerPage = Number(iPerPage);
      setItemsPerPage(newItemsPerPage)
      CallAdmin(1, newItemsPerPage, sortBy, sortOrder, IsActive, IsDeleted)
  };

  return (
    <div>
      <h4>Admin</h4>
      <hr />

      <table className="m-3 table">
        <thead className="table-primary">
          <tr>
            <th scope="col" onClick={() => handleSort('id')} >ID </th>
            <th scope="col">Image</th>
            <th scope="col" onClick={() => handleSort('FirstName')} >Name </th>
            <th scope="col" onClick={() => handleSort('Email')} >Email</th>
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
                  src={`${apiroute.host}${apiroute.customerimage}${customer.image}`}/>
              </td>
             <td>{customer.firstName} {customer.lastName} </td>
             <td>{customer.email}</td>
             <td>{customer.isActive ? (
                                    <span role="img" aria-label="Active">&#128994;</span>
                                ) : (
                                    <span role="img" aria-label="Inactive">&#128308;</span>
                                )}</td>
             <td>
             {customer.isDeleted ? (
                                    <span role="img" aria-label="Active">&#128994;</span>
                                ) : (
                                    <span role="img" aria-label="Inactive">&#128308;</span>
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

export default Admin;
