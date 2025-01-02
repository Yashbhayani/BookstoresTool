import React, { useContext, useEffect, useState } from 'react'
import './home.css';
import toast from 'react-hot-toast';
import Homecontex from '../../../Context/Home/HomeContext';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../PageTitle/PageTitle';

const Home = (props: any) => {
    const context = useContext(Homecontex);
    const { DashboardFunction } = context;
    const [TotalAverageReview, setTotalAverageReview] = useState(0);
    const [TotalBook, setTotalBook] = useState(0);
    const [TotalLike, setTotalLike] = useState(0);
    const [TotalUser, setTotalUser] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        props.setLoading(true);
        document.title = PageTitle.HomePage;
        const token = sessionStorage.getItem("token");
        if (token) {
            CallDashboard();
        } else {
            props.setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const CallDashboard = async () => {
        props.setLoading(true);
        try {
            const response = await DashboardFunction();
            if (response.Success === true) {
                setTotalAverageReview(response.data[0].totalAverageReview);
                setTotalBook(response.data[0].totalBook);
                setTotalLike(response.data[0].totalLike);
                setTotalUser(response.data[0].totalUser);
                props.setLoading(false);
            } else {
                toast.error("Invalid User", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
                props.setLoading(false);
            }
        } catch {
            toast.error("Server is not working", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            });
            props.setLoading(false);
        }
    };


    return (
        <div>
            <div className="row g-3">
                <div className="col">
                    <div className="card" style={{ width: '15rem', height: '10rem', backgroundColor: '#ff9999', margin: '10px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h1 className="card-title">{TotalUser}</h1>
                            <h4 className="card-subtitle mb-2 text-muted">Users</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card" style={{ width: '15rem', height: '10rem', backgroundColor: '#99ff99', margin: '10px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h1 className="card-title">{TotalBook}</h1>
                            <h4 className="card-subtitle mb-2 text-muted">Books</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card" style={{ width: '15rem', height: '10rem', backgroundColor: '#9999ff', margin: '10px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h1 className="card-title">{TotalLike}</h1>
                            <h4 className="card-subtitle mb-2 text-muted">Likes</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card" style={{ width: '15rem', height: '10rem', backgroundColor: '#ffff99', margin: '10px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h1 className="card-title">{TotalAverageReview}</h1>
                            <h4 className="card-subtitle mb-2 text-muted">Review</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home