import React, { useState } from "react";
import axios from "axios";
import { useProfileContext } from "../context/profileContext";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Connect = () => {
  const { theme } = useTheme();
  const { baseApi } = useProfileContext();
  const [sending, setSending] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(
        `${baseApi}/api/messages/send`,
        formData
      );
      if (response.data.success) {
        console.log("MSG SENT SUCCESSFULLY : ", response.data);
        toast.success("Message sent successfully!");
      }
      // Clear form fields
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("ERROR WHILE SENDING MSG : ", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="connect" className="w-full flex-1 px-4 py-6 md:p-0">
      <h2
        className={`bg-clip-text font-black text-transparent text-3xl md:text-4xl bg-gradient-to-r ${theme.accent} mt-8 md:mt-20 mx-2 md:ml-10 uppercase`}
      >
        Get In Touch:-
      </h2>
      <div className="py-6 md:py-8 md:px-10 w-full">
        <div className="w-full mb-12 md:mb-0">
          <div
            className={`p-5 sm:p-8 md:p-14 rounded-2xl md:rounded-xl border ${theme.border} ${theme.card} space-y-6 md:space-y-8 shadow-2xl transition-all duration-300 hover:shadow-current/5 w-full`}
          >
            <div className="space-y-1 md:space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">
                Work together ?
              </h2>
              <p className="text-sm opacity-60">Send me the message</p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {/* Full Name */}
              <div className="space-y-1 w-full">
                <label
                  htmlFor="name"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 md:ml-4 block"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3.5 sm:px-6 sm:py-4 rounded-xl md:rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="Rohit kumawat"
                />
              </div>

              {/* Email ID */}
              <div className="space-y-1 w-full">
                <label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 md:ml-4 block"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3.5 sm:px-6 sm:py-4 rounded-xl md:rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="hello@example.com"
                />
              </div>

              {/* Text Box */}
              <div className="space-y-1 w-full">
                <label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 md:ml-4 block"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3.5 sm:px-6 sm:py-4 rounded-xl md:rounded-2xl outline-none transition-all resize-none ${theme.input}`}
                  placeholder="Have a project in mind or just want to say hi? Drop a message..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !formData.name || !formData.email || !formData.message || sending
                }
                className={`w-full py-4 sm:py-5 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 duration-300 transform ${formData.name && formData.email && formData.message
                  ? `text-white bg-gradient-to-r ${theme.accent} hover:scale-[1.01] shadow-lg rounded-xl md:rounded-2xl cursor-pointer`
                  : "bg-gray-700 cursor-not-allowed opacity-60 rounded-xl md:rounded-2xl text-gray-300"
                  }`}
              >
                {sending ? (
                  <>
                    <span
                      className={`loading loading-spinner loading-md ${theme.text}`}
                    ></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Inquiry{" "}
                    {formData.name || formData.email || formData.message ? (
                      <Send size={14} />
                    ) : (
                      ""
                    )}
                  </>
                )}
              </button>

              {/* Clear Form Button */}
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  disabled={
                    !formData.name && !formData.email && !formData.message
                  }
                  onClick={() =>
                    setFormData({ name: "", email: "", message: "" })
                  }
                  className={`mt-2 px-4 py-2 text-xs font-semibold bg-gray-600 text-white rounded-lg shadow-md transition duration-300 ${!formData.name && !formData.email && !formData.message
                    ? "opacity-50 cursor-not-allowed"
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

export default Connect;