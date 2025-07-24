import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TOGGLE_SIDEBAR } from "../redux/sidebarSlice";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  const isSidebarOpen = useSelector((state) => state.isSidebarOpen);
  const dispatch = useDispatch();

  const toggleSidebar = () => dispatch({ type: TOGGLE_SIDEBAR });

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Menu</h2>
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {[
            { label: "Home", url: "/dashboard" },
            { label: "Add User", url: "/add-user" },
            { label: "Address List", url: "/address-list" },
            { label: "Add Address", url: "/add-address" },
          ].map(({ label, url }) => (
            <li key={url}>
              <NavLink
                to={url}
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
                  />
                </svg>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
