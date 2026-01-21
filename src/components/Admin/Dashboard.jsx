import React ,{useEffect} from 'react'
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);


  return (
    <div>
        
        <h1>welcome back admin</h1>
    </div>
  )
}

export default Dashboard
