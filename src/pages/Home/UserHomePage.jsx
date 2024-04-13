import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import  { axiosUserInstance }   from '../../services/axios/axios';
import { setUser } from "../../services/redux/slices/userSlice";
import Sidebar from "../../components/User/Sidebar/Sidebar";
import Rightbar from "../../components/User/Rightbar/Rightbar";

function UserHomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token1 = useSelector(state => state.user.token);
    // console.log("Token from Redux store userhome:", token1);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // console.log("token fom localstorage in userhome after login:",token)
    if (!token1) {
      navigate("/");
    } else {
       axiosUserInstance 
        .get("/userProfile", {
          headers: {
            Authorization: `Bearer ${token1}`,
            role : 'user'
          },
        })
        .then((response) => {
          // console.log("response from fetchprofile in homepage:",response)
          dispatch(setUser(response.data));
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  },[]);

  return (
    <div>
      <div className="homesubcontainer">
        <div className="homesidebar">
          <Sidebar />
        </div>
        <div className="homerightbar">
          <Rightbar />
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;
