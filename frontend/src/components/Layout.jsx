import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Outlet />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;