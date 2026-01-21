import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAdminInstance } from "../../services/axios/axios";
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";



function UserManage() {

  const [userDate,setUserDate] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    } else {
      axiosAdminInstance
        .get("/admin/loadUsers")
        .then((response) => {
          setUsers(response.data);
          const updatedUsers = response.data.map(user => ({
            ...user,
            createdAt: new Date(user.createdAt)
        }));
        setUserDate(updatedUsers);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [navigate]);


 

  // to block/unblock
  const toggleUserStatus = async (id) => {
    // const token = localStorage.getItem("adminToken");
    // console.log("admin token",token)
    const userToUpdate = users.find((user) => user._id === id);
    // console.log("usertoupdate:", userToUpdate);
    const newStatus = !userToUpdate.is_blocked;
    // console.log("newstatus", newStatus);
    try {
        const result = await Swal.fire({
            title: `Are you sure you want to ${newStatus ? 'block' : 'unblock'} this user?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed!"
        });

        if (result.isConfirmed) {
            const response = await  axiosAdminInstance.post(`/admin/blockuser/${id}`,{is_blocked: newStatus,});
            // console.log("response of blocked user:",response)

            // Update the local state to reflect the change
            setUsers(
                users.map((user) =>
                    user._id === id ? { ...user, is_blocked: newStatus } : user
                )
            );
            Swal.fire({
                title: "Success!",
                text: `User has been ${newStatus ? 'blocked' : 'unblocked'} successfully.`,
                icon: "success"
            })
        } else {
            // Handle the cancel action here
            Swal.fire({
                title: "Cancelled",
                text: "The action has been cancelled.",
                icon: "info"
            });
        }
    } catch (error) {
        console.error("Error toggling user status:", error);
    }
};


  //to delete user
const deleteUser = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
      const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
          const response = await axiosAdminInstance.delete(`/admin/adminDeleteUser/${id}`);
          if (response.data.email) {
              setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
              Swal.fire({
                  title: "Deleted!",
                  text: "User has been deleted.",
                  icon: "success"
              });
          } else {
              alert(response.data.message);
          }
      } else {
          // Handle the cancel action here
          Swal.fire({
              title: "Cancelled",
              text: "The action has been cancelled.",
              icon: "info"
          });
      }
  } catch (err) {
      console.log(err);
  }
}

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
                This is a list of all Users. You can block/unblock users or
                delete existing ones.
              </p>
            </div>
             <div>
            {/* <button
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Add new employee
            </button> */}
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
                          No.
                        </th>
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
                          Contact Number
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Joined Date
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>Action</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((user,index) => (
                        <tr key={user._id}>
                          <td className="whitespace-nowrap text-sm px-4 py-4">
                            {index+1}
                          </td>

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

                          <td className="whitespace-nowrap px-12 py-4">
                            <div className="text-sm text-gray-900 ">
                              {user?.phoneNo}
                            </div>
                            <div className="text-sm text-gray-700"></div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            {/* {user?.date} */}
                            {user.createdAt ? user.createdAt.substr(0, 10) : ''}
                          </td>
                         
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              {user.is_blocked ? "Blocked" : "Active"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                              <button  type="button" onClick={() => toggleUserStatus(user._id)}
                                className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold 
                                text-white shadow-sm  focus-visible:outline 
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                {user.is_blocked ? "Unblock" : "Block"}
                              </button>
                              <button type="button" onClick={() => deleteUser(user._id)}
                                className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white
                                 shadow-sm hover:bg-red-600/80 focus-visible:outline focus-visible:outline-2 
                                 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                Delete 
                              </button>
                            </div>
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

export default UserManage;
