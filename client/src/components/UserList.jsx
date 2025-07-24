import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/userSlice";
import { Link } from "react-router-dom";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <Link
          to="/add-user"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded shadow"
        >
          Add User
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border-gray-300">Name</th>
              <th className="px-3 py-2 border-gray-300">Email</th>
              <th className="px-3 py-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 py-2 border-gray-300">{user.name}</td>
                <td className="px-3 py-2 border-gray-300">{user.email}</td>
                <td className="px-3 py-2 border-gray-300">
                  <Link
                    to={`/edit-user/${user._id}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
