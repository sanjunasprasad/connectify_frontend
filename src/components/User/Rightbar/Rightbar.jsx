import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import "./rightbar.css"
import { axiosUserInstance }  from "../../../services/axios/axios";
import { setPosts } from '../../../services/redux/slices/postSlice';
import Post from '../Post/Post'

function Rightbar() {

    const dispatch = useDispatch();
    const loggeduser = useSelector(state => state.user.user);
    // console.log("user data from store in rightbar switch",loggeduser)
    const {_id,following} = loggeduser || { _id: null, following: [] };
    // console.log("logged id is",_id)
    // console.log("i am following is:",following)

  //restricted post display
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (_id) {
      axiosUserInstance.get(`/post/loadPost/${_id.toString()}`, {
        params: { following: JSON.stringify(following) },
        headers: {
          'Authorization': `Bearer ${token}`,
          'role': 'user'
      }
      })
      .then(response => {
      // console.log("POST RESPONSE POSTTTTT##### ",response.data) //full populated data
        dispatch(setPosts(response.data));
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
    }
  }, [_id,following,dispatch]);



  //suggestion list
  const [responseData, setResponseData] = useState([]);
  useEffect (()=>{
    const token = localStorage.getItem("token");
    if (_id) {
      const response = axiosUserInstance.get(`/friend/suggestionlist/${_id}`,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'role': 'user'}
       }).then(response => {
          setResponseData(response.data);
          console.log("POST RESPONSE##### ",response.data) 
          
          })
          .catch(error => {
            console.error('Error fetching user:', error);
          });
    }
 
  },[_id])

//follow+unfollow
const [followStatus, setFollowStatus] = useState({});
const handleFollow = async (userid) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosUserInstance.post(`/friend/follow/${userid}`,{ loggeduser: _id },{
      headers: {
        'Authorization': `Bearer ${token}`,
        'role': 'user'}
    });
    // console.log("response for follow:",response)
    setFollowStatus(prevState => ({
      ...prevState,
      [userid]: true
  }));
  } catch (error) {
    console.error('Error following user:', error);
  }
};

const handleUnfollow = async (userid) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosUserInstance.post(`/friend/unfollow/${userid}`,{loggeduser:_id},{
      headers: {
        'Authorization': `Bearer ${token}`,
        'role': 'user'}
    });
    // console.log("response for unfollow:",response)
    setFollowStatus(prevState => ({
      ...prevState,
      [userid]: false
  }));
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};

  const posts = useSelector(state => state.post.posts) || []; //mapping for post component,useselector needed
  // console.log("post from rightbar selector through redux",posts)

  return (
    <div className='MainRigntBar'>
      <div className='submainrightbar'>
       {/* post area */}
       <div style={{ flex: 1.7, padding: 20 }}>
          {posts.map((postlist, index) => (
            <Post key={index} postlist={postlist}  /> 
          ))}
        </div>
        

        {/* suggestion list area */}
        <div style={{flex:2 }}>
          <div style={{marginRight:"20px"}}>
            {/* profile switch */}
            {loggeduser && (
            <div style={{ display: "flex", alignItems: "center" , marginLeft:20 , marginTop:30 , cursor:"pointer"}}>
             <img src={loggeduser.image} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="" />
              <div style={{marginLeft:10}}>
                <p style={{textAlign:'start'}}><Link to={`/username`} >{loggeduser.firstName}</Link></p>
                <p style={{marginTop:-4 , textAlign:'start' , color:"#A8A8A8"}}>{loggeduser.email}</p>
              </div>
             
            </div>
            )}
 
             {/* suggestion list */}
            <div style={{display:"flex"}}>
              <div>
              <p style={{color:"#A8A8A8" , textAlign:'start',marginLeft:30,marginTop:50 }}>People you may know</p>
              {/* list */}
              {responseData.map(user => (
              <div key={user._id} style={{display:"flex" , alignItems:"center" , marginLeft:20 , marginTop:10}}>
                  <img src={user.image}style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                    <div>
                      <p style={{ marginLeft: 10 , textAlign:"start"  }}>  <Link to={`/username/${user._id}`} >{user.firstName}</Link> </p>
                      <p style={{marginTop:-5 , color:"#A8A8A8" , marginLeft:10}}>Sugggested for you</p>
                    </div>

                    <div style={{marginLeft:"130px" , cursor:"pointer"}}>
                    {followStatus[user._id] ? (
                            <p style={{ color: "#0095f6" }} onClick={() => handleUnfollow(user._id)}>Unfollow</p>
                        ) : (
                            <p style={{ color: "#0095f6" }} onClick={() => handleFollow(user._id)}>Follow</p>
                        )}
                    </div>
              </div>
                ))} 
            </div>  
          </div>


          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Rightbar