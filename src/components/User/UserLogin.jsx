import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setToken } from "../../services/redux/slices/userSlice";
import { axiosInstance } from "../../services/axios/axios";
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'



function UserLogin() {

  const dispatch = useDispatch();
  // const loggeduserid = useSelector(state => state.user.user);
  // console.log("Current Redux Store State in login page:", loggeduserid);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [emailExist, setEmailExits] = useState("");
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formdata);
    // console.log("validation error:", Object.keys(validationErrors).length);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.post("/userLogin", formdata);
        // console.log("Responseeee after login:", response);
        if (response.status === 200) {
          localStorage.setItem("token", response.data);
          // console.log("token  setted to localstorage  after login via loginpage:",response.data)
          dispatch(setToken(response.data));
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
          navigate("/feedhome");
        }
      } catch (err) {
        if (err.response && err.response.data) {
          if (err.response.data.message === "User account is blocked.") {
            setEmailExits("Your account is blocked!!!");
          }
          if (err.response.data.message === "User account is deactivated.") {
            setEmailExits("Your account is deactivated!!!");
          }
          if (err.response.data.message === "Email address does not exist.") {
            setEmailExits("Email address does not exist.!!!");
          }
        }
        else if (err.response && err.response.status === 401) {
          setEmailExits("Incorrect email or password");
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {

    const errors = {};
    if (!data.email) {
      errors.email = "Email  cannot be empty";
    }

    if (!data.password) {
      errors.password = "Password  cannot be empty";
    }
    return errors;
  };


  






  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("usertoken from extra useeffect",token)
    if (!token) {
      navigate("/");
    }
    else {
      navigate("/feedhome")
    }
  }, [navigate]);

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, #E86D9C, #FAAFCE, #FEADB9)",
        }}
      >
        <div
          className="bg-white bg-opacity-25 backdrop-blur-lg p-10 rounded-lg shadow-lg"
          style={{ width: "400px", height: "500px" }}
        >
          <h1 className="text-3xl font-semibold text-white mb-5">Connectify</h1>
          <form onSubmit={handleSubmit}>

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
                name="email"
                placeholder="Email"
                id="email"
                onChange={handleOnChange}
                value={formdata.email}
              />
              {errors.email && <p className="error-message text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="********"
                name="password"
                onChange={handleOnChange}
                value={formdata.password}
              />
              {errors.password && (
                <p className="error-message text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-500 hover:from-pink-500 hover:via-pink-400 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
                value="Sign Up">Sign In</button>
              <Link to="/forgotpwemail" className="inline-block align-baseline font-bold text-sm text-white hover:text-pink-600" >Forgot Password?</Link>
            </div>

            <p className="text-white text-center mt-3">Dont have an account? <Link to="/signup">Sign Up</Link></p>

            {emailExist && (
              <p className="error-message text-center text-red-500">{emailExist}</p>
            )}
             {/* <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText="Sign in with Google"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              cookiePolicy={'single_host_origin'}
            />   */}
            
          </form>
        </div>

      </div>
    </div>
  );
}

export default UserLogin;
