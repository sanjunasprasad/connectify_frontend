import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { axiosUserInstance } from "../../services/axios/axios.js";

function UserSignup() {
  const navigate = useNavigate();
  const nameRegex = /^[A-Za-z]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName) {
      errors.firstName = "First Name cannot be empty";
    } else if (!nameRegex.test(data.firstName)) {
      errors.firstName = "First Name must only contain alphabets";
    }

    if (!data.lastName) {
      errors.lastName = "Last Name cannot be empty";
    } else if (!nameRegex.test(data.lastName)) {
      errors.lastName = "Last Name must only contain alphabets";
    }

    if (!data.phoneNo) {
      errors.phoneNo = "Please provide a phone number";
    } else if (data.phoneNo.length < 10) {
      errors.phoneNo = "Please provide a valid phone number";
    }

    if (!data.email) {
      errors.email = "Please provide an email";
    }

    if (!data.password) {
      errors.password = "Please provide a password";
    }
      else if (!passwordRegex.test(data.password)) {
        errors.password = "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character"
    }
    else if(data.password.length < 8){
      errors.password = "Password must have 6 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // console.log(formData);
        const response = await axiosUserInstance.post("/userRegister", formData);
        if (response.status === 200) {
          // Reset form after successful submission
          setFormData({
            firstName: "",
            lastName: "",
            phoneNo: "",
            email: "",
            password: "",
          });
          navigate("/otp");
        }
        // console.log("Registration successfulll:", response.data);
      } catch (error) {
        console.error("Registration failedddd:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom right, #E86D9C, #FAAFCE, #FEADB9)",
      }}
    >
      <div
        className="bg-white bg-opacity-25 backdrop-blur-lg p-10 rounded-lg shadow-lg"
        style={{ width: "450px", height: "720px" }} // Increased height
      >
        {/* <h1 className="text-3xl font-semibold text-white mb-5">Connectify</h1> */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="firstname"
            >
              First Name
            </label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleInputChange}
              value={formData.firstName}
            />
            {errors.firstName && (
              <p className="error-message text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleInputChange}
              value={formData.lastName}
            />
            {errors.lastName && (
              <p className="error-message text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
            {errors.email && (
              <p className="error-message text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="phoneno"
            >
              Phone No
            </label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Phone No"
              name="phoneNo"
              onChange={handleInputChange}
              value={formData.phoneNo}
            />
            {errors.phoneNo && (
              <p className="error-message text-red-500">{errors.phoneNo}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              placeholder="********"
              onChange={handleInputChange}
              value={formData.password}
            />
            {errors.password && (
              <p className="error-message text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-500 hover:from-pink-500 hover:via-pink-400 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              value="Sign Up"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-white text-center mt-3">
          Already have an account?
          <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
