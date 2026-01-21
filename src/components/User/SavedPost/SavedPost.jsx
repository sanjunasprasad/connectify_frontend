import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import ReactPlayer from 'react-player'
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import "./SavedPost.css"
import { axiosUserInstance } from "../../../services/axios/axios";
import love from "../../../Icons/Notifications2.png"
import comment from "../../../Icons/Comment.png"
import Moreoptions from '../../../Icons/Moreoptions.png'
import altusericon from "../../../Icons/user.png"



function SavedPost({ item }) {


  const isImage = item.file.endsWith(".jpg") || item.file.endsWith(".jpeg") || item.file.endsWith(".png") || item.file.endsWith(".gif");
  const isVideo = item.file.endsWith(".mp4") || item.file.endsWith(".mov") || item.file.endsWith(".avi") || item.file.endsWith(".mkv");

  const loggedUser = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (item) {
      // Simulating asynchronous operation to get _id from item props
      setTimeout(() => {
        setPostId(item._id);
        setLoading(false);
      }, 1000); // Adjust timeout as needed
    }
  }, [item]);

  const getRelativeTime = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  }
  const handleCloseModal = () => {
    setmodalIsOpen(false);
  };





  //UNSAVE POST
  const [postId, setPostId] = useState(null);
  const handleUnSave = async () => {
    try {
      const confirmationResult = await Swal.fire({
        text: 'Do you want to unsave?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      });
      if (confirmationResult.isConfirmed && item) {
        const response = await axiosUserInstance.post('/post/unsavePost', {
          userId: loggedUser._id,
          postId: item._id
        });
        if (response.status === 200) {
          Swal.fire({
            text: 'Post unsaved.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            text: 'Failed to unsave post. Please try again later.',
            icon: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
      Swal.fire({
        text: 'An unexpected error occurred. Please try again later.',
        icon: 'error',
      });
    }
  };
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="containerclass" onClick={handleShowmodal}>
          <div className="imagefor">
            {isImage && (
              <img src={item?.file} className='imageforimage' alt="" />
            )}
            {isVideo && (
              <ReactPlayer
                controls={true}
                url={item?.file}
                height="30vh"
                width="100%"
                style={{ objectFit: "contain" }} 
                />
            )}
            <div className="text">
              <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                <img src={love} className='logoforexplorepost' alt="" />
                <p style={{ marginLeft: 5 }}>{item?.likes.length}</p>
              </div>
              <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                <img src={comment} className='logoforexplorepost' alt="" />
                <p style={{ marginLeft: 5 }}>{item?.comments.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal style={{ overlay: { backgroundColor: "#2e2b2bc7" } }} isOpen={modalIsOpen} onRequestClose={handleCloseModal} className={"modalclassNameforASavedPost"}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1.3 }} >
            {isImage && (
              <img style={{ width: "100%", height: "85vh", objectFit: "cover" }} src={item?.file} alt="" />
            )}
            {isVideo && (
                <ReactPlayer
                  controls={true}
                  url={item?.file}
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
                  <img src={item?.userPhoto} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ marginBottom: 16 }}>{item?.username || altusericon}</p>
                  </div>

                </div>
                <div onClick={handleUnSave}>
                  <img src={Moreoptions} alt="" />
                </div>
              </div>

              <div className='scrollable-div'>
                <div style={{ display: 'flex', marginLeft: 30 }}>
                  <img src={item?.userPhoto || altusericon} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 19 }}>{item?.username}</p>
                    <p style={{ marginTop: -3 }}>{item?.caption}</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(item?.createdAt)}</p>
                  </div>
                </div>

                {/* Render comments */}
                {item.comments.map((comment, index) => (
                  <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                    <img src={comment?.userPhoto || altusericon} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                    <div style={{ marginLeft: 20 }}>
                      <p style={{ marginTop: 19 }}>{comment?.username}</p>
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
  )
}


export default SavedPost