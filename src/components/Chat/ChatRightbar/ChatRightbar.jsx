import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./ChatRightbar.css"
import { axiosUserInstance } from "../../../services/axios/axios";
import Conversation from "../../../components/Chat/Conversation/Conversation"
import ChatBox from "../../../components/Chat/ChatBox/ChatBox"
import { apiURl } from "../../../utils/constants";
console.log("000",apiURl)



function ChatRightbar() {

  const socket = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [followersAndFollowing, setFollowersAndFollowing] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const user = useSelector(state => state.user.user);
  const { _id } = user
    // console.log("logged user in main rightbar",user)
  // console.log("1)loggeduser id in chatrightbar:", _id)

//get followers+following
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(_id){
      const fetchFollowersAndFollowing = async () => {
        try {
          const response = await axiosUserInstance.get(`/friend/getfollowersandfollowing/${_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'role': 'user'
            }
          });
          // console.log("follower and following is 99999999:",response.data)
          const { followers, following } = response.data;
          const mergedUsers = [...followers, ...following.filter(user => !followers.find(follower => follower._id === user._id))];
          setFollowersAndFollowing(mergedUsers);
        } catch (error) {
          console.error('Error fetching followers and following:', error);
        }
      };
      fetchFollowersAndFollowing();
    }
   
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    // Use the same API URL from constants (supports both http://localhost:8000 and https://backend.onrender.com)
    socket.current = io(apiURl);

    
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
      // console.log("online users is", onlineUsers)
    });
  }, [user]);


  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);




  //recived message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      // console.log(data)
      setReceivedMessage(data);
    }
    );
  }, []);


  //check online status
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };



  return (
    <div className='mainchatrightbar'>

      {/* leftside  */}
      <div className="Left-side-chat">
        <h1 style={{ marginLeft: '95px', fontWeight: 'bold', marginTop: '42px', fontSize: '20px' }}>Messages</h1>
        <div className="Chat-list">
        {followersAndFollowing.map((frienduser) => (
          <div 
            onClick={() => { setCurrentChat(frienduser) }}
            key={frienduser._id}
          >
            <Conversation data={frienduser} currentUserId={user._id} online={onlineUsers} />
          </div>
        ))}
        </div>
      </div>



      <div className="vertical-line"></div>

      {/* rightside */}
      <div className="Right-side-chat">
        <ChatBox
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  )
}

export default ChatRightbar
