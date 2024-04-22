import React from 'react'
import { useDispatch } from 'react-redux';
import { addChat } from "../../../services/redux/slices/chatSlice"
import { axiosUserInstance } from "../../../services/axios/axios";
import altusericon from "../../../Icons/user.png"
import "./Conversation.css"





const Conversation = ({ data, currentUserId , online}) => {
  // console.log("follower list is convooooo",data)
  // console.log("loggeduser id",currentUserId)
  const dispatch = useDispatch();
  const handleInitiateChat = async (receiverId) => {
    try {
      const response = await axiosUserInstance.post('/chat/createChat', {
        senderId: currentUserId,
        receiverId: receiverId
      });
      // console.log("Chat created withh id:", response.data);
      dispatch(addChat(response.data))
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };


  return (
    <>
      <div className="follower conversation" onClick={() => handleInitiateChat(data._id)}>
        <div>
        {online && <div className="online-dot"></div>}
          <img
            src={data?.image || altusericon}
            alt=""
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: '0.8rem', marginLeft: '4rem', marginTop: '-3rem' }}>
            <span>{data?.firstName} {data?.lastName}</span>
            {/* <span >{online? "Online" : "Offline"}</span> */}
          </div>
        </div>
      </div>
    </>

  )
}

export default Conversation
