import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { clearUserState } from "../../services/redux/slices/userSlice"
import { clearPostState } from "../../services/redux/slices/postSlice";
import { clearChatState } from "../../services/redux/slices/chatSlice";
import { persistor } from "../../services/redux/store/store";
import { setUser } from "../../services/redux/slices/userSlice";
import { axiosUserInstance } from "../../services/axios/axios";
import "./Profilee.css";
import Modal from "react-modal";
import OwnPost from "../../components/User/ProfilePosts/OwnPost"
import Sidebar from "../../components/User/Sidebar/Sidebar";
import SettingIcon from "../../Icons/Settingslogo.png";
import altusericon from "../../Icons/user.png"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'



export default function Profile() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector(state => state.user.user);
  const { _id } = loggedUser




  // to get post length
  const [showPosts, setShowPosts] = useState([]);
  const [postLength, setLength] = useState(0);
  useEffect(() => {
    axiosUserInstance
      .get('/post/loadownPost', { params: { userId: _id } })
      .then((response) => {
        // console.log("post length response", response.data)
        setShowPosts(response.data);
        setLength(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, [loggedUser._id]);




  //profile edit
  const [formData, setFormData] = useState({
    firstName: loggedUser?.firstName || '',
    email: loggedUser?.email || '',
    bio: loggedUser?.bio || '',
    location: loggedUser?.location || '',
    image: loggedUser?.image || null
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };





  //fill with already available data
  useEffect(() => {
    setFormData({
      firstName: loggedUser?.firstName || '',
      email: loggedUser?.email || '',
    });
  }, [loggedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
    setFormData({ ...formData, image: URL.createObjectURL(image) });
  }

  //form validate function
  const nameRegex = /^[A-Za-z]+$/;
  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName) {
      errors.firstName = "First Name cannot be empty";
    } else if (!nameRegex.test(data.firstName)) {
      errors.firstName = "First Name must only contain alphabets";
    }
    if (!data.email) {
      errors.email = "Please provide an email";
    }

    if (!data.bio) {
      errors.bio = "Please provide bio min 6 max 20 characters";
    }

    if (!data.location) {
      errors.location = "Please provide valid location"
    }
    return errors;
  };






  //form submission
  const upload_preset = "yuudjikt";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const bio = document.querySelector('textarea[name="bio"]').value;
      const firstName = document.querySelector('input[name="firstName"]').value;
      const email = document.querySelector('input[name="email"]').value;
      const location = document.querySelector('input[name="location"]').value;
      const fileInput = document.querySelector('input[name="file"]');
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", upload_preset);
      // console.log("Cloudinary data:", {
      //   file: file.name,
      //   upload_preset: upload_preset,
      // });

      const response = await fetch(`https://api.cloudinary.com/v1_1/dvu3hgufk/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        console.log("Uploaded resource URL:", imageData.secure_url);
        const profileDataToSend = {
          ...loggedUser,
          firstName: firstName,
          email: email,
          bio: bio,
          location: location,
          image: imageData.secure_url
        }

        const backendResponse = await axiosUserInstance.put(`/updateUser/${loggedUser._id}`, profileDataToSend);
        setFormData({});
        setImage(null);
        setShowModal(false);
        if (backendResponse.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Profile updated successfully",
            showConfirmButton: false,
            timer: 1500
          });
          console.log("User profile updated successfully:", backendResponse.data);
          dispatch(setUser(backendResponse.data.user));

        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  //to delete user
  const deleteUser = async () => {
    console.log("deleteUser function called");
    // console.log("kiran id is", _id)
    try {

      const result = await Swal.fire({
        title: "Are you sure to delete account?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        console.log("kiran id is", _id)
        const response = await axiosUserInstance.delete(`/DeleteUser/${_id}`);
        // console.log("delete response", response)
        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success"
          }).then(() => {
            dispatch(clearUserState());
            dispatch(clearPostState());
            dispatch(clearChatState());
            localStorage.removeItem("token");
            persistor.purge(['user', 'post', 'chat']);
            navigate("/");
          })
        }
        else {
          alert(response.data.message);
        }
      }
      else {
        // Handle the cancel action here
        Swal.fire({
          title: "Cancelled",
          text: "The action has been cancelled.",
          icon: "info"
        });
      }
    } catch (err) {
      console.log(err);
    }
  }


  // SHOW FOLLOWINGS,FOLLOWERS
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [Followers, setFollowers] = useState([]);
  const [Following, setFollowing] = useState([]);

  const displayModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = modalType === 'followers' ? `/friend/fetchFollowers/${loggedUser._id}` : `/friend/fetchFollowings/${loggedUser._id}`;
        const response = await axiosUserInstance.get(endpoint);
        // console.log("response",response)
        if (response.status === 200) {
          if (modalType === 'followers') {
            setFollowers(response.data.followers);
          } else {
            setFollowing(response.data.following);
          }
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    if (modalOpen) {
      fetchData();
    }
  }, [modalOpen, modalType, loggedUser._id]);



  return (
    <>
      <div>
        <div>
          <div className="homesubcontainer">
            <div className="homesidebar">
              <Sidebar />
            </div>

            {/* rightside accountprofile */}
            <div className="Profilerightbar">
              <div className="subProfilerightbar">
                <div>
                  <img
                    src={loggedUser?.image || altusericon}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    alt=""
                  />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ marginLeft: 100, fontWeight: 1000 }}>{loggedUser?.firstName}</p>
                    <button style={{ width: 109, height: 30, paddingLeft: 10, marginLeft: 20, paddingRight: 20, paddingTop: 4, paddingBottom: 8, borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: "rgb(236, 233 ,233)", color: "black" }} onClick={handleShowModal}>Edit Profile</button>
                    {showModal && (
                      <div className="modal-overlay">
                        <div className="modalclass">
                          <span className="close" onClick={handleCloseModal}>
                            &times;
                          </span>
                          <h2>Edit Profile</h2>
                          <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                            <div className="inputfieldsclass">
                              <label
                                htmlFor="username"
                                style={{ color: "white" }}
                              >
                                Username:
                              </label>
                              <input
                                type="text"
                                placeholder="Name"
                                value={formData?.firstName}
                                name="firstName"
                                onChange={handleInputChange}
                              />
                              {errors.firstName && (
                                <p className="error-message text-red-500">{errors.firstName}</p>
                              )}
                            </div>

                            <div className="inputfieldsclass">
                              <label htmlFor="email" style={{ color: "white" }}>
                                Email:
                              </label>
                              <input
                                type="email"
                                placeholder="Email"
                                value={formData?.email}
                                name="email"
                                onChange={handleInputChange}
                              />
                              {errors.email && (
                                <p className="error-message text-red-500">{errors.email}</p>
                              )}
                            </div>

                            <div className="inputfieldsclass">
                              <label htmlFor="bio" style={{ color: "white" }}>
                                Description bio:
                              </label>
                              <textarea
                                type="text"
                                placeholder="User bio"
                                value={formData?.bio}
                                name="bio"
                                onChange={handleInputChange}
                              ></textarea>
                              {errors.bio && (
                                <p className="error-message text-red-500">{errors.bio}</p>
                              )}
                            </div>

                            <div className="inputfieldsclass">
                              <label
                                htmlFor="location"
                                style={{ color: "white" }}
                              >
                                Location:
                              </label>
                              <input
                                type="text"
                                placeholder="Location"
                                value={formData?.location}
                                name="location"
                                onChange={handleInputChange}
                              />
                              {errors.location && (
                                <p className="error-message text-red-500">{errors.location}</p>
                              )}
                            </div>

                            <div className="inputfieldsclass">
                              <label
                                htmlFor="fileInput"
                                style={{ color: "white" }}
                              >
                                {image ? "Choose another pic" : "Select a new profile Photo:"}
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                name="file"
                                id="fileInput"
                                onChange={handleImageChange}
                                style={{ color: "white" }}
                              />
                            </div>

                            <div  >
                              Selected File: {formData?.image ? <img src={formData?.image} alt={formData?.image}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                }} /> : 'No file selected'}

                            </div>
                            <button type="submit">Update</button>
                          </form>
                        </div>
                      </div>
                    )}

                    <img src={SettingIcon} style={{ marginLeft: 20, cursor: "pointer" }} alt="" onClick={deleteUser} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", paddingTop: 10 }}>
                    <p style={{ marginLeft: 100, paddingTop: 6 }}>{postLength} Post</p>
                    <p style={{ marginLeft: 40, cursor: "pointer", }} onClick={() => displayModal('followers')}>{loggedUser?.followers?.length} Followers</p>
                    <p style={{ marginLeft: 40, cursor: "pointer", }} onClick={() => displayModal('followings')}>{loggedUser?.following?.length} Following</p>
                  </div>
                  <div style={{ alignItems: "center" }}>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{loggedUser?.email}</p>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{loggedUser?.bio}</p>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{loggedUser?.location}</p>

                  </div>
                </div>
              </div>


              <div className="postContainerForProfile">
                {postLength === 0 ? (
                  <div style={{ textAlign: "center", marginTop: "120px" }}>
                    <p style={{ fontWeight: "bold", fontSize: "2.2em" }}>Share photos</p>
                    <p>When you share photos, they will appear on your profile.</p>
                  </div>
                ) : (
                  showPosts.map((post) => (
                    <OwnPost key={post._id} post={post} loggedUser={loggedUser} />
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* modal for showing followers and followings */}
      <Modal
        style={{ overlay: { backgroundColor: "#2e2b2bc7" } }}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modalforListpeople"
      >
        <div className='scrollable-likeddiv'>
          <p style={{ marginTop: 0, marginLeft: 33 }}>{modalType === 'followers' ? 'Followers' : 'Followings'}</p>
          <hr />
          {modalType === 'followers' ? (
            Followers.map((user, index) => (
              <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                <Link to={`/username/${user._id}`} ><img src={user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', marginTop: 35 }} alt="User" /></Link>
                <div style={{ marginLeft: 20 }}>
                  <p style={{ marginTop: 30 }}>{user?.firstName}</p>
                  <p style={{ color: '#A8A8A8', marginTop: -4 }}>{user?.lastName}</p>
                </div>
              </div>
            ))
          ) : (
            Following.map((user, index) => (
              <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                <Link to={`/username/${user._id}`} ><img src={user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', marginTop: 35 }} alt="User" /></Link>
                <div style={{ marginLeft: 20 }}>
                  <p style={{ marginTop: 30 }}>{user?.firstName}</p>
                  <p style={{ color: '#A8A8A8', marginTop: -4 }}>{user?.lastName}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

    </>
  );
}
