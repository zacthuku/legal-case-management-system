import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';

const Users = () => {
  const { token, currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${api_url}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${api_url}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      toast.success("User deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const confirmDelete = (userId) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <p>Are you sure you want to delete this user?</p>
          <div className="mt-2 flex gap-2 justify-end">
            <button
              onClick={() => {
                handleDelete(userId);
                toast.dismiss(toastId);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(toastId)}
              className="px-3 py-1 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">All Users</h1>
      <p className="text-gray-600 mb-6">Users currently in the database.</p>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => confirmDelete(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
