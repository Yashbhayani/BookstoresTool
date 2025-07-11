import React, { useContext, useEffect } from 'react'
import Authcontex from '../../../../../Context/Auth/AuthContext';
import Customercontex from '../../../../../Context/CustomerList/CustomerContext';
import PageTitle from '../../../../../PageTitle/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

const ListOfApplyUserAdmin = (props: any) => {
  let { id } = useParams<string>();
  const navigate = useNavigate();

  const context = useContext(Authcontex);
  const Customercontext = useContext(Customercontex);
   const { CheckuserFunction } = context;
  const { ApplyUserAdminInfoList } = Customercontext;

  useEffect(() => {
    document.title = PageTitle.ListOfApplyUserAdmin;
    const token = sessionStorage.getItem("token");
    if (token !== null && token !== undefined && token !== "") {
      CallCheckuser();
    } else {
      navigate("/login");
    }
  }, []);
  
    const CallCheckuser = async () => {
    //props.setLoading(true);
    try {
      const response = await CheckuserFunction();
      if (response.Success === true) {
        if (!response.data) {
         // props.setLoading(false);
          navigate("/");
        } else {
          CallApplyUserAdminInfoList(decodeURIComponent(id as string));
        }
      } else {
       // props.setLoading(false);
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
     // props.setLoading(false);
    }
  };


  const CallApplyUserAdminInfoList = async (uid:string) => {
   // props.setLoading(true);
     const response = await ApplyUserAdminInfoList(
        decodeURIComponent(id as string)
      );
      console.log(response);
    //props.setLoading(false);
    //navigate('/apply-user-admin');
  }

  return (
    <div>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
        <h4>Apply User Admin List</h4>
    </div>
  )
}

export default ListOfApplyUserAdmin
