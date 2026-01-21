import React,{useState,useEffect,useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 } from 'uuid'




const ZegoVcall = () => {
    const { userId, id } = useParams();
    // console.log("user id",userId)
    // console.log("friend id",id)
    const navigate = useNavigate();
    const VURL = 'http://localhost:8000'
    // const VURL = 'https://connectify-omega-mauve.vercel.app'
    const videoCallLink = `${VURL}/meeting/${userId}/${id}`;

    useEffect(() => {
      localStorage.setItem('videoCallLink', videoCallLink);
      // console.log("LINK saved in localstorage == directed link ",videoCallLink);
  }, []); 


  const myMeeting = async (element) => {
    const appID = 83966156;
    const serverSecret = "43d263e07f17a47e86ebe94aaac1cb9f";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      userId,
      Date.now().toString(),
      v4()
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom: () => {
        localStorage.removeItem('videoCallLink'); 
        navigate(`/chat`);
      },
      
    });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full h-full" ref={myMeeting} />
    </div>
  );
};

export default ZegoVcall;