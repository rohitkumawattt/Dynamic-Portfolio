import React, { useEffect, useRef, useState } from "react";
import menu from "../assets/menu.svg";
import cross from "../assets/cross.svg";
import Rohit from "../assets/rohit_image_copy.jpg";
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
const Navbar = () => {
  const { logout, user } = useAuth();
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const accept = () => {
    logout();
    toast.success("Logout Successful");
    navigate("/login");
  };

  const reject = () => {
    toast.error("Logout Failed");
  };
  const confirmLogOut = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
    setIsOpen(false);
  };
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/projects", label: "Projects" },
    { to: "/skills", label: "Skills" },
    { to: "/messages", label: "Messages" },
    { to: "/profile-setting", label: "Profile Setting" }, 
  ];

  return (
    <div className="z-50 shadow-md">
      <nav className="flex justify-between items-center py-4 px-10">
        <div className="flex items-center gap-3">
          <img
            src={Rohit}
            alt="Rohit Kumawat"
            className="w-12 h-12 hidden md:block rounded-full centre no bg-repeat bg-cover"
          />
          <h1 className="logo primary-color font-bold md:text-2xl sm-text-xl cursor-pointer">
            {user?.name || "User"}
          </h1>
        </div>
        {/* logout button  */}
        <div>
          <ConfirmDialog />
          <button
            onClick={confirmLogOut}
            className="w-full hidden md:flex items-center justify-center p-3 rounded-xl font-medium text-red-400 bg-gray-700 hover:bg-red-600 hover:text-white transition duration-200 ease-in-out cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Logout
          </button>
        </div>
        <div className="w-10 h-7 flex justify-center items-center bg-[#9c85bd] rounded-sm md:hidden">
          <img
            src={menu}
            alt="Menu button"
            className="text-3xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </nav>
      {isOpen && (
        <div
          className={`w-64 h-full side-items flex flex-col md:hidden fixed top-0 right-0 gap-3 text-[20px]  pl-4 backdrop-style shadow-2xl z-50 pt-20 transition-transform transform duration-500 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-9 h-9 flex justify-center items-center bg-[#9c85bd] absolute right-10 top-4 rounded-full md:hidden cross">
            <img
              src={cross}
              alt="Menu button"
              className="text-3xl cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
          <ul className="text-lg cursor-pointer text-white">
            {menuItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                <li className="h-12 py-3 px-3 border-b hover:bg-[#b59fd4] duration-200">
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>
            <button
              onClick={confirmLogOut}
              className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-600 hover:text-white transition duration-200 ease-in-out cursor-pointer"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
