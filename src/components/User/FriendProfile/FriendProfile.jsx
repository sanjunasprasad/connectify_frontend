import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "./FriendProfile.css";
import { axiosUserInstance } from "../../../services/axios/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import FriendPost from "../ProfilePosts/FriendPost";
import Sidebar from "../Sidebar/Sidebar"
import SettingIcon from "../../../Icons/Settingslogo.png"
import altusericon from "../../../Icons/user.png"
import Modal from "react-modal";



function FriendProfile() {

  const loggeduser = useSelector(state => state.user.user);
  const { _id } = loggeduser;
  const { userid } = useParams()
  // console.log("friend userid",userid)
  const [userName, SetName] = useState("")
  const [userMail, SetMail] = useState("")
  const [userBio, SetBio] = useState("")
  const [userPlace, SetPlace] = useState("")
  const [userImage, SetImage] = useState("")
  const [postLength, SetLength] = useState(0)
  const [posts, SetPosts] = useState([])
  const [follower, Setfollower] = useState([])
  const [following, SetFollowing] = useState([])
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    axiosUserInstance.get(`/friend/userAccount/${userid}`)
      .then(response => {
        // console.log("response from backend222222",response)
        SetName(response.data.user.firstName);
        SetMail(response.data.user.email)
        SetBio(response.data.user.bio)
        SetPlace(response.data.user.location)
        SetImage(response.data.user.image)
        SetLength(response.data.posts.length)
        Setfollower(response.data.user.followers.length)
        SetFollowing(response.data.user.following.length)
        setIsFollowing(response.data.user.followers.includes(_id));
        SetPosts(response.data.posts);
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, [userid]);

  //FOLLOW + UNFOLLOW
  const handleFollow = async () => {
    if (_id) {
      try {
        const response = await axiosUserInstance.post(`/friend/follow/${userid}`, { loggeduser: _id });
        // console.log("response for follow:",response)
        setIsFollowing(true);
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
  };

  const handleUnfollow = async () => {
    if (_id) {
      try {
        const response = await axiosUserInstance.post(`/friend/unfollow/${userid}`, { loggeduser: _id });
        // console.log("response for unfollow:",response)
        setIsFollowing(false);
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    }
  };




  const handleReportProfile = async () => {
    try {
      const { value: reason } = await Swal.fire({
        title: "Report profile?",
        input: "select",
        inputOptions: {
          "Its spam": "It's spam",
          "Hate speech or symbols": "Hate speech or symbols",
          "False information": "False information",
          "Supports violence": "Supports violence"
        },
        inputPlaceholder: "Select reason",
        showCancelButton: true,
      });
      console.log("reason", reason)
      if (reason) {
        const response = await axiosUserInstance.post(`/friend/reportProfile/${userid}`, { loggeduser: _id, reason });
        console.log("response for report:", response);
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Profile reported successfully",
            showConfirmButton: false,
            timer: 1500
          });
        }

      }
    } catch (error) {
      console.error('Error reporting profile:', error);
      if (error.response && error.response.status === 400) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Profile already reported",
          showConfirmButton: false,
          timer: 1500
        });
      }
    };
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
        const endpoint = modalType === 'followers' ? `/friend/fetchFollowers/${userid}` : `/friend/fetchFollowings/${userid}`;
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
  }, [modalOpen, modalType, userid]);



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
                    src={userImage || altusericon}
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
                    <p style={{ marginLeft: 100, fontWeight: 1000 }}>{userName}</p>
                    {isFollowing ? (
                      <button style={{ width: 108, height: 30, paddingLeft: 10, marginLeft: 20, paddingRight: 20, paddingTop: 4, paddingBottom: 8, borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: "rgb(236, 233 ,233)", color: "black" }} onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                      <button style={{ width: 108, height: 30, paddingLeft: 10, marginLeft: 20, paddingRight: 20, paddingTop: 4, paddingBottom: 8, borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: "rgb(236, 233 ,233)", color: "black" }} onClick={handleFollow}>Follow</button>
                    )}
                    <button style={{ width: 108, height: 30, paddingLeft: 10, marginLeft: 20, paddingRight: 20, paddingTop: 4, paddingBottom: 8, borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: "rgb(236, 233 ,233)", color: "black" }}>Message</button>
                    <img src={SettingIcon} style={{ marginLeft: 20, cursor: "pointer" }} alt="" onClick={handleReportProfile} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", paddingTop: 10 }}>
                    <p style={{ marginLeft: 100, paddingTop: 6 }}>{postLength} Post</p>
                    <p style={{ marginLeft: 40 }} onClick={() => displayModal('followers')}>{follower} Followers</p>
                    <p style={{ marginLeft: 40 }} onClick={() => displayModal('followings')}>{following} Following</p>
                  </div>
                  <div style={{ alignItems: "center" }}>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{userMail}</p>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{userBio}</p>
                    <p style={{ marginLeft: 100, marginTop: 8 }}>{userPlace}</p>
                  </div>
                </div>
              </div>


              <div className="postContainerForProfile">
                {postLength === 0 ? (
                  <div style={{ textAlign: "center", marginTop: "120px", marginLeft: '5rem' }}>
                    <p style={{ fontWeight: "bold", fontSize: "2.2em" }}>No posts yet</p>
                  </div>
                ) : (

                  posts.map((post, index) => (
                    <FriendPost key={index} post={post} />
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


export default FriendProfile