import React from "react";
import { IoMdClose } from "react-icons/io";
import { TriangleAlert } from "lucide-react";
const DeletePop = ({ showDeletePop, setShowDeletePop, onDelete }) => {
  return (
    <div
      className={`fixed inset-0 w-full h-full flex items-center justify-center z-100 transition-all duration-300 ${showDeletePop ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
    >
      {/* backdrop style  */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => showDeletePop(false)}
      ></div>
      <div className="relative w-[95%] md:w-[600px] max-h-[80vh] overflow-hidden border border-blue-900 bg-slate-900 p-6 rounded-xl shadow-2xl flex flex-col">
        <button
          onClick={() => setShowDeletePop(false)}
          className="normal-color cursor-pointer text-3xl absolute top-4 right-8"
        >
          <IoMdClose />
        </button>
        <h2 className="flex items-center text-2xl font-bold mb-4 normal-color">
          <span className="mr-1">
            <TriangleAlert color="#ffd500" />
          </span>
          Confirmation
        </h2>
        <p className="mb-6 normal-color">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>
        <div className="w-full flex items-center justify-end gap-4">
          <button
          onClick={() => setShowDeletePop(false)}
           className="bg-white text-black font-medium rounded-sm py-1 px-3 text-xl cursor-pointer active:scale-90">
            No
          </button>
          <button
          onClick={onDelete}
           className="bg-primary text-black font font-medium rounded-sm py-1 px-3 text-xl cursor-pointer active:scale-90">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePop;
