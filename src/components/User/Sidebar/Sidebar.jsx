import React, { useState } from "react";
import { Link, useNavigate ,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clearUserState } from "../../../services/redux/slices/userSlice"
import { clearPostState } from "../../../services/redux/slices/postSlice";
import { clearChatState } from "../../../services/redux/slices/chatSlice";
import { persistor } from "../../../services/redux/store/store";
import { addPost } from "../../../services/redux/slices/postSlice";
import { axiosUserInstance } from "../../../services/axios/axios"
import Modal from "react-modal";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Sidebarr.css";
import altusericon from "../../../Icons/user.png"
import Homeicon from "../../../Icons/home.png";
import CloseIcon from "../../../Icons/closebutton.png";
import SearchIcon from "../../../Icons/Search.png";
import Exploreicon from "../../../Icons/Explore.png";
import Reels from "../../../Icons/Reels.png";
import Messages from "../../../Icons/Messenger.png";
import createicon from "../../../Icons/New post.png";
import More from "../../../Icons/Settings.png";
import Iconsfromcreatemodal from "../../../Icons/Icon to represent media such as images or videos.png";
import InstagramIcon from "../../../Icons/Instagramlogo.png"; //instagram icon
import Instagramicon from "../../../Icons/Instagram.png";//instagram 
import Connectify from "../../../Icons/log.png"//connectify textlogo





function Sidebar() {



  //search area display
  const location = useLocation(); 
  // console.log("location",location)
  const [ShowSearch, setShowSearch] = useState(true);
  const toggleSeachText = () => {
    setShowSearch(!ShowSearch);
  };

  //search functionality
  const [searchUsers, setsearchUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const handleClearButtonClick = () => {
    setSearchTerm('');
  };
  const debounce = (func, delay) => {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const searchUser = debounce(async (term) => {
    try {
      const response = await axiosUserInstance.get(`/search?term=${term}`);
      // console.log("search result", response.data);
      setsearchUsers(response.data)

      // Clear search results after 5 seconds
      const id = setTimeout(() => {
        setsearchUsers([]);
        setSearchTerm('');
      }, 10000);
      setTimeoutId(id);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  }, 300);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    searchUser(value);
  };




  const loggedUser = useSelector(state => state.user.user);
  //for logout
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signOut = () => {
    dispatch(clearUserState());
    dispatch(clearPostState());
    dispatch(clearChatState());
    localStorage.removeItem("token");
    persistor.purge(['user', 'post', 'chat']);
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




  const upload_preset = "yuudjikt";
  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", upload_preset);
      // console.log("Cloudinary data:", {
      //   file: file.name,
      //   upload_preset: upload_preset,
      // });
      // Determine resourceType based on file type
      const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
      const response = await fetch(`https://api.cloudinary.com/v1_1/dvu3hgufk/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        // console.log("Uploaded resource URL:", imageData.secure_url);

        // Upload post data to backend
        const caption = document.querySelector('textarea[name="caption"]').value;
        const postData = {
          caption: caption,
          postUrl: imageData.secure_url,
          userId: loggedUser._id
        };
        // console.log("Post Data****:", postData);
        const backendResponse = await axiosUserInstance.post("/post/createPost", postData);
        // console.log("Created successfully:", backendResponse.data);

        setFormData({ caption: "", file: "" });
        setFile(null); // Reset file state
        setImagePre(null); // Reset image preview state

        dispatch(addPost(backendResponse.data));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Post created successfully",
          showConfirmButton: false,
          timer: 1500
        });
     
        setmodalIsOpen(false);
      } else {
        console.error("Error uploading resource to Cloudinary");
      }
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
                      src={loggedUser?.image || altusericon}
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
                      {loggedUser?.firstName}
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
            <img 
            // src={Instagramicon} 
            src = {Connectify}
            alt="" className="logos" />
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
        <div
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
              <li className="listtext">Search </li>
            </ul>
          )}
        </div>


        {/* exploreicon */}
        <Link
          to={"/Explore"}
          style={{ textDecoration: "none", color: "white" }}
        >
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
                  Explore
                </li>
              </ul>
            )}
          </div>
        </Link>




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
        <Link
          to={"/chat"}
          style={{ textDecoration: "none", color: "white" }}
        >
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
                  Message
                </li>
              </ul>
            )}
          </div>
        </Link>


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
              src={loggedUser?.image || altusericon}
              alt=""
              className="profileicon"
            />
            {ShowSearch && (
              <ul style={{ marginLeft: "20px" }}>
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

 



      {/* search field and results*/}
      {!ShowSearch &&  location.pathname === '/feedhome' &&   (
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
              marginLeft: 13,
              marginTop: 35,
            }}
          >
            Search
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 0,
              marginTop: 30,
              position: "relative"
            }}
          >
            <input
              className="showsearchinput"
              placeholder="Search"
              name="text"
              style={{ paddingLeft: "26px" }}
              value={searchTerm}
              onChange={handleInputChange}
            />
            <img
              src={SearchIcon}
              alt=""
              style={{
                position: "absolute",
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                width: 15,
                height: 15,
                cursor: "pointer"
              }}
            />
            {searchTerm && (
              <img
                src={CloseIcon}
                alt=""
                style={{
                  position: "absolute",
                  right: 47,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
                onClick={handleClearButtonClick}
              />
            )}
          </div>

           {/* serach results display */}
          {(searchTerm && searchUsers.length === 0) 
          ? (
            <p style={{color: "white", marginLeft: 13, marginTop: 35,}}>No results found. </p>
            )  : (
            searchUsers.map(user => (
              <div key={user.userId} style={{ height: "80vh", overflow: "auto", marginTop: 15 }}>
             
                <div style={{display: "flex",alignItems: "center",marginLeft: 10,marginTop: 0,}}>
                <Link to={`/username/${user.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}> 
                  <img src={user.image} style={{width: "40px",objectFit: "cover",height: "40px",borderRadius: "50%",}}alt=""/>
                  </Link>
                  <Link to={`/username/${user.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}> 
                  <div style={{ marginLeft: 10 }}>
                    <p style={{ marginTop: 20, fontSize: 14 }}>{`${user.firstName} ${user.lastName}`}</p>
                    <p style={{ marginTop: -6, color: "#A8A8A8" }}>{user.email}</p>
                  </div>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
    </div >
  )
}

export default Sidebar;
