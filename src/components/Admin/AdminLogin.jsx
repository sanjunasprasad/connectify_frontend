import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAdminInstance } from "../../services/axios/axios";

const AdminLogin = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosAdminInstance.post("/admin/adminLogin", {
        email,
        password,
      });

      if (response.data && response.data.adminData) {
        localStorage.setItem("adminToken", response.data.adminToken);
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#063970] to-blue-200">
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 px-6 py-10 sm:px-10 sm:py-6 bg-white rounded-lg shadow-md lg:shadow-lg">
          <div className="text-center mb-4">
            <h6 className="font-semibold text-[#063970] text-xl">Welcome Back Admin</h6>
          </div>
          <form className="space-y-5"onSubmit={handleSubmit} >
            <div>
              <input
                className="block w-full py-3 px-3 mt-2 text-gray-800 appearance-none border-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200 rounded-md"
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="relative w-full">
              <input
                className="block w-full py-3 px-3 mt-2 mb-4 text-gray-800 appearance-none border-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200 rounded-md"
                type="password"
                id="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-10 bg-[#063970] rounded-md font-medium text-white uppercase focus:outline-none hover:shadow-none"
            >
           Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
