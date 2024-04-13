import React from 'react'
import {  useDispatch,useSelector } from 'react-redux';
import { Link,useNavigate } from "react-router-dom";
import {clearUser} from "../../../services/redux/slices/userSlice"
import "./Chatsidebar.css"
import Homeicon from "../../../Icons/home.png";
// import SearchIcon from "../../../Icons/Search.png";
// import Notifications from "../../../Icons/Notifications.png";
import Exploreicon from "../../../Icons/Explore.png";
import Messages from "../../../Icons/Messenger.png";
import createicon from "../../../Icons/New post.png";
import More from "../../../Icons/Settings.png";
import InstagramIcon from "../../../Icons/Instagramlogo.png"; 


function Chatsidebar() {

  const navigate = useNavigate();
  const dispatch =useDispatch()
  const signOut = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  const user = useSelector(state => state.user.user);
  const { image } = user
    // console.log("logged userimage in sidebar",image)


  return (
    <div className='chatmainsidebar'>
      <div>

   
      <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", marginTop: "50px" , cursor:'pointer', marginLeft: "20px" }}>
        <img src={InstagramIcon} className="logos" alt=""/>
      </div>
      </Link>


      <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", marginTop: "70px" , cursor:'pointer', marginLeft: "20px" }}>
        <img src={Homeicon} className="logos" alt=""/>
      </div>
      </Link>

      {/* <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      <img src={SearchIcon} className="logos" alt=""/>
      </div> */}


      <Link to={"/Explore"} style={{ textDecoration: "none", color: "white" }}>  
      <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      <img src={Exploreicon} className="logos" alt="" /> 
      </div>
      </Link>

     
      <Link to={"/chat"} style={{ textDecoration: "none", color: "white" }}>  
      <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      <img src={Messages} className="logos" alt="" />   
      </div>
      </Link>

      {/* <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      <img src={Notifications}className="logos" alt="" />
      </div> */}

      <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      <img src={createicon}  className="logos"alt=""/>
      </div>


      <Link to={"/username"} style={{ textDecoration: "none", color: "white" }}>  
      <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}>
      {image && <img src={image} alt='' className='profileicon' /> }
      </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", marginTop: "40px" , cursor:'pointer', marginLeft: "20px" }}   onClick={signOut}>
        <img src={More} alt='' className='logos' /> 
      </div>

  </div>
</div>
  )
}

export default Chatsidebar
