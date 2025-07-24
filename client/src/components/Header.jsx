import React from "react";
import { useDispatch } from "react-redux";
import { TOGGLE_SIDEBAR } from "../redux/sidebarSlice";
import { logout } from "../redux/authSlice"; // 👈 Import logout action
import { useNavigate } from "react-router-dom"; // 👈 Optional redirect

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => dispatch({ type: TOGGLE_SIDEBAR });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // 👈 Redirect to login or landing page
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
      <div className="flex items-center justify-between p-4 md:ml-64">
        <button className="md:hidden" onClick={toggleSidebar}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-l font-bold">My App</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">User</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
