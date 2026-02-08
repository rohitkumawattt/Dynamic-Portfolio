import React from "react";
import { useState } from "react";
import { RefreshCw, MailOpen, Trash } from "lucide-react";
import { useAuth } from "../context/authContext";
import DeletePop from "../components/DeletePop";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Feedback = () => {
  const [loading, setLoading] = useState(false);
  const { baseApi } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSearchedFeedback, setIsSearchedFeedback] = useState(true);
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  // format the date into time or date as per feedabck come.
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

  // fetch feedback
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApi}/api/feedback`);
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
        setLoading(false);
        // console.log("FEEDBACK FETCHED : ", response.data.feedbacks);
      }
    } catch (error) {
      console.error("ERROR FETCHING FEEDBACK : ", error);
      setLoading(false);
    }
  };
  // fetch feedback by slug
  const fetchFeedbackById = async (slug) => {
    // If the input is cleared, fetch all messages again
    if (!slug.trim()) {
      fetchFeedback();
      setIsSearchedFeedback(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseApi}/api/feedback/search/${slug}`,
      );
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
        setLoading(false);
        // console.log("FETCHED FEEDBACK BY ID : ", response.data);
        setIsSearchedFeedback(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFeedbacks([]); // Clear previous messages
        setIsSearchedFeedback(false); // Trigger "no msg found" div
      } else {
        console.error("FETCHED FEEDBACK BY ID ERROR : ", error);
      }
      setLoading(false);
    }
  };

  // toggle the feedback status
  const toggleFeedbackStatus = async (id) => {
    try {
      const response = await axios.post(
        `${baseApi}/api/feedback/status/${id}`,
      );
      if (response.data.success) {
        // console.log("TOGGLE FEEDBACK STATUS : ", response.data);
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback._id === id
              ? { ...feedback, status: !feedback.status }
              : feedback,
          ),
        );
      }
    } catch (error) {
      console.error("ERROR IN TOGGLE FEEDBACK STATUS : ", error);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback._id === id
            ? { ...feedback, status: !feedback.status }
            : feedback,
        ),
      );
    }
  };
  // delete feedback function
  const deleteFeedback = async () => {
    if (!selectedFeedbackId) return;
    try {
      const response = await axios.delete(
        `${baseApi}/api/feedback/delete/${selectedFeedbackId}`,
      );
      if (response.data.success) {
        // Remove the feedback from the UI state
        setFeedbacks((prev) =>
          prev.filter((feedback) => feedback._id !== selectedFeedbackId),
        );
        toast.success("Feedback deleted successfully");
        setShowDeletePop(false);
        setSelectedFeedbackId(null); // Close the popup
      }
    } catch (error) {
      console.error("ERROR DELETING FEEDBACK:", error);
      toast.error("Failed to delete feedback");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-none">
        {/* delete component */}
        <DeletePop
          showDeletePop={showDeletePop}
          setShowDeletePop={setShowDeletePop}
          onDelete={deleteFeedback}
        />
        <h1 className="text-3xl font-bold text-center text-white">Feedback</h1>
        {/* input and refresh button  */}
        <div className="flex justify-end items-center gap-2 mt-3">
          <span>
            <RefreshCw
              onClick={() => {
                setIsAnimating(true);
                fetchFeedback();
                setTimeout(() => {
                  setIsAnimating(false);
                }, 500);
              }}
              className={`w-5 h-5 ml-2 cursor-pointer ${
                isAnimating ? "animate-spin" : ""
              }`}
            />
          </span>
          <input
            id="SearchFeedback"
            onChange={(e) => fetchFeedbackById(e.target.value)}
            className="w-40 h-10 p-1 shadow-2xs shadow-blue-700 rounded-sm border border-blue-900 overflow-x-auto bg-slate-900 normal-color focus:outline-none"
            type="text"
            placeholder="Search of Feedback"
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
            {isSearchedFeedback ? (
              <>
                {feedbacks.map((feedback) => {
                  const isRead =
                    feedback.status === "read" || feedback.status === true;
                  return (
                    <div
                      key={feedback._id}
                      className={`w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md rounded-xl p-4 sm:p-5 border border-blue-900 mb-4 
  ${isRead ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
                    >
                      {/* LEFT SIDE (TEXT CONTENT) */}
                      <div className="flex-1 min-w-0">
                        <h2 className="primary-color text-sm sm:text-base">
                          Name:{" "}
                          <span className="text-white break-words">
                            {feedback.name}
                          </span>
                        </h2>

                        <h2 className="primary-color text-sm sm:text-base mt-1">
                          Message:{" "}
                          <span className="text-white break-words">
                            {feedback.message}
                          </span>
                        </h2>

                        <h2 className="primary-color text-sm sm:text-base mt-1">
                          Rating:{" "}
                          <span className="text-white">{feedback.rating}</span>
                        </h2>
                      </div>

                      {/* RIGHT SIDE (DATE + ACTIONS) */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto">
                        {/* Date */}
                        <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                          {formatMessageDate(feedback.createdAt)}
                        </span>

                        {/* Icons */}
                        <div className="flex gap-4">
                          <span title="Mark as Read/Unread">
                            <MailOpen
                              onClick={() => toggleFeedbackStatus(feedback._id)}
                              size={18}
                              className="hover:text-blue-400 hover:scale-110 transition-all cursor-pointer"
                            />
                          </span>

                          <span title="Delete">
                            <Trash
                              onClick={() => {
                                setSelectedFeedbackId(feedback._id);
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
                })}
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

export default Feedback;
