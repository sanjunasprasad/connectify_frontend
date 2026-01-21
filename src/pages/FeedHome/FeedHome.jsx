import React, { useEffect } from "react";
import { useDispatch} from "react-redux";
import "./FeedHome.css";
import  { axiosUserInstance }   from '../../services/axios/axios';
import { setUser } from "../../services/redux/slices/userSlice";
import Sidebar from "../../components/User/Sidebar/Sidebar";
import Rightbar from "../../components/User/Rightbar/Rightbar";

function FeedHome() {
  // const loggedUser = useSelector(state => state.user);
  // console.log("user redux data in feedhome",loggedUser)
  const dispatch = useDispatch();
  useEffect(() => {
       axiosUserInstance 
        .get("/userProfile")
        .then((response) => {
          // console.log("response from fetchprofile in FEEDHOME:",response)
          dispatch(setUser(response.data));
        })
        .catch((err) => {
          console.log(err.response);
        });
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

export default FeedHome;
