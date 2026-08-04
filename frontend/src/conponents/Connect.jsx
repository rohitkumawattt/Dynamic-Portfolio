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
    setSending(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseApi}/api/messages/send`,
        formData
      );
      if (response.data.success) {
        console.log("MSG SENT SUCCESSFULLT : ", response.data);
        toast.success("Message sent successfully!");
        setSending(false);
      }
      // Clear form fields
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("ERROR WHILE SENDING MSG : ", error);
      toast.error(error.response.data.message);
      setSending(false);
    }
  };
  return (
    <section id="connect" className="flex-1 p-2 md:p-0">
      <h2 className={`bg-clip-text font-black text-transparent text-4xl bg-gradient-to-r ${theme.accent} mt-20 ml-5 md:ml-10 uppercase `}>
        Get In Touch:-
      </h2>
      <div className="py-8 md:px-10">
        <div className="w-full mb-12 md:mb-0">
          <div className={`p-10 md:p-14 rounded-xl border ${theme.border} ${theme.card} space-y-8 shadow-2xl transition-all duration-300 hover:shadow-current/5`}>
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                Work together
              </h2>
              <p className="text-sm opacity-60">
                send me the message
              </p>
            </div>
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                {/* full name  */}
                <label
                  htmlFor="name"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4"
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
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="Rohit kumawat"
                />
              </div>
              {/* email id  */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4"
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
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="hello@example.com"
                />
              </div>
              {/* text box  */}
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
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all ${theme.input}`}
                  placeholder="Tell me about your project or idea..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.message}
                className={`w-full py-5 font-black uppercase text-[10px] tracking-widest  flex items-center justify-center gap-2 transition-all active:scale-95 duration-500 transform  ${formData.name || formData.email || formData.message ? `text-white bg-gradient-to-r ${theme.accent} hover:scale-[1.02] shadow-lg shadow-current/10 rounded-2xl` : "bg-gray-700 cursor-not-allowed rounded-none"}`}
              >
                {sending ? (
                  <>
                    <span className={`loading loading-spinner loading-md ${theme.text}`}></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Inquiry  {formData.name || formData.email || formData.message ? <Send size={14} /> : ""}
                  </>

                )}
              </button>
              {/* clear form button  */}
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  disabled={!formData.name && !formData.email && !formData.message}
                  onClick={() => setFormData({ name: "", email: "", message: "" })}
                  className={`mt-4 px-4 py-2 bg-gray-600 normal-color rounded-lg shadow-md  transition duration-300 ${!formData.name && !formData.email && !formData.message ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-700"}`}
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
