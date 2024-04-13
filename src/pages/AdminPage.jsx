import React from 'react'
import Dashboard from "../components/Admin/Dashboard";
import Sidebar from '../components/Admin/Sidebar';
import Navbar from '../components/Admin/Navbar';


function AdminPage() {
  return (
    <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Navbar />
      <div className="p-4">
        <Dashboard />
      </div>
    </div>
  </div>
  )
}

export default AdminPage
