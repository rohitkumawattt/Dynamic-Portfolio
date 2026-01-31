import React, { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { useProfileContext } from "../context/profileContext";
import toast from "react-hot-toast";
import {Send} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
const Feedback = () => {
  const { theme } = useTheme();
  const { baseApi } = useProfileContext();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 0,
  });

  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(
        `${baseApi}/api/feedback/send`,
        formData,
      );
      if (response.data.success) {
        console.log("Feedback Sent Successfully : ", response.data);
        toast.success("Feedback Sent Successfully");
        setSending(false);
      } else {
        toast.error(response.data.message);
      }
      setFormData({
        name: "",
        message: "",
        rating: 0,
      });
      setRating(0);
    } catch (error) {
      console.log("Error Sending Feedback : ", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <section id="feedback" className="flex-1 p-2 md:p-0">
      <h2
        className={`bg-clip-text font-black text-transparent text-4xl bg-gradient-to-r ${theme.accent} mt-20 ml-5 md:ml-10 uppercase md:p-0`}
      >
        Rate Us :-
      </h2>
      <div className="py-8 md:px-10">
        {/* feedback form container */}
        <div className="w-full mb-12 md:mb-0">
          <div
            className={`p-10 md:p-14 rounded-xl border ${theme.border} ${theme.card} space-y-8 shadow-2xl transition-all duration-300 hover:shadow-current/5`}
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                Feedback
              </h2>
              <p className="text-sm opacity-60">
                Aapka anubhav mere liye bahut mahatvapurn hai.
              </p>
            </div>
            {/* feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* star rating  */}
              <div className="flex gap-6">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = hoverRating
                    ? star <= hoverRating
                    : star <= rating;
                  return (
                    <Star
                      key={star}
                      size={34}
                      onClick={() => {
                        setRating(star);
                        setFormData((prev) => ({
                          ...prev,
                          rating: star,
                        }));
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`cursor-pointer transition-all duration-300 ${active ? "fill-current text-current scale-110 shadow-current" : "opacity-20"} hover:scale-125`}
                    />
                  );
                })}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="Rohit kumawat"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="Write your thoughts..."
                ></textarea>
              </div>
              <button
                disabled={!rating || sending}
                type="submit"
                className={`w-full py-5 font-black uppercase text-[10px] tracking-widest  flex items-center justify-center gap-2 transition-all active:scale-95 duration-500 transform  ${rating ? `text-white bg-gradient-to-r ${theme.accent} hover:scale-[1.02] shadow-lg shadow-current/10 rounded-2xl` : "bg-gray-700 cursor-not-allowed rounded-none"}`}
              >
                {sending ? (
                  <>
                    <span className={`loading loading-spinner loading-md text-white`}></span>
                    Sending...
                  </>
                ) : ( <>
                Post review { rating ? <Send size={14} /> : ""}
                </>
                )}
              </button>
              {/* clear form button  */}
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  disabled={!rating || sending}
                  onClick={() => {
                    setRating(0);
                    setHoverRating(0);
                    setFormData({ name: "", email: "", message: "" });
                  }}
                  className={`mt-4 px-4 py-2 bg-gray-600 normal-color rounded-lg shadow-md  transition duration-300 ${
                    !rating
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-700"
                  }`}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
