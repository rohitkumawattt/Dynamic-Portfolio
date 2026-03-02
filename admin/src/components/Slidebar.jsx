import React from "react";
import { Navigate, Link } from "react-router-dom";

const Slidebar = () => {
  return (
    <div className="w-64 h-full overflow-y-auto normal-color shadow-2xl shadow-blue-700 rounded-xl p-5 border border-blue-900">
      <div className="py-2 px-3 border-b">
        <h1 className="text-3xl text-center uppercase">Menu</h1>
      </div>
      <div className="">
        <ul className="text-lg cursor-pointer">
          <Link to="/dashboard">
            <li className="h-12 leading-none py-3 px-3 border-b hover:scale-105 duration-200">
              Dashboard
            </li>
          </Link>
          <Link to="/projects">
            <li className="h-12 leading-none py-3 px-3 border-b hover:scale-105 duration-200">
              Projects
            </li>
          </Link>
          <Link to="/skills">
            <li className="h-12 leading-none py-3 px-3 border-b hover:scale-105 duration-200">
              Skills
            </li>
          </Link>
          <Link to="/messages">
            <li className="h-12 leading-none py-3 px-3 border-b hover:scale-105 duration-200">
              Messages
            </li>
          </Link>
          <Link to="/profile-setting">
            <li className="h-12 leading-none py-3 px-3 border-b hover:scale-105 duration-200">
              Profile Setting
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
