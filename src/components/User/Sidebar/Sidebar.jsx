import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from 'react-redux';
import { axiosUserInstance }  from "../../../services/axios/axios";
import {clearUser} from "../../../services/redux/slices/userSlice"
import { addPost } from "../../../services/redux/slices/postSlice";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./sidebar.css";
import Homeicon from "../../../Icons/home.png";
import SearchIcon from "../../../Icons/Search.png";
import Exploreicon from "../../../Icons/Explore.png";
import Reels from "../../../Icons/Reels.png";
import Messages from "../../../Icons/Messenger.png";
import createicon from "../../../Icons/New post.png";
import Instragramicon from "../../../Icons/Instagram.png";
import More from "../../../Icons/Settings.png";
import Iconsfromcreatemodal from "../../../Icons/Icon to represent media such as images or videos.png";
import InstagramIcon from "../../../Icons/Instagramlogo.png"; //instagram logotext
import { Profiledata } from "../data";

function Sidebar() {

  
  const loggedUser = useSelector(state => state.user.user);
 
  //for logout
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signOut = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Logged out successfully",
    });
  };

  //search
  const [ShowSearch, setShowSearch] = useState(true);
  const toggleSeachText = () => {
    setShowSearch(!ShowSearch);
  };

  //modal
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  };
  //file selection
  const [file, setFile] = useState(null);
  const [imagepre, setImagePre] = useState(null);

  // Form input change
  const [formData, setFormData] = useState({ caption: "", file: "" });
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.files && e.target.files.length > 0) { 
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile.type.startsWith('video/')) {
            setImagePre(URL.createObjectURL(selectedFile));
        } else {
            setImagePre(URL.createObjectURL(selectedFile));
        }
    }
};




  // Create post
  const handleCreatePost = async () => {
    try {
      console.log("creation iam called")
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const caption = document.querySelector('textarea[name="caption"]').value;
      formData.append("caption", caption);
      formData.append("file", file);
      formData.append("user", JSON.stringify(loggedUser));
      console.log("Post Data:", {
        caption: caption,
        file: file.name,
        fileSize: file.size,
        fileType: file.type,
        userData: loggedUser,
      });
      console.log("my type:", typeof formData);
      axiosUserInstance 
        .post("/post/createPost", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            role : 'user'
          },
        })
        .then((response) => {
          console.log("created succesffully",response.data);
          dispatch(addPost(response.data));
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Post created successfully",
            showConfirmButton: false,
            timer: 1500
          });
           
          
        })
        .catch((error) => {
          console.error(error);
        });
      setFormData({ caption: "", file: "" });
      setmodalIsOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="mainsidebar">
     <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        style={{ overlay: { backgroundColor: "#2e2b2bc7" } }}
        className={"modalclassNameforAPost"}
      >
        
        <div style={{ flex: 1, height: "70vh" }}>
          {imagepre == null ? (
            <div>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                  justifyContent: "center",
                  fontWeight: 600,
                  marginTop: -10,
                }}
              >
                Create new post
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                  justifyContent: "center",
                  marginTop: -10,
                }}
              >
                <div style={{ marginTop: 240, marginLeft: 100 }}>
                  <img
                    src={Iconsfromcreatemodal}
                    style={{ marginLeft: 30 }}
                    alt=""
                  />
                  <p
                    style={{
                      fontWeight: "600",
                      marginLeft: "-40px",
                      fontSize: 18,
                    }}
                  >
                    Drag photos and videos here
                  </p>
                  <label htmlFor="file">
                    <div
                      style={{
                        backgroundColor: "#0095F6",
                        paddingLeft: 25,
                        marginLeft: -20,
                        borderRadius: 4,
                      }}
                    >
                      <p style={{ paddingTop: "6px", paddingBottom: "7px" }}>
                        Select from computer
                      </p>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept="image/*,video/*"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex" }}>
                {file.type.startsWith('video/') ? (
                  <video
                    src={imagepre}
                    style={{ width: "60%", height: "60vh", objectFit: "cover" }}
                    controls
                  />
                ) : (
                  <img
                    src={imagepre}
                    style={{ width: "60%", height: "60vh", objectFit: "cover" }}
                    alt=""
                  />
                )}
                <div style={{ marginLeft: 20, width: "40%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={loggedUser.image}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt=""
                    />
                    <p
                      style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}
                    >
                      {loggedUser.firstName}
                    </p>
                  </div>
                  <textarea
                    type="text"
                    name="caption"
                    value={formData.caption}
                    onChange={handleChange}
                    placeholder="Write a caption for post"
                    className="textinputforpost"
                  />
                  <button className="createpost" onClick={handleCreatePost}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div>
        {/* logotext on sidebar */}
        <div style={{ display: "flex", marginTop: "45px", marginLeft: "20px" }}>
          {ShowSearch === false ? (
            <img src={InstagramIcon} alt="" className="logos" />
          ) : (
            <img src={Instragramicon} alt="" className="logos" />
          )}
        </div>

        {/* sidebar items */}
        {/* homeicon */}
        <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              cursor: "pointer",
              marginLeft: "20px",
            }}
          >
            <img src={Homeicon} alt="" className="logos" />
            {ShowSearch && (
              <ul style={{ marginLeft: "20px" }}>
                <li className="listtext"> Home </li>
              </ul>
            )}
          </div>
        </Link>


        {/* searchicon */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={toggleSeachText}
        >
          <img src={SearchIcon} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext"> </li>    
            </ul>
          )}
        </div> */}


        {/* exploreicon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          <img src={Exploreicon} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext">
                <Link
                  to={"/Explore"}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Explore
                </Link>
              </li>
            </ul>
          )}
        </div>



        {/* savedicon */}
        <Link to={"/savedpost"} style={{ textDecoration: "none", color: "white" }}> 
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          <img src={Reels} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext"> Saved</li>
            </ul>
          )}
        </div>
        </Link>


        {/* messageicon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          <img src={Messages} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext">
              <Link
                  to={"/chat"}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Message
                </Link>
              </li>
            </ul>
          )}
        </div>



        {/* notification icon */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          <img src={Notifications} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext"> Notifications</li>
            </ul>
          )}
        </div> */}
 


        {/* create post icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={handleShowmodal}
        >
          <img src={createicon} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext">Create</li>
            </ul>
          )}
        </div>

          {/* profile icon */}
        <Link to={"/username"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              marginLeft: "20px",
              cursor: "pointer",
            }}
          >
            <img
              src={loggedUser?.image}
              alt=""
              className="profileicon"
            />
            {ShowSearch && (
              <ul style={{ marginLeft: "20px" }}>
                {/* <li className="listtext"> {loggedUser.firstName}</li> */}
                <li className="listtext"> Profile</li>
              </ul>
            )}
          </div>
        </Link>

          {/* logout icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={signOut}
        >
          <img src={More} alt="" className="logos" />
          {ShowSearch && (
            <ul style={{ marginLeft: "20px" }}>
              <li className="listtext">Logout</li>
            </ul>
          )}
        </div>
      </div>

        {/* search result */}
      {!ShowSearch && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
            marginLeft: 35,
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: 27,
              marginLeft: 10,
              marginTop: 35,
            }}
          >
            Search
          </p>
          <div
            style={{ display: "flex", alignContent: "center", marginLeft: 10 }}
          >
            <img
              src={SearchIcon}
              style={{ width: 15, height: 15, marginTop: 0 }}
              alt=""
            />
            <input
              className="showsearchinput"
              placeholder="Search"
              name="text"
            />
          </div>
          <p style={{ marginLeft: 10, fontWeight: 600, fontSize: 17 }}>
            Recent
          </p>
          <div style={{ height: "80vh", overflow: "auto" }}>
            {Profiledata?.map((item) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                  marginTop: -25,
                }}
              >
                <img
                  src={item.profile}
                  style={{
                    width: "40px",
                    objectFit: "cover",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                  alt=""
                />
                <div style={{ marginLeft: 10 }}>
                  <p style={{ marginTop: 20, fontSize: 14 }}>{item.name}</p>
                  <p style={{ marginTop: -12, color: "#A8A8A8" }}>
                    {item.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
