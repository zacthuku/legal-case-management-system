// components/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
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
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        profile_picture_url: profile.profile_picture_url || '',
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
    Object.entries(formData).forEach(([k, v]) => {
      if (v.trim() !== '') payload[k] = v;
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
      if (!res.ok) throw new Error(result.error || 'Profile update failed');

      setCurrentUser((prev) => ({
        ...prev,
        profile: result.profile,
      }));

      toast.success('Profile updated!');
      setShowEditForm(false);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password)
      return toast.error('Passwords do not match');

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
      if (!res.ok) throw new Error(data.message || 'Password change failed');

      toast.success('Password updated');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.message || 'Password change error');
    }
  };

  if (!currentUser) return <div className="p-8">Loading user profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow-md">
        {/* Avatar */}
        <div className="flex justify-center">
          {formData.profile_picture_url ? (
            <img src={formData.profile_picture_url} alt="Profile" className="w-28 h-28 rounded-full" />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="Default Avatar"
              className="w-28 h-28 rounded-full grayscale"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white p-4 border rounded text-gray-700">
          <h3 className="font-semibold mb-2 text-lg">Profile Information</h3>
          <p><strong>Username:</strong> {currentUser.username}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
          <p><strong>Full Name:</strong> {profile.full_name || 'N/A'}</p>
          <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
          <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
        </div>

        {/* Edit Form */}
        <button onClick={() => setShowEditForm(!showEditForm)} className="text-blue-600 flex items-center">
          Edit Profile <ChevronDownIcon className="h-4 w-4 ml-1" />
        </button>
        {showEditForm && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="input" />
            <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" className="input" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" />
            <input name="profile_picture_url" value={formData.profile_picture_url} onChange={handleChange} placeholder="Profile Picture URL" className="input" />
            <button type="submit" className="btn bg-blue-600 text-white">Save</button>
          </form>
        )}

        {/* Password Form */}
        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-red-600 flex items-center">
          Change Password <ChevronDownIcon className="h-4 w-4 ml-1" />
        </button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input type="password" name="current_password" value={passwords.current_password} onChange={handlePasswordChange} placeholder="Current Password" className="input" />
            <input type="password" name="new_password" value={passwords.new_password} onChange={handlePasswordChange} placeholder="New Password" className="input" />
            <input type="password" name="confirm_password" value={passwords.confirm_password} onChange={handlePasswordChange} placeholder="Confirm New Password" className="input" />
            <button type="submit" className="btn bg-red-600 text-white">Change Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
