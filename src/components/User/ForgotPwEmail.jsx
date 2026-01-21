import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { axiosUserInstance } from "../../services/axios/axios.js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function ForgotPwEmail() {

  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    email: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const verifyemail = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosUserInstance.post('/forgotPassword', formdata);
      // console.log('Response for forgot password:', response.data);

      if (response.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "OTP successfully sent to your email.",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/otp_forgotpw');
      }
    } catch (error) {
      console.error('Error occurred while verifying email:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred verifying email. Please try again later!",
       
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center " style={{
      background:
        "linear-gradient(to bottom right, #E86D9C, #FAAFCE, #FEADB9)",
    }}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-white">Verify Email here</h2>
          <p className="mt-2 text-white-600">
            Enter your registered email address to send OTP  for password reset.
          </p>
        </div>
        <div className="mt-10 w-full md:w-1/2 lg:mt-0">

          <form className="flex lg:justify-center" onSubmit={verifyemail}>
            <div className="flex w-full max-w-md items-center space-x-2">
              <input
                className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="email"
                id="email"
                onChange={handleOnChange}
                value={formdata.email}
                placeholder="Email"
              ></input>
              <button type="submit" className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-500 hover:from-pink-500 hover:via-pink-400 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

}
export default ForgotPwEmail








