import React, { useState } from 'react'
import "./Explorepostt.css"
import love from "../../../Icons/Notifications2.png"
import comment from "../../../Icons/Comment.png"
import Likeicon from "../../../Icons/Notifications.png"
import unlike from "../../../Icons/Unlike.png"
import Moreoptions from '../../../Icons/Moreoptions.png'
import Modal from 'react-modal';


export default function Explorepost(item) {

  
  // console.log(item)
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const handleShowmodal = () => {
    setmodalIsOpen(true);
  }
  const handleCloseModal = () => {
    console.log("callledddddd")
    setmodalIsOpen(false);
  };


  return (
    <div className="containerclass" onClick={handleShowmodal}>
      <div className="imagefor">
        <img src={item?.item?.postimage} className='imageforimage' alt="" />
        <div className="text">
          <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
            <img src={love} className='logoforexplorepost' alt="" />
            <p style={{ marginLeft: 5 }}>{item?.item?.likes}</p>
          </div>
          <div style={{ display: "flex", alignItems: 'center', marginLeft: "10px" }}>
            <img src={comment} className='logoforexplorepost' alt="" />
            <p style={{ marginLeft: 5 }}>{item?.item?.comments}</p>
          </div>
        </div>
      </div>
      <Modal
        style={{ overlay: { backgroundColor: "#2e2b2bc7" } }}
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className={"modalclassNameforAPost"}
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1.3 }} >
            <img style={{ width: "100%", height: "85vh", objectFit: "cover" }} src={item?.item?.postimage} alt="" />
          </div>
          <div style={{ flex: 1, height: "90vh" }}>
            <div >
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVIYDt6bSnhK21l1e1eGY0FnEBcTkTYeyEgEL53gv&s" style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ marginBottom: 16 }}>Suman</p>
                    <p style={{ marginTop: -17, fontSize: 12 }}>Khadka</p>
                  </div>
                </div>          
              </div>

              <div className='scrollable-div'>
                <div style={{ display: 'flex', marginLeft: 30 }}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVIYDt6bSnhK21l1e1eGY0FnEBcTkTYeyEgEL53gv&s" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} alt="" />
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ marginTop: 23 }}>Suman</p>
                    <p style={{ marginTop: -6 }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore hic blanditiis asperiores sint, odit odio nemo dolore reiciendis necessitatibus assumenda corporis. Corporis doloribus aspernatur eligendi, praesentium delectus quam reiciendis labore.</p>
                    <p style={{ color: "#A8A8A8", marginTop: -10 }}>1d</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
