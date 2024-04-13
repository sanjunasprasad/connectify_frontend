import React, { useState} from 'react'
import moment from 'moment';
import Modal from 'react-modal';
import "./SavedPost.css"
import love from "../../../Icons/Notifications2.png"
import comment from "../../../Icons/Comment.png"
import Likeicon from "../../../Icons/Notifications.png"
import unlike from "../../../Icons/Unlike.png"
import Moreoptions from '../../../Icons/Moreoptions.png'
import Saveicon from "../../../Icons/Save.png"



function SavedPost({item}) {

  const getRelativeTime = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [Like, SetLike] = useState(Likeicon);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  }
  const handleCloseModal = () => {
    setmodalIsOpen(false);
  };

  const handleLike = () => {
    if (Like === Likeicon) {
      SetLike(unlike);
    } else {
      SetLike(Likeicon);
    }
  }
  return (
    <>
      <div className="containerclass" onClick={handleShowmodal}>
          <div  className="imagefor">
            <img src={item?.file}className='imageforimage' alt="" />
            <div className="text">
              <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                <img src={love} className='logoforexplorepost' alt="" />
                <p style={{marginLeft:5}}>{item?.likes.length}</p>
              </div>
              <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                <img src={comment} className='logoforexplorepost' alt="" />
                <p style={{marginLeft:5}}>{item?.comments.length}</p>
              </div>
            </div>
          </div>
      </div>
      <Modal style={{ overlay: { backgroundColor: "#2e2b2bc7" } }} isOpen={modalIsOpen} onRequestClose={handleCloseModal} className={"modalclassNameforASavedPost"}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1.3 }} >
            <img style={{ width: "100%", height: "85vh", objectFit: "cover" }} src={item?.file} alt="" />
          </div>
          <div style={{ flex: 1, height: "85vh" }}>
            <div >
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                  <img src={item?.userPhoto} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ marginBottom: 16 }}>{item?.username}</p>
                  
                  </div>
                
                </div>
                <div onClick={handleCloseModal}>
                  <img src={Moreoptions} alt="" />
                </div>
              </div>

              <div className='scrollable-div'>
                <div style={{ display: 'flex', marginLeft: 30 }}>
                  <img src={item?.userPhoto} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 19 }}>{item?.username}</p>
                    <p style={{ marginTop: -3 }}>{item?.caption}</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(item?.createdAt)}</p>
                  </div>
                </div>

                  {/* Render comments */}
              {item.comments.map((comment, index) => (
                <div key={index} style={{ display: 'flex', marginLeft: 30 }}>
                  <img src={comment.userPhoto} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 19 }}>{comment.username}</p>
                    <p style={{ marginTop: -3 }}>{comment.text}</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>{getRelativeTime(comment.createdAt)}</p>
                  </div>
                </div>
                 ))}

              </div>
            </div>

            <div style={{ marginLeft: 30, marginTop: -9 }}>
              <div style={{ display: 'flex', justifyContent: "space-between", alignContent: 'center' }}>
                <div style={{ marginTop: 10, marginLeft: -15 }}>
                  <img onClick={handleLike} src={Like} style={{ marginLeft: 13, cursor: "pointer" }} alt="" />
                  <img src={comment} style={{ marginLeft: 45, marginTop: -25, cursor: "pointer" }} alt="" />

                </div>
                <div style={{ marginTop: 10 }}>
                  <img src={Saveicon} style={{ cursor: "pointer" }} alt="" />
                </div>
              </div>
              <p style={{ marginTop: 0 }}>{item?.likes.length} likes</p>
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


export default SavedPost