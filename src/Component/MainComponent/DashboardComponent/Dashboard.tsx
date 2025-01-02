import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../PageTitle/PageTitle';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = PageTitle.Dashboard;
        const token = sessionStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
        } else {
            navigate('/login');
        }
    }, []); // Empty dependency array ensures this runs only on mount

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard
