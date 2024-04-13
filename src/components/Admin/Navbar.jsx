import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="flex-shrink-0">
          {/* <a href="#" className="text-white font-semibold">Your Logo</a> */}
        </div>

        {/* search Icon */}
        <div className="flex items-center">
          {/* <input
            type="search"
            placeholder="Search"
          
            className="border border-gray-700 px-3 py-1 mr-2 rounded-lg bg-gray-700 text-white"
          /> */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a2 2 0 100-4 2 2 0 000 4zM3 10a7 7 0 1114 0 7 7 0 01-14 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                <button
                  type="button"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
