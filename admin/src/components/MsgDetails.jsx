import React from "react";
import { IoMdClose } from "react-icons/io";
import { Mail, User } from "lucide-react";
const MsgDetails = ({
  showModel,
  selectedMsgId,
  setShowModel,
  messages,
  formatMessageDate,
}) => {
  const msg = messages?.find((m) => m._id === selectedMsgId);
  if (!msg) return null;
  return (
    <div
      className={`fixed inset-0 w-full h-full flex items-center justify-center z-100 transition-all duration-300 ${
        showModel
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* backdrop style  */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowModel(false)}
      ></div>
      {/* model content  */}
      <div className="relative w-[95%] md:w-[600px] max-h-[80vh] overflow-hidden border border-blue-900 bg-slate-900 p-6 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-blue-800 pb-4">
          <h2 className="text-xl font-bold normal-color flex items-center gap-2">
            <Mail className="primary-color" size={20} />
            Message Details
            <span className="text-xs md:text-sm font-normal underline text-right whitespace-nowrap">
              {formatMessageDate(msg.createdAt)}
            </span>
          </h2>
          <button
            onClick={() => setShowModel(false)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <IoMdClose size={28} />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 normal-color">
              <span className="flex items-center gap-2 font-semibold min-w-[100px]">
                <User size={16} /> From:
              </span>
              <span>{msg.name}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 normal-color">
              <span className="flex items-center gap-2 font-semibold min-w-[100px]">
                <Mail size={16} /> Email:
              </span>
              <span className="break-all">
                {msg.email || "No email provided"}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-4 mt-2">
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">
                Message
              </p>
              <p className="normal-color leading-relaxed whitespace-pre-wrap text-base">
                {msg.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setShowModel(false)}
            className="bg-primary normal-color px-6 py-2 rounded-md transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MsgDetails;
