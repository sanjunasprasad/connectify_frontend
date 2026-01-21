import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axios/axios.js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";


function ResetPassword() {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formdata, setFormData] = useState({
    password: "",
    confirmpassword:""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); 
  };

  const validateForm = (data) => {
    const errors = {}
    if (!data.password) {
      errors.password = "Please provide a password";
    } else if (data.password.length < 6) {
      errors.password = "Password must have at least 6 characters";
    }
   else if (!data.confirmpassword ) {
      errors.confirmpassword = "Please confirm  password";
    }
    else if (data.password !== data.confirmpassword) {
      errors.confirmpassword = "Passwords do not match";
    }
    return errors;
  };

  const handleResetPW = async (e)=>{
    e.preventDefault();
    const validationErrors = validateForm(formdata);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }
    try{
      const response = await axiosInstance.post('/resetPassword', formdata);
      // console.log('Response for forgot password:', response.data);
      if (response.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Password reset successfully",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/');
      }

    }
    catch(error){
      console.error('Error occurred resetting password', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred reseeting password. Please try again later!",
       
      });

    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center " style={{
      background:
        "linear-gradient(to bottom right, #E86D9C, #FAAFCE, #FEADB9)",
    }}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h2 className="text-3xl font-bold text-white">Reset Account Password Here</h2>
          <p className="mt-2 text-white-600">
           Enter a new password for connectify.com
          </p>
        
        </div>
        <div className="mt-10 w-full md:w-2/3 lg:mt-0 lg:w-1/2">
          <form onSubmit={handleResetPW} className="flex lg:justify-center">
            <div className="flex w-full max-w-md flex-col space-y-4">
              <input
                className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                id="password"
                onChange={handleOnChange}
                value={formdata.password}
                placeholder="Enter new password"
              ></input>
               {errors.password && (
              <p className="error-message text-red-500">{errors.password}</p>
            )}
               <input
                className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                onChange={handleOnChange}
                value={formdata.confirmpassword}
                placeholder="Confirm new password"
              ></input>
               {errors.confirmpassword && (
              <p className="error-message text-red-500">{errors.confirmpassword}</p>
            )}
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-500 hover:from-pink-500 hover:via-pink-400 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Reset 
              </button>
            </div>
          </form>
      
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
