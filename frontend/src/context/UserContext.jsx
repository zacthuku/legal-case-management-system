// context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {api_url} from '../config.json';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userCases, setUserCases] = useState([]);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [token, setAuthToken] = useState(() => localStorage.getItem('token'));
 
  // Fetch current user + profile
  const fetch_and_set_current_user = async (authToken = token) => {
    try {
      const res = await fetch(`${api_url}/current_user`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const user = await res.json();
      if (!user.id) return;

      const profileRes = await fetch(`${api_url}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const profileData = await profileRes.json();

      setCurrentUser({ ...user, profile: profileData.profile || {} });

      const firstTimeKey = `first_time_${user.id}`;
      const isFirstTime = !localStorage.getItem(firstTimeKey);
      if (isFirstTime) localStorage.setItem(firstTimeKey, 'false');
      setIsFirstTimeUser(isFirstTime);

      fetch_user_cases(user.role, user.id);

      if (['admin', 'lawyer', 'client'].includes(user.role)) navigate('/');
      else {
        toast.error("Unknown role");
        navigate('/login');
      }
    } catch (err) {
      toast.error('Failed to fetch user');
      console.error(err);
    }
  };

  
  useEffect(() => {
    if (token && !currentUser) {
      fetch_and_set_current_user();
    }
  }, [token]);

  const register_user = async (username, email, password, role) => {
    if (!username || !email || !password || !role)
      return toast.error('Please fill in all fields.');

    toast.loading('Registering...');
    try {
      const res = await fetch(`${api_url}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await res.json();
      toast.dismiss();

      if (data.success) {
        toast.success(data.success);
        navigate('/login');
      } else {
        toast.error(data.error || 'Registration failed.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Network error.');
    }
  };

  const login_user = async (email, password) => {
    toast.loading('Logging in...');
    try {
      const res = await fetch(`${api_url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      toast.dismiss();

      if (data.token) {
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        toast.success('Login successful');
        await fetch_and_set_current_user(data.token);
      } else {
        toast.error(data.error || 'Login failed.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Login failed.');
    }
  };

  const logout_user = () => {
    fetch(`${api_url}/logout`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Logged out');
          localStorage.removeItem('token');
          setCurrentUser(null);
          setAuthToken(null);
          navigate('/login');
        } else {
          toast.error('Logout failed');
        }
      });
  };

  const fetch_user_cases = async (role, user_id) => {
    let endpoint = null;
    if (role === 'client') endpoint = 'client/cases';
    else if (role === 'lawyer') endpoint = 'lawyer/cases';
    else if (role === 'admin') endpoint = 'admin/cases';
    else return;

    try {
      const res = await fetch(`${api_url}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserCases(data);
    } catch (err) {
      toast.error('Failed to fetch cases');
    }
  };

  const upload_document = async (caseId, file) => {
    const formData = new FormData();
    formData.append('documents', file);

    try {
      toast.loading('Uploading document...');
      const res = await fetch(`${api_url}/cases/${caseId}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      toast.dismiss();

      if (res.ok) toast.success('Document uploaded');
      else toast.error(data.error || 'Upload failed');
    } catch (err) {
      toast.dismiss();
      toast.error('Upload error');
    }
  };

  const context_data = {
    token,
    currentUser,
    setCurrentUser,
    userCases,
    setUserCases,
    isFirstTimeUser,
    register_user,
    login_user,
    logout_user,
    fetch_user_cases,
    upload_document,
    fetch_and_set_current_user, 
  };

  return (
    <UserContext.Provider value={context_data}>
      {children}
    </UserContext.Provider>
  );
};
