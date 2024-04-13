import React, {  useState } from 'react';
import {  useDispatch } from 'react-redux';
import { setPosts } from "../../../services/redux/slices/postSlice"
import Modal from "react-modal";
import moment from 'moment';
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import ReactPlayer from 'react-player'
import { axiosUserInstance } from '../../../services/axios/axios';
import comment from '../../../Icons/Comment.png';
import commentIcon from '../../../Icons/Comment.png';
import Moreoptions from "../../../Icons/Moreoptions.png"
import Saveicon from "../../../Icons/Save.png"
import Likeicon from "../../../Icons/Notifications.png"




function OwnPost({ post }) {

  const dispatch = useDispatch();
  const isImage = post.file.endsWith(".jpg") || post.file.endsWith(".jpeg") || post.file.endsWith(".png") || post.file.endsWith(".gif");
  const isVideo = post.file.endsWith(".mp4") || post.file.endsWith(".mov") || post.file.endsWith(".avi") || post.file.endsWith(".mkv");
  // show icon love,comment on post top
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // time
  const getRelativeTime = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  // modal display for post
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [Like, SetLike] = useState(Likeicon);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  }
  const handleCloseModal = () => {
    setmodalIsOpen(false);
  };


  //handle edit+delete 
  const handleDivClick = async (postId, caption, postimage) => {
    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          delete: "Delete post",
          edit: "Edit post"
        });
      }, 1000);
    });
    const { value: option } = await Swal.fire({
      title: "Select an option",
      input: "radio",
      inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return "You need to choose an option!";
        }
      }
    });

    if (option === "delete") {
      handleDeletePost(postId)
    } else if (option === "edit") {
      handleEditPost(postId, caption, postimage)
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    console.log("post to be deleted:", postId)
    Swal.fire({
      title: 'Are you sure to delete post?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosUserInstance
          .delete(`/post/deletePost/${postId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'role': 'user'
            }
          })
          .then((response) => {
            console.log('Post deleted:', response.data);
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success'
            });

          })
          .then(() => {
            handleCloseModal();

          })
          .catch((error) => {
            console.error('Error deleting post:', error);
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the post.',
              icon: 'error'
            });
          });
      }
    });
  };

  
  const handleEditPost = async (postId, caption, postimage) => {
    const token = localStorage.getItem("token");
    const { value: updatedCaption } = await Swal.fire({
      imageUrl: postimage,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      input: "textarea",
      inputValue: caption,
      inputPlaceholder: "Type your  caption here...",
      inputAttributes: {
        "aria-label": "Type your  caption here"
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel"
    });

    if (updatedCaption ) {
      try {
        const response = await axiosUserInstance.put(`/post/editPost/${postId}`, { caption: updatedCaption }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': 'user'
          }
        });
        console.log("editedddddd response",response.data);
        // dispatch(setPosts(response.data));
        // setPosts({ ...post, caption: updatedCaption });
        Swal.fire("Post  updated successfully!");
        handleCloseModal();
      } catch (error) {
        console.error(error);
      }
    }
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
            url={`http://localhost:8000/${post.file}`}
            className="z-0 h-full w-full rounded-md object-cover"
            style={{ maxHeight: '250px', width: '333px' }}
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
                url={`http://localhost:8000/${post.file}`}
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
                  <img src={post?.user?.image} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ marginBottom: 16 }}>{post?.user?.firstName}</p>
                  </div>
                </div>
                <div onClick={() => handleDivClick(post._id, post.caption, post.file)}>
                  <img src={Moreoptions} alt="" />
                </div>
              </div>

              <div className='scrollable-div'>
                <div style={{ display: 'flex', marginLeft: 30 }}>
                  <img src={post?.user?.image} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 19 }}>{post?.user?.firstName}</p>
                    <p style={{ marginTop: -3 }}>{post?.caption}</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(post?.createdAt)}</p>
                  </div>
                </div>

                {/* Render comments */}
                {post.comments.map((comment, index) => (
                  <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                    <img src={comment?.user?.image} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                    <div style={{ marginLeft: 20 }}>
                      <p style={{ marginTop: 19 }}>{comment?.user?.firstName}</p>
                      <p style={{ marginTop: -3 }}>{comment?.text}</p>
                      <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(comment?.createdAt)}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <div style={{ marginLeft: 30, marginTop: -9 }}>
              <div style={{ display: 'flex', justifyContent: "space-between", alignContent: 'center' }}>
                <div style={{ marginTop: 10, marginLeft: -15 }}>
                  <img src={Like} style={{ marginLeft: 13, cursor: "pointer" }} alt="" />
                  <img src={comment} style={{ marginLeft: 45, marginTop: -25, cursor: "pointer" }} alt="" />

                </div>
                <div style={{ marginTop: 10 }}>
                  <img src={Saveicon} style={{ cursor: "pointer" }} alt="" />
                </div>
              </div>
              <p style={{ marginTop: 0 }}>{post?.likes.length} likes</p>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between", marginLeft: 30, alignContent: 'center' }}>
              <div style={{ flex: 4, marginLeft: 0 }}>
                <textarea type="text" style={{ width: "100%", backgroundColor: "black", border: "none", color: "white" }} placeholder='Add a comment' />
              </div>
              <div style={{ flex: 0.3, marginTop: 10, marginLeft: 35 }} >
                <p style={{ cursor: 'pointer', color: "#0095F6", fontWeight: 600 }}>Post</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default OwnPost;