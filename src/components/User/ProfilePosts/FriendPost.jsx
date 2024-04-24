import React, { useState } from 'react';
import Modal from "react-modal";
import moment from 'moment';
import ReactPlayer from 'react-player'
import altusericon from "../../../Icons/user.png"
import Likeicon from "../../../Icons/Notifications.png"
import commentIcon from '../../../Icons/Comment.png';



function FriendPost({ post }) {

    // console.log("porps post 111111",post)
  const isImage = post.file.endsWith(".jpg") || post.file.endsWith(".jpeg") || post.file.endsWith(".png") || post.file.endsWith(".gif");
  const isVideo = post.file.endsWith(".mp4") || post.file.endsWith(".mov") || post.file.endsWith(".avi") || post.file.endsWith(".mkv");


 //TIME
  const getRelativeTime = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  // handle modal 
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  }
  const handleCloseModal = () => {
    setmodalIsOpen(false);
  };


  // show icon love,comment on post top
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
  className="relative aspect-[16/9] w-auto rounded-md md:aspect-auto md:h-400"
  style={{ position: 'relative', overflow: 'hidden' }}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={handleShowmodal}
>
  {isImage && (
    <img
      src={post.file}
      className="z-0 h-full w-full rounded-md object-cover"
      style={{ maxHeight: '250px' }}
      alt=""
    />
  )}
  {isVideo && (
    <ReactPlayer
    controls={true}
      url={post?.file}
      className="z-0 h-full w-full rounded-md object-cover"
      style={{ maxHeight: '250px' ,maxWidth :'333px'}}
      alt=""
    />
  )}
  {isHovered && (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <img src={Likeicon} alt="Love Icon" className="w-6 h-6 cursor-pointer" />
        <p style={{ marginLeft: 5 }}>{post?.likes.length}</p>
        <img src={commentIcon} alt="Comment Icon" className="w-6 h-6 cursor-pointer" />
        <p style={{ marginLeft: 5 }}>{post?.comments.length}</p>
      </div>
    </div>
  )}
</div>

      <Modal style={{ overlay: { backgroundColor: "#2e2b2bc7" } }} isOpen={modalIsOpen} onRequestClose={handleCloseModal} className={"modalclassNameforASavedPost"}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1.3 }} >
            {isImage && (
              <img
                style={{ width: "100%", height: "85vh", objectFit: "cover" }}
                src={post?.file}
                alt=""
              />
            )}
            {isVideo && (
              <ReactPlayer
                controls={true}
                url={post?.file}
                height="85vh"
                width="100%"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div style={{ flex: 1, height: "85vh" }}>
            <div >
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                  <img src={post?.user?.image || altusericon} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ marginBottom: 16 }}>{post?.user?.firstName}</p>
                  </div>
                </div>
                {/* <div >
                  <img src={Moreoptions} alt="" />
                </div> */}
              </div>

              <div className='scrollable-div'>
                <div style={{ display: 'flex', marginLeft: 30 }}>
                  <img src={post?.user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 19 }}>{post?.user?.firstName}</p>
                    <p style={{ marginTop: -3 }}>{post?.caption}</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(post?.createdAt)}</p>
                  </div>
                </div>

                {/* Render comments */}
                {post.comments.map((comment, index) => (
                  <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                    <img src={comment?.user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                    <div style={{ marginLeft: 20 }}>
                      <p style={{ marginTop: 19 }}>{comment?.user?.firstName}</p>
                      <p style={{ marginTop: -3 }}>{comment?.text}</p>
                      <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(comment?.createdAt)}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FriendPost;
