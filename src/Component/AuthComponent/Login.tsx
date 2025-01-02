import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import bookstoreLogo from "../image/login/img3.jpg";
import "./login.css";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../Redux";
import Authcontex from "../../Context/Auth/AuthContext";

const Login = (props: any) => {
    const context = useContext(Authcontex);
    const { LoginFunction } = context;
    const dispatch = useDispatch();
    const action = bindActionCreators(actionCreators, dispatch);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = sessionStorage.getItem("token");
        return token !== null && token !== undefined && token !== "";
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(token !== null && token !== undefined && token !== "");
    }, []);

    const onLogin = async (event: any) => {
        event.preventDefault();
        props.setLoading(true);
        try {
            let formdata = {
                email: email,
                password: password
            }
            const response = await LoginFunction(formdata);
            if (response.status === true) {
                sessionStorage.setItem("token", response.token);
                toast.success('Successfully logged in!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                });
                // Navigate after setting token and updating isLoggedIn state
                setIsLoggedIn(true); // Update isLoggedIn state
                action.Login(true); // Uncomment or adjust if needed
            } else {
                toast.error(response.Message, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000,
                })
            }
        } catch {
            toast.error("Server is not working", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 2000,
            })
        } finally {
            props.setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-box">
                    <img className="logo" src={bookstoreLogo} alt="Bookstore Logo" />
                    <div className="background-image" />
                    <h2 className="welcome-text">Welcome Back!</h2>
                    <form className="login-form" onSubmit={onLogin}>
                        <div className="form-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
