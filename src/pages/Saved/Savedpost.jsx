import React ,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux';
import { axiosUserInstance } from "../../services/axios/axios";
import "./Savedpost.css"
import SavedPost from '../../components/User/SavedPost/SavedPost'
import Sidebar from '../../components/User/Sidebar/Sidebar'

 function Savedpost() {
  const loggedUser = useSelector(state => state.user.user);
  const { _id } = loggedUser
  console.log("id is", _id)
  const [savedPosts, setSavedPosts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSavedPosts = async () => {
      try {
        const response = await axiosUserInstance.get(`/post/getSavedpost/${_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': 'user'
          }
        });
        console.log("backend response", response)
        setSavedPosts(response.data);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };
    fetchSavedPosts();
  }, [_id]);
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
