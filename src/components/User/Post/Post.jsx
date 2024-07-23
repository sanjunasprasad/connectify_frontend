import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { axiosUserInstance } from "../../../services/axios/axios";
import { addComment } from "../../../services/redux/slices/postSlice"
import moment from 'moment';
import Modal from "react-modal";
import ReactPlayer from 'react-player'
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Postt.css"
import altusericon from "../../../Icons/user.png"
import greyicon from "../../../Icons/Notifications.png" //hollowwhite
import redicon from "../../../Icons/Unlike.png" //redicon
import commneticon from "../../../Icons/Comment.png"
import Saveicon from "../../../Icons/Save.png"
import Savedicon from "../../../Icons/saved.png"


export default function Post({ postlist }) {


  // console.log("postlist props contains:", postlist)
  // console.log("url of posts",postlist.file)
  const dispatch = useDispatch();
  const loggeduser = useSelector(state => state.user.user)
  const isImage = postlist.file.endsWith(".jpg") || postlist.file.endsWith(".jpeg") || postlist.file.endsWith(".png") || postlist.file.endsWith(".gif");
  const isVideo = postlist.file.endsWith(".mp4") || postlist.file.endsWith(".mov") || postlist.file.endsWith(".avi") || postlist.file.endsWith(".mkv");


  const getRelativeTime = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  //LIKE DISLIKE
  const [liked, setLiked] = useState(() => {
    const storedLiked = localStorage.getItem(`post_liked_${postlist._id}_${loggeduser._id}`);
    // console.log("from local stored like",storedLiked)
    const initialState = storedLiked ? JSON.parse(storedLiked) : postlist?.likes.some(like => like.user === loggeduser._id);
    // console.log(`Initial like state for post ${postlist._id}:`, initialState);
    return initialState
  });


  
  const [Likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem(`post_likes_${postlist._id}`);
    // console.log("from local stored TOTAL like", storedLikes)
    const initialtotal_likes = storedLikes ? JSON.parse(storedLikes) : (postlist?.likes.length || 0)
    // console.log(`Initial like state for post ${postlist._id}:`, initialtotal_likes);
    return initialtotal_likes
  });

  const handleLike = async () => {
    try {
      const newLiked = !liked;
      // console.log("New liked state:", newLiked);
      setLiked(newLiked);
      const response = await axiosUserInstance.put(`/post/likepost/${postlist._id}`, { userId: loggeduser._id });
      // console.log("like response is", response);
      if (response.status === 200) {
        setLikes(prevLikes => (newLiked ? prevLikes + 1 : prevLikes - 1));
        localStorage.setItem(`post_liked_${postlist._id}_${loggeduser._id}`, JSON.stringify(newLiked));
        localStorage.setItem(`post_likes_${postlist._id}`, JSON.stringify(newLiked ? Likes + 1 : Likes - 1));    
      }
    } catch (error) {
      console.error('Error occurred while liking the post:', error);
    }
  };




  // handle comment +comment modal
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const handleShowmodal = () => {
    setmodalIsOpen(true)
  }
  const [comment, setComment] = useState('');
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handlecomment = async () => {
    try {
      const response = await axiosUserInstance.post(`/post/commentpost/${postlist._id}`, {
        userId: loggeduser._id,
        comment: comment
      });
      console.log('response for comment posting:', response.data);
      setComment('');
      setmodalIsOpen(false);
      dispatch(addComment(response.data));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Comment added successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  //savepost 
  const [isSaved, setIsSaved] = useState(false);
  const savePost = async () => {
    try {
      await axiosUserInstance.post(`/post/savePost/${postlist._id}`, { userId: loggeduser._id });
      Swal.fire("Post  saved successfully!");
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving post:', error);
      Swal.fire("Post already saved!");
    }
  }


  //fetch list of post liked users only
  const [modalOpen, setModalOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const showLikedPeople = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const response = await axiosUserInstance.get(`/post/likedusers/${postlist._id}`);
        if (response.status === 200) {
          setLikedUsers(response.data.likedUsers);
        }
      } catch (error) {
        console.error('Error occurred while fetching liked users:', error);
      }
    };

    if (modalOpen) {
      fetchLikedUsers();
    }
  }, [modalOpen, postlist._id]);


  return (

    <>
      {/* area for profileimage+profilename on post top */}
      <div style={{ marginLeft: "120px", marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* profilepic on post top*/}
            {postlist && (
              <img src={postlist?.user?.image || altusericon} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", }} alt="" />)}
            {/* username  on post top*/}
            <p style={{ marginLeft: 10 }}>
              {postlist && postlist.user && postlist.user._id && loggeduser && loggeduser._id === postlist.user._id ? (<Link to={`/username`} >{postlist?.user?.firstName}</Link>) : (<Link to={`/username/${postlist.user._id}`} >{postlist?.user?.firstName}</Link>)}
            </p>
          </div>
        </div>


        {/* modal for comments */}
        <Modal
          style={{ overlay: { backgroundColor: "#2e2b2bc7" } }}
          isOpen={modalIsOpen}
          onRequestClose={() => setmodalIsOpen(false)}
          className={"modalclassNameforAPost"}
        >
          {/* bigimage left side + commentsection */}
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1.3 }} >
              {isImage && (
                <img
                  style={{ width: "100%", height: "85vh", objectFit: "cover" }}
                  src={postlist?.file}
                  alt=""
                />
              )}
              {isVideo && (
                <ReactPlayer
                  controls={true}
                  url={postlist?.file}
                  height="85vh"
                  width="100%"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>

            {/* rightside commentsection */}
            <div style={{ flex: 1, height: "90vh" }}>
              <div >
                <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                    <img src={postlist?.user?.image || altusericon} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                    <div style={{ paddingLeft: 10 }}>
                      {/* post owner name on top comment section */}
                      <p style={{ marginBottom: 0 }}>{postlist?.user?.firstName}</p>
                    </div>
                  </div>
                </div>
                {/* dynamic comment display section */}
                <div className='scrollable-div'>

                  <div style={{ display: 'flex', marginLeft: 30 }}>
                    <img src={postlist?.user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                    <div style={{ marginLeft: 20 }}>
                      <p style={{ marginTop: 19 }}>{postlist?.user?.firstName}</p>
                      <p style={{ marginTop: -3 }}>{postlist?.caption}</p>
                      <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(postlist?.createdAt)}</p>
                    </div>

                  </div>

                  {postlist.comments.map((comment, index) => (
                    <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                      <img src={comment?.user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', marginTop: 35 }} alt="User" />
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ marginTop: 30 }}>{comment?.user?.firstName}</p>
                        <p style={{ marginTop: 0 }}>{comment?.text}</p>
                        <p style={{ color: '#A8A8A8', marginTop: -4 }}>{getRelativeTime(comment?.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: "space-between", marginLeft: 30, alignContent: 'center' }}>
                <div style={{ flex: 4, marginLeft: 10 }}>
                  <textarea type="text" value={comment} style={{ width: "100%", backgroundColor: "black", border: "none", color: "white" }} onChange={handleCommentChange} placeholder='Add a comment' />
                </div>
                <div style={{ flex: 0.3, marginTop: 6, marginLeft: 10 }}  >
                  <p style={{ cursor: 'pointer', color: "#0095F6", fontWeight: 600 }} onClick={handlecomment}>Post</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>


        {/* area for postimage+caption+comment */}
        {isImage && (
          <img
            src={postlist.file}
            style={{ height: "auto", width: "100%", objectFit: "contain" }}
            alt="Posted image"
          />
        )}
        {isVideo && (
          <ReactPlayer
            controls={true}
            url={postlist?.file}
            height="auto"
            width="100%"
            style={{ objectFit: "contain" }} />
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>  {/* to style icons like,comment,save,share  */}
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
            {/* Likes  */}
            <div >
              <img src={liked ? redicon : greyicon} className='logoforpost' alt="" onClick={handleLike} />
            </div>


            {/* Comment */}
            <div onClick={handleShowmodal} style={{ cursor: "pointer" }}>
              <img src={commneticon} className='logoforpost' alt="" />
            </div>
          </div>
          {/* Save */}
          <div style={{ display: 'flex', alignItems: 'center' }} onClick={savePost}>
            {isSaved ? (
              <img src={Saveicon} alt="Saved" /> 
            ) : (
              <img src={Saveicon} alt="Save" /> 
            )}
          </div>
        </div>


        {/* likes count  */}
        <p style={{ display: "flex", marginTop: "0px" ,cursor: "pointer",}} onClick={showLikedPeople}>{Likes} likes</p>
        <p style={{ textAlign: 'start', }}>{postlist.caption}</p> {/* caption */}
        <div style={{ cursor: "pointer" }} onClick={handleShowmodal}>
          <p style={{ textAlign: "start", color: "#A8A8A8" }}>View all comments</p>
        </div>
        <p style={{ textAlign: "start", fontSize: "11px", color: "#A8A8A8" }}>{getRelativeTime(postlist?.createdAt)}</p>
      </div>




      {/* Liked People Modal */}
      <Modal
        style={{ overlay: { backgroundColor: "#2e2b2bc7" } }}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className={"modalforAlikedPost"}
      >
        <div className='scrollable-likeddiv'>
          <p style={{ marginTop: 0, marginLeft: 33 }}>Likes</p>
          <hr></hr>
          {likedUsers.map((user, index) => (
            <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
              <img src={user?.image || altusericon} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', marginTop: 35 }} alt="User" />
              <div style={{ marginLeft: 20 }}>
                <p style={{ marginTop: 30 }}>{user?.firstName}</p>
                <p style={{ color: '#A8A8A8', marginTop: -4 }}>{user?.lastName}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>

  )
}


