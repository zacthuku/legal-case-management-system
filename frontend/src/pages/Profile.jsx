import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { currentUser, setCurrentUser, fetch_profile } = useContext(UserContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profile = currentUser?.profile || {};

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    profile_picture_url: '',
  });

  useEffect(() => {
    if (currentUser?.profile) {
      setFormData({
        full_name: currentUser.profile.full_name || '',
        phone_number: currentUser.profile.phone_number || '',
        address: currentUser.profile.address || '',
        profile_picture_url: currentUser.profile.profile_picture_url || '',
      });
    }
  }, [currentUser]);

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') payload[key] = value;
    });

    try {
      const res = await fetch('http://127.0.0.1:5000/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update profile');

      // ✅ Update context state
      setCurrentUser((prev) => ({
        ...prev,
        profile: result.profile,
      }));

      toast.success('Profile updated!');
      setShowEditForm(false);
    } catch (err) {
      toast.error(err.message || 'Error updating profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error('New passwords do not match');
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');

      toast.success('Password changed successfully');
      setPasswords({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      toast.error(err.message || 'Error changing password');
    }
  };

  if (!currentUser) return <div className="p-8">Loading user profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow-md">
        {/* Profile Picture + Info */}
        <div className="flex flex-col items-center">
          {formData.profile_picture_url ? (
            <img
              src={formData.profile_picture_url}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-md grayscale"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-400 flex items-center justify-center shadow-md">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                alt="Default Avatar"
                className="w-20 h-20 object-contain grayscale"
              />
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-4 w-full border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Username:</span> {currentUser.username}</p>
            <p><span className="font-medium">Email:</span> {currentUser.email}</p>
            <p><span className="font-medium">Role:</span> {currentUser.role}</p>
            <p><span className="font-medium">Full Name:</span> {profile.full_name || 'Not provided'}</p>
            <p><span className="font-medium">Phone:</span> {profile.phone_number || 'Not provided'}</p>
            <p><span className="font-medium">Address:</span> {profile.address || 'Not provided'}</p>
          </div>
        </div>

        {/* Edit Profile Toggle */}
        <div className="space-y-4">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            Edit Profile
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {showEditForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="profile_picture_url"
                value={formData.profile_picture_url}
                onChange={handleChange}
                placeholder="Profile Picture URL"
                className="w-full px-3 py-2 border rounded"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Change Password Toggle */}
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            Change Password
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                name="current_password"
                value={passwords.current_password}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                name="new_password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                name="confirm_password"
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
