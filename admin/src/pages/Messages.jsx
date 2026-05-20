import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { RefreshCw, MailOpen, Trash, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import DeletePop from "../components/DeletePop";
import MsgDetails from "../components/MsgDetails";
const Messages = () => {
  const [loading, setLoading] = useState(false);
  const { baseApi } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isSearchedMsg, setIsSearchedMsg] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState("message");

  // format the date into time or date as per msg come.
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if it's the same day, month, and year
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      // Show time (e.g., 6:43 PM)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Show date (e.g., Jan 17)
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // fetch messages
  const fetchMessage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApi}/api/messages`);
      if (response.data.success) {
        setMessages(response.data.messages);
        setLoading(false);
      }
      // console.log("MESSAGES FETCHED : ", response.data.messages);
    } catch (error) {
      console.error("ERROR FETCHING MESSAGES : ", error);
      setLoading(false);
    }
  };
  // fetch msg by id for searching
  const fetchMsgById = async (slug) => {
    // If the input is cleared, fetch all messages again
    if (!slug.trim()) {
      fetchMessage();
      setIsSearchedMsg(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseApi}/api/messages/search/${slug}`,
      );
      if (response.data.success) {
        setMessages(response.data.messages);
        // console.log("FETCHED MSG BY ID : ", response.data.messages);
        setLoading(false);
        setIsSearchedMsg(true);
      }
    } catch (error) {
      // Axios catches the 404 here
      if (error.response && error.response.status === 404) {
        setMessages([]); // Clear previous messages
        setIsSearchedMsg(false); // Trigger "no msg found" div
      } else {
        console.error("FETCHED MSG BY ID ERROR : ", error);
      }
      setLoading(false);
    }
  };
  // toggle the msg status
  const toggleMsgStatus = async (id) => {
    try {
      const response = await axios.patch(
        `${baseApi}/api/messages/status/${id}`,
      );
      if (response.data.success) {
        // console.log("TOGGLE MSG STATUS : ", response.data);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, status: !msg.status } : msg,
          ),
        );
      }
    } catch (error) {
      console.error("ERROR IN TOGGLE MSG STATUS : ", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === id ? { ...msg, status: !msg.status } : msg,
        ),
      );
    }
  };
  // mark msg as read
  const markMessageAsRead = async (id) => {
    try {
      const response = await axios.post(`${baseApi}/api/messages/status/${id}`);
      if (response.data.success) {
        // console.log("MARK MSG AS READ : ", response.data);
        setMessages((prev) =>
          prev.map(
            (msg) => (msg._id === id ? { ...msg, status: true } : msg), // Assuming true = read
          ),
        );
      }
    } catch (error) {
      console.error("ERROR IN MARK MSG AS READ : ", error);
    }
  };

  // delete msg function
  const deleteMessage = async () => {
    if (!selectedMsgId) return;
    try {
      const response = await axios.delete(
        `${baseApi}/api/messages/delete/${selectedMsgId}`,
      );
      if (response.data.success) {
        // Remove the message from the UI state
        setMessages((prev) => prev.filter((msg) => msg._id !== selectedMsgId));
        toast.success("Message deleted successfully");
        setShowDeletePop(false);
        setSelectedMsgId(null); // Close the popup
      }
    } catch (error) {
      console.error("ERROR DELETING MESSAGE:", error);
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-none">
        {/* delete component */}
        <DeletePop
          showDeletePop={showDeletePop}
          setShowDeletePop={setShowDeletePop}
          onDelete={deleteMessage}
        />
        {/* msg details  */}
        <MsgDetails
          showModel={showModel}
          setShowModel={setShowModel}
          selectedMsgId={selectedMsgId}
          messages={messages}
          selectedModel={selectedModel}
          formatMessageDate={formatMessageDate}
        />
        <h1 className="text-3xl font-bold text-center text-white">Messages</h1>
        {/* input and refresh button  */}
        <div className="flex justify-end items-center gap-2 mt-3">
          <span>
            <RefreshCw
              onClick={() => {
                setIsAnimating(true);
                fetchMessage();
                setTimeout(() => {
                  setIsAnimating(false);
                }, 500);
              }}
              className={`w-5 h-5 mr-2 cursor-pointer ${isAnimating ? "animate-spin" : ""}`}
            />
          </span>
          <input
            id="SearchMessage"
            onChange={(e) => fetchMsgById(e.target.value)}
            className="md:w-80 w-[70%] h-10 p-1 shadow-2xs shadow-blue-700 rounded-sm border border-blue-900 overflow-x-auto bg-slate-900 normal-color focus:outline-none"
            type="text"
            placeholder="Search Name, Email, Message..."
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-3 border-t border-t-blue-200">
        {loading ? (
          <div className="h-[200px] flex justify-center items-center mt-3">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div className="flex-1 mt-3">
            {isSearchedMsg ? (
              <>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg border border-dashed border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-lg max-w-md mx-auto mt-10 transition-all duration-300">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-125"></div>
                      <div className="relative p-4 bg-slate-800/80 rounded-full border border-blue-500/30 text-blue-400">
                        <Inbox className="w-10 h-10 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                    <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                      Your inbox is clean. When visitors contact you through your portfolio website, their messages will appear here.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isRead =
                      message.status === "read" || message.status === true;
                    return (
                      <div
                        key={message._id}
                        className={`flex items-center gap-3 md:gap-5 shadow-2xs shadow-blue-700 rounded-sm p-3 mb-2 border-b-blue-900 overflow-x-auto ${isRead ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
                      >
                        {/* Mobile → First letter */}
                        <span className="flex-none md:hidden w-8 h-8 rounded-full bg-primary flex items-center justify-center normal-color cursor-pointer">
                          {message.name?.charAt(0).toUpperCase()}
                        </span>
                        {/* Desktop → Full name */}
                        <span
                          onClick={() => markMessageAsRead(message._id)}
                          className={`flex-none w-20 md:w-32 font-bold normal-color truncate text-sm md:text-base hidden md:block cursor-pointer ${isRead ? "font-normal" : "font-bold"}`}
                        >
                          {message.name}
                        </span>

                        <p
                          onClick={() => {
                            markMessageAsRead(message._id);
                            setSelectedMsgId(message._id);
                            setSelectedModel("message");
                            setShowModel(true); // Added: trigger modal visibility
                          }}
                          className={`flex-5 min-w-0 line-clamp-1 normal-color cursor-pointer ${message.status ? "font-normal " : " font-bold"}`}
                        >
                          {message.message}
                        </p>
                        <div className="flex flex-col md:flex-row items-end md:items-center justify-end gap-2 md:gap-3 text-slate-500 ">
                          <span className="text-xs md:text-sm text-right whitespace-nowrap">
                            {formatMessageDate(message.createdAt)}
                          </span>
                          <div className="flex gap-3">
                            <span title="Mark as Read/Unread">
                              <MailOpen
                                onClick={() => toggleMsgStatus(message._id)}
                                size={18}
                                className="hover:text-blue-400 hover:scale-110 transition-all cursor-pointer"
                              />
                            </span>
                            <span title="Delete">
                              <Trash
                                onClick={() => {
                                  setSelectedMsgId(message._id);
                                  setShowDeletePop(true);
                                }}
                                size={18}
                                className="hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            ) : (
              <>
                <div className="w-full text-center text-gray-400 mt-10">
                  <p className="text-lg font-semibold">No messages found.</p>
                  <p className="text-sm">
                    Try searching for a different name or email.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
