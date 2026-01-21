import React ,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux';
import { axiosUserInstance } from "../../services/axios/axios";
import "./Savedpost.css"
import SavedPost from '../../components/User/SavedPost/SavedPost'
import Sidebar from '../../components/User/Sidebar/Sidebar'

 function Savedpost() {
  const loggedUser = useSelector(state => state.user.user);
  // console.log("user redux data in savedpost",loggedUser)
 
  const [savedPosts, setSavedPosts] = useState([]);
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axiosUserInstance.get(`/post/getSavedpost/${loggedUser._id}`);
        // console.log("backend response of getsavedpost", response)
        setSavedPosts(response.data);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };
    fetchSavedPosts();
  }, [loggedUser._id]);
  return (
    <div>
      <div>
        <div className='homesubcontainer'>
          <div className='homesidebar'>
            <Sidebar />
          </div>
          <div className='Explorerightbar'>
          {savedPosts.map((item, index) => (
            <SavedPost key={index} item={item} />
          ))}

          </div>
      
        </div>
                   
      </div>
    </div>
  )
}

export default Savedpost
