import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import { axiosAdminInstance } from "../../services/axios/axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";




function Notifications() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersForRemoval, setUsersForRemoval] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    } else {
      axiosAdminInstance
        .get("/admin/listReportuser")
        .then((response) => {
          // console.log("response all reported user", response.data)
          setUsers(response.data);
          const allUsers = response.data;
          const filtereduser = allUsers.filter(user =>
            user.reports.length >= 3
          );
          setUsersForRemoval(filtereduser);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [navigate]);

  
  const handleDeactivate = async (id) => {
    try {
      // Check if the user is already deactivated
      if (usersForRemoval.find(user => user._id === id && user.status)) {
        Swal.fire({
          icon: "warning",
          title: "User Already Deactivated",
          
        });
        return;
      }
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Once deactivated, this action cannot be undone!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!"
      });
      
      if (confirmed.isConfirmed) {
        const response = await axiosAdminInstance.post(`/admin/deactivateUser/${id}`, { status: false });
        
        if (response.status === 200) {
          // Update usersForRemoval state after deactivating the user
          setUsersForRemoval((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id ? { ...user, status: true } : user
            )
          );
          
          Swal.fire({
            text: "User deactivated successfully",
            icon: "success"
          });
        }
      }
    } catch (error) {
      console.error("error is", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deactivating user."
      });
    }
  };
  
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />

        <section className="mx-auto w-full max-w-7xl px-4 py-4">
          <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="mt-1 text-sm text-gray-700">
                This is a list of all reported Users.
              </p>
            </div>

          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>User Name</span>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Reported By
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Reported Date
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Reported Issue
                        </th>
                      </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((user, userIndex) => (
                        user.reports.map((report, reportIndex) => (
                          <tr key={`${user._id}-${reportIndex}`}>
                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={user?.image}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {user?.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Display report data */}
                            <td className="whitespace-nowrap px-12 py-4">
                              <div className="text-sm text-gray-900">
                                {report?.reportedBy?.firstName}  {report?.reportedBy?.lastName}
                              </div>
                              <div className="text-sm text-gray-700"></div>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4">
                              {new Date(report.createdAt).toISOString().split('T')[0]}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                {report.reason}
                              </span>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>



          {/* Second Table */}
          <div className="py-5">
            <h2 className="text-lg font-semibold">Users Listed for Deactivate</h2>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200" >
                    {/* Table Headers */}
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {usersForRemoval.map((user, userIndex) => (
                       
                        <tr key={user._id}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={user?.image}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-sm text-gray-700">
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeactivate(user._id)}>
                              {user.status ? 'Deactivated' : 'Deactivate User'}
                            </button>
                          </td>
                        </tr>
                
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
}

export default Notifications;
