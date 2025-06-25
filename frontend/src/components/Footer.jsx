import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-8">
      {/* Top Section: Contact and Socials */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Contact</h3>
          <p>Email: support@legalmanager.com</p>
          <p>Phone: +254 700 000 000</p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Follow Us:</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">X</a>
            <a href="#" className="hover:text-blue-400">LinkedIn</a>
          </div>
        </div>
      </div>

      
      <div className="mt-6 pt-4 border-t border-gray-700 text-center text-sm">
        &copy; 2025 Legal Case Manager. All rights reserved.
      </div>
    </footer>
  );
}


export default Footer;