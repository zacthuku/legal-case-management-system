import React from "react";
import {  Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import CreateCase from "./pages/CreateCase";
import Profile from "./pages/Profile";
import MyCases from "./pages/MyCases";
import { UserProvider } from './context/UserContext';

function App() {
  return (
  <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/cases" element={<Layout><Cases /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/users" element={<Layout><Users /></Layout>} />
        <Route path="/cases/new" element={<Layout><CreateCase /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/my-cases" element={<Layout><MyCases /></Layout>} />
       
      </Routes>

    </UserProvider>
  </BrowserRouter>
  );
}

export default App;
