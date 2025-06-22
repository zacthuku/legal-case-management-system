import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-8 flex flex-col md:flex-row justify-between gap-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Contact</h3>
        <p>Email: support@legalmanager.com</p>
        <p>Phone: +254 700 000 000</p>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
        <div className="space-x-4">
          <a href="#" className="hover:text-blue-400">Facebook</a>
          <a href="#" className="hover:text-blue-400">Twitter</a>
          <a href="#" className="hover:text-blue-400">LinkedIn</a>
        </div>
      </div>
      <div className="text-center w-full pt-4 border-t border-gray-700 text-sm md:text-right md:border-none md:pt-0">
        &copy; 2025 Legal Case Manager. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;