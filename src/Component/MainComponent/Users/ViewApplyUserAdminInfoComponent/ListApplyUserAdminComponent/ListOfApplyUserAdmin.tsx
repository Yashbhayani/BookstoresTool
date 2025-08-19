import React, { useContext, useEffect, useState } from 'react'
import Authcontex from '../../../../../Context/Auth/AuthContext';
import Customercontex from '../../../../../Context/CustomerList/CustomerContext';
import PageTitle from '../../../../../PageTitle/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { IuserInfoModel } from '../../../../../models/model';

type Props = {
  setLoading: (val: boolean) => void;
  onButtonClick: (uid: string) => void;
  selectedUiid: string | null;
};

const ListOfApplyUserAdmin = ({ setLoading, onButtonClick, selectedUiid }: Props) => {
  let { id } = useParams<string>();
  const navigate = useNavigate();

  const context = useContext(Authcontex);
  const Customercontext = useContext(Customercontex);
  const { CheckuserFunction } = context;
  const { ApplyUserAdminInfoList } = Customercontext;
  const [userInfoList, setUserInfoList] = useState<IuserInfoModel[]>([]);

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
    setLoading(true);
    try {
      const response = await CheckuserFunction();
      if (response.Success === true) {
        if (!response.data) {
          setLoading(false);
          navigate("/");
        } else {
          CallApplyUserAdminInfoList(decodeURIComponent(id as string));
        }
      } else {
        setLoading(false);
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
      setLoading(false);
    }
  };


  const CallApplyUserAdminInfoList = async (uid: string) => {
    setLoading(true);
    try {
      const response = await ApplyUserAdminInfoList(
        decodeURIComponent(id as string)
      );
      if (response.Success) {
 //       console.log("ApplyUserAdminInfoList response", response);
       setUserInfoList(response.data.listdata);
        setLoading(false);
      } else {  
        setUserInfoList([]);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Server is not working", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });
      setLoading(false);
      navigate('/apply-user-admin');
    }
  }
  return (
    <div>
      <ul className="list-group spaced-list">
        {userInfoList.map((customer: IuserInfoModel, index: number) => (
          <li
            key={customer.uiid}
            className={`list-group-item list-group-item-action mb-2
        ${customer.isactive ? 'list-group-item-success' : 'list-group-item-danger'}
        ${selectedUiid === customer.uiid ? 'active' : ''}`}
            onClick={() => onButtonClick(customer.uiid)}
            style={{ cursor: 'pointer' }}
            title={`Date: ${customer.created_date instanceof Date
              ? customer.created_date.toISOString().split('T')[0].replace(/-/g, '/')
              : new Date(customer.created_date).toISOString().split('T')[0].replace(/-/g, '/')}`}
          >
            Token {index + 1}: {customer.uiid.replace(/[^a-zA-Z0-9]/g, '')} 
            
            {/* {customer.created_date instanceof Date
              ? customer.created_date.toISOString().split('T')[0].replace(/-/g, '/')
              : new Date(customer.created_date).toISOString().split('T')[0].replace(/-/g, '/')} */}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default ListOfApplyUserAdmin
