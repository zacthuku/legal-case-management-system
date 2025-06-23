import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userCases, setUserCases] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [token, setAuthToken] = useState(() => localStorage.getItem("token"));

  // ========== Register ==========
  const register_user = (username, email, password, role) => {
    if (!username || !email || !password || !role) 
      return toast.error("Please fill in all fields.");

    toast.loading("Registering...");
    fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role })
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else if (data.success) {
          toast.success(data.success);
          navigate("/login");
        } else toast.error("Registration failed.");
      })
      .catch(err => {
        toast.dismiss();
        toast.error("Network error.");
        console.error(err);
      });
  };

  // ========== Login ==========
  const login_user = async (email, password) => {
    toast.loading("Logging in...");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      toast.dismiss();

      if (data.error) return toast.error(data.error);
      if (!data.token) return toast.error("No token received. Please check your login credentials.");

      const token = data.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      toast.success("Login successful");

      await fetch_and_set_current_user(token);
    } catch (err) {
      toast.dismiss();
      toast.error("Login failed due to network/server error.");
      console.error("Login error:", err);
    }
  };

  // ========== Fetch and Set Current User ==========
  const fetch_and_set_current_user = async (authToken = token) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/current_user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      const user = await res.json();

      if (user.msg || !user.id || !user.role) {
        toast.error("Failed to retrieve user info. Please try again.");
        return;
      }

      // Fetch profile separately
      const profileRes = await fetch("http://127.0.0.1:5000/profile", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const profileData = await profileRes.json();

      setCurrentUser({
        ...user,
        profile: profileData.profile || {}
      });

      const firstTimeKey = `first_time_${user.id}`;
      const isFirstTime = !localStorage.getItem(firstTimeKey);
      if (isFirstTime) localStorage.setItem(firstTimeKey, "false");
      setIsFirstTimeUser(isFirstTime);

      fetch_user_cases(user.role, user.id);

      if (["admin", "lawyer", "client"].includes(user.role)) navigate("/");
      else {
        toast.error("Unknown role. Access denied.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Error fetching user data.");
      console.error(err);
    }
  };

  // ========== Logout ==========
  const logout_user = () => {
    fetch("http://127.0.0.1:5000/logout", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(data.success);
          localStorage.removeItem("token");
          setAuthToken(null);
          setCurrentUser(null);
          setUserCases([]);
          navigate("/login");
        } else toast.error("Logout failed.");
      })
      .catch(err => {
        toast.error("Network error during logout");
        console.error(err);
      });
  };

  // ========== Fetch User Cases ==========
  const fetch_user_cases = async (role, user_id) => {
    if (!token) return;

    let endpoint = null;
    if (role === "client") endpoint = "client/cases";
    else if (role === "lawyer") endpoint = "lawyer/cases";
    else if (role === "admin") endpoint = "admin/cases";
    else return toast.error("Invalid role");

    try {
      const res = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserCases(data);
    } catch (err) {
      console.error("Error loading cases:", err);
      toast.error("Failed to fetch cases.");
    }
  };

  // ========== Upload Document ==========
  const upload_document = async (caseId, file) => {
  if (!caseId || !file) return toast.error("Case ID and document are required.");

  const formData = new FormData();
  formData.append("documents", file);

  try {
    toast.loading("Uploading document...");

    const res = await fetch(`http://127.0.0.1:5000/cases/${caseId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
        
      },
      body: formData
    });

    const data = await res.json();
    toast.dismiss();

    if (res.ok && !data.error) {
      toast.success("Document uploaded successfully.");
      return data;
    } else {
      toast.error(data.error || "Document upload failed.");
    }
  } catch (err) {
    toast.dismiss();
    console.error("Document upload error:", err);
    toast.error("Error uploading document.");
  }
};


  
  const context_data = {
    token,
    currentUser,
    userCases,
    setUserCases,
    register_user,
    login_user,
    logout_user,
    fetch_user_cases,
    isFirstTimeUser,
    setCurrentUser,
    upload_document
  };

  return (
    <UserContext.Provider value={context_data}>
      {children}
    </UserContext.Provider>
  );
};
