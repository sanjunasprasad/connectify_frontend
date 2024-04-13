import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { useSelector} from 'react-redux';
import "./FriendProfile.css";
import { axiosUserInstance } from "../../../services/axios/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import FriendPost from "..//UserProfile/FriendPost";
import Sidebar from "../Sidebar/Sidebar"
import SettingIcon from "../../../Icons/Settingslogo.png"



function FriendProfile() {

const loggeduser = useSelector(state => state.user.user);
const { _id } = loggeduser;
console.log("Logged user ID:", _id);
const {userid} = useParams()
console.log("friend userid",userid)
const [userName,SetName] = useState("")
const [userMail,SetMail]=useState("")
const [userBio,SetBio] =useState("")
const  [userPlace,SetPlace] =useState("")
const [userImage,SetImage] =useState("")
const [postLength,SetLength] =useState(0)
const [posts,SetPosts] = useState([])
const [follower,Setfollower]=useState([])
const [following,SetFollowing] =useState([])
const [isFollowing, setIsFollowing] = useState(false);
useEffect(() => {
  const token = localStorage.getItem("token");
    axiosUserInstance.get(`/friend/userAccount/${userid}`,{
      headers: {
      'Authorization': `Bearer ${token}`,
      'role': 'user'}
  })
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
    try {
      const token = localStorage.getItem("token");
      const response = await axiosUserInstance.post(`/friend/follow/${userid}`,{ loggeduser: _id },{
        headers: {
          'Authorization': `Bearer ${token}`,
          'role': 'user'}
      });
      // console.log("response for follow:",response)
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosUserInstance.post(`/friend/unfollow/${userid}`,{loggeduser:_id},{
        headers: {
          'Authorization': `Bearer ${token}`,
          'role': 'user'}
      });
      // console.log("response for unfollow:",response)
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  // useEffect(()=>{
  //   console.log("current status for relationship:",isFollowing)
  // },[isFollowing])


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
      console.log("reason",reason)
      if (reason) {
        const token = localStorage.getItem("token");
        const response = await axiosUserInstance.post(`/friend/reportProfile/${userid}`, { loggeduser: _id, reason }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': 'user'
          }
        });
        console.log("response for report:", response);
        if(response.status === 200){
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




  return (
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
                  src={userImage}
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
                  { isFollowing ? (
                  <button style={{width:108,height:30,paddingLeft: 10,marginLeft: 20,paddingRight: 20,paddingTop: 4,paddingBottom: 8,borderRadius: 10,border: "none",cursor: "pointer",backgroundColor: "rgb(236, 233 ,233)",color:"black"}} onClick={handleUnfollow}>Unfollow</button>
                  ): (
                    <button style={{width:108,height:30,paddingLeft: 10,marginLeft: 20,paddingRight: 20,paddingTop: 4,paddingBottom: 8,borderRadius: 10,border: "none",cursor: "pointer",backgroundColor: "rgb(236, 233 ,233)",color:"black"}} onClick={handleFollow}>Follow</button>
                  )}
                  <button style={{width:108,height:30,paddingLeft: 10,marginLeft: 20,paddingRight: 20,paddingTop: 4,paddingBottom: 8,borderRadius: 10,border: "none",cursor: "pointer",backgroundColor: "rgb(236, 233 ,233)",color:"black"}}>Message</button>
                  <img src={SettingIcon} style={{ marginLeft: 20, cursor: "pointer" }} alt=""  onClick={handleReportProfile}/>
                </div>

                <div style={{ display: "flex", alignItems: "center" ,paddingTop:10}}>
                  <p style={{ marginLeft: 100 ,paddingTop:6}}>{postLength} Post</p>
                  <p style={{ marginLeft: 40 }}>{follower} Followers</p>
                  <p style={{ marginLeft: 40 }}>{following} Following</p>
                </div>
                <div style={{ alignItems: "center" }}>
                  <p style={{ marginLeft: 100, marginTop: 8 }}>{userMail}</p>
                  <p style={{ marginLeft: 100, marginTop: 8 }}>{userBio}</p>
                  <p style={{ marginLeft: 100, marginTop: 8 }}>{userPlace}</p>
                </div>
              </div>
            </div>


            <div className="postContainerForProfile">
        {posts.map((post, index) => (
          <FriendPost key={index} post={post}   />
        ))}
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default FriendProfile