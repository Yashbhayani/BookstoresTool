import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bookstoreLogo from "../image/login/img3.jpg";
import "./login.css";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../Redux";
import Authcontex from "../../Context/Auth/AuthContext";
import {
  IP_API_BASE_URL,
  IP_API_FIELDS,
  IPv4address,
  IPv6address,
} from "../../Context/API/ApiRouter";
import { IpLookupResult } from "../../models/model";
import { UAParser } from "ua-parser-js";

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

  // ✅ Store IP/device details in state so we fetch once at page load
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [ipDetails, setIpDetails] = useState<any>(null);

  // Fetch IP details on page load
  useEffect(() => {
    const fetchIpData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(token !== null && token !== undefined && token !== "");

        const v4 = await getIpv4address();
        const v6 = await getIpv6address();
        setIpv4(v4);
        setIpv6(v6);

        if (v4) {
          const details = await getIpAddresswithdata(v4);
          setIpDetails(details);
        }
      } catch (error) {
        console.error("Error fetching IP data on load:", error);
      }
    };

    fetchIpData();
  }, []);

  const onLogin = async (event: any) => {
    event.preventDefault();
    props.setLoading(true);

    try {
      const parser = new UAParser();
      const uaResult = parser.getResult();

      let formdata: IpLookupResult = {
        email: email,
        password: password,
        ip4address: ipv4 || "",
        ip6address: ipv6 || "",
        browser: uaResult.browser.name || "Unknown",
        os: uaResult.os.name || "Unknown",
        deviceType: uaResult.device.type || "Desktop",

        // add IP info fields (already prefetched)
        status: ipDetails?.status,
        country: ipDetails?.country,
        countryCode: ipDetails?.countryCode,
        region: ipDetails?.region,
        regionName: ipDetails?.regionName,
        city: ipDetails?.city,
        zip: ipDetails?.zip,
        lat: ipDetails?.lat,
        lon: ipDetails?.lon,
        timezone: ipDetails?.timezone,
        isp: ipDetails?.isp,
        org: ipDetails?.org,
        asn: ipDetails?.as,
        query: ipDetails?.query,
      };

      console.log("Login Data:", formdata);

      const response = await LoginFunction(formdata);
      if (response.status === true) {
        sessionStorage.setItem("token", response.token);
        toast.success("Successfully logged in!", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
          duration: 2000,
        });

        setIsLoggedIn(true);
        action.Login(true);
      } else {
        toast.error(response.Message, {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
          duration: 2000,
        });
      }
    } catch {
      toast.error("Server is not working", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        duration: 2000,
      });
    } finally {
      props.setLoading(false);
    }
  };

  const getIpv4address = async () => {
    try {
      const response = await fetch(IPv4address);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IPv4:", error);
    }
  };

  const getIpv6address = async () => {
    try {
      const response = await fetch(IPv6address);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IPv6:", error);
    }
  };

  const getIpAddresswithdata = async (ip: any) => {
    try {
      const url = `${IP_API_BASE_URL}/${ip}?fields=${IP_API_FIELDS}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "success") {
        console.log("IP Address Data:", data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching IP details:", error);
    }
  };

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
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
