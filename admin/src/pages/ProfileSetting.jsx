/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Instagram,
  SquarePen,
  Copy,
  Camera,
  PencilLine,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import axios from "axios";
import Resume from "../components/resume";
const ProfileSetting = () => {
  const { user, baseApi, usertoken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [userName, setUserName] = useState(user?.name || "");
  const [uploading, isUploading] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const [isAboutEdit, setIsAboutEdit] = useState(false);
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
  });
  const userId = "6904ba5ef21e4dc41182e1ff";
  const [editField, setEditField] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${baseApi}/api/user-profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      setUserProfile(response.data.profile[0]);
      // console.log("USER PROFILE FETCHED:", response.data.profile[0]);
      setAvatar(response.data.profile[0].avatar.url);
      setAbout(response.data.profile[0].about || "");
      setSocialLinks({
        github: response.data.profile[0].socialLinks?.github || "",
        linkedin: response.data.profile[0].socialLinks?.linkedin || "",
        instagram: response.data.profile[0].socialLinks?.instagram || "",
      });
    } catch (error) {
      console.error("ERROR IN USER PROFILE FETCHING:", error);
    }
  };

  const handleImageChange = async (e) => {
    isUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post(
        `${baseApi}/api/user-profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      if (response.data.success) {
        isUploading(false);
        // console.log("Uploaded image URL:", response.data.avatar);
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      isUploading(false);
      console.error("Upload failed", error);
    }
  };

  const handleSave = async () => {
    if (userName.trim() !== "") {
      setUserName(userName);
      // console.log("Username saved to state:", userName);
      setIsEdit(false);
    }
  };
  const handleAbout = async () => {
    if (about.trim() === "") {
      setIsAboutEdit(false);
      return;
    }
    try {
      const response = await axios.patch(
        `${baseApi}/api/user-profile/about`,
        {
          about,
        },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      // console.log("USER ABOUT: ", response.data);
      setIsAboutEdit(false);
    } catch (error) {
      console.error("ERROR IN USER ABOUT SAVING:", error);
    }
  };

  const handleSocialLinks = async () => {
    try {
      const response = await axios.patch(
        `${baseApi}/api/user-profile/social-media-links`,
        socialLinks,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      // console.log("SOCIAL LINKS UPDATED:", response.data);
      setEditField(null);
      toast.success("Social links updated!");
    } catch (error) {
      console.error("ERROR IN USER SOCIAL LINKS SAVING:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.id === "about") {
        if (!e.shiftKey) {
          // Save on Enter, but allow new line on Shift+Enter
          e.preventDefault();
          handleAbout();
          setIsAboutEdit(false);
        }
        return;
      }
      // Default behavior for Name input
      handleSave();
      setIsEdit(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    setUserName(user?.name || "");
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-white">
        Profile Setting
      </h1>
      {/* user name  */}
      <div className="flex-1 p-1 mt-3">
        <div className="h-full shadow-2xs shadow-blue-700 rounded-xl p-5 border border-blue-900 overflow-x-auto">
          <div className="relative flex flex-col items-center justify-center">
            {isEdit && (
              <input
                onChange={(e) => setUserName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                value={userName}
                id="userName"
                className="absolute top-0 right-0 p-2 shadow-2xs shadow-blue-700 rounded-sm border border-blue-900 overflow-x-auto bg-slate-900 normal-color focus:outline-none"
                type="text"
                placeholder="type new one.."
              />
            )}
            <div className="relative group">
              <img
                src={
                  avatar ||
                  "https://img.freepik.com/free-vector/illustration-businessman_53876-5840.jpg?w=2000"
                }
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover shadow-xl shadow-blue-600/10"
              />
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageChange}
                accept="image/*"
                required
                className="hidden" // Hide default input
              />
              <button
                onClick={() => {
                  document.getElementById("imageUpload").click();
                }}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors shadow-lg cursor-pointer"
              >
                {uploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <Camera size={18} className="text-white" />
                )}
              </button>
            </div>
            <h2
              onDoubleClick={() => setIsEdit(!isEdit)}
              title="double to edit"
              className="text-2xl font-bold primary-color mt-2 cursor-pointer"
            >
              {userName || "--------"}
            </h2>
            <p className="normal-color mt-1">{user.email}</p>
          </div>
        </div>
      </div>
      {/* about user and their social links  */}
      <div className="flex-1 p-1 mt-3">
        <div className="w-full md:flex gap-20">
          {/* about user div  */}
          <div className="flex-2 shadow-2xs shadow-blue-700 border border-blue-900 px-4 py-3 rounded-xl">
            <h1 className="flex items-center justify-between text-2xl font-bold text-white mt-2 border-b border-blue-300">
              About rohit{" "}
              <span>
                <SquarePen
                  onClick={() => setIsAboutEdit(!isAboutEdit)}
                  className="mr-2 cursor-pointer"
                />
              </span>
            </h1>
            {isAboutEdit ? (
              <textarea
                onChange={(e) => setAbout(e.target.value)}
                onBlur={() => {
                  if (isAboutEdit) handleAbout();
                }}
                onKeyDown={handleKeyDown}
                value={about}
                id="about"
                className="w-full p-2 mt-2 shadow-2xs shadow-blue-700 rounded-sm border border-blue-900 bg-slate-900 normal-color focus:outline-none min-h-[100px] resize-y"
                placeholder="type new one.."
                autoFocus
              />
            ) : (
              <p className="text-white mt-2 text-justify">
                {about || "--------"}
              </p>
            )}
          </div>
          {/* social media links  */}
          <div className="flex-1 shadow-2xs shadow-blue-700 border border-blue-900 px-4 py-3 rounded-xl mt-3 md:mt-0">
            <h1 className="text-2xl font-bold text-white mt-2 border-b border-blue-300">
              Social Media Links
            </h1>
            <div className="mt-2 w-full text-xl">
              {/* github  */}
              <div className="flex items-center justify-between border border-transparent hover:border hover:border-blue-900 transition-all duration-300 px-2 py-2 rounded-sm">
                {editField === "github" ? (
                  <input
                    value={socialLinks.github}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, github: e.target.value })
                    }
                    onBlur={handleSocialLinks}
                    onKeyDown={(e) => e.key === "Enter" && handleSocialLinks()}
                    className="bg-slate-900 text-white border-b border-blue-600 focus:outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="w-full normal-color flex items-center cursor-pointer">
                      <Github size={18} className="mr-2 text-white shrink-0" />
                      <span className="text-sm break-all whitespace-normal">
                        {socialLinks.github || "Github"}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <SquarePen
                        size={18}
                        className="mr-2 cursor-pointer hover:text-white"
                        onClick={() => setEditField("github")}
                      />
                      <Copy
                        size={18}
                        className="cursor-pointer hover:text-white transform transition-transform duration-150 active:scale-90"
                        onClick={() => {
                          navigator.clipboard.writeText(socialLinks.github);
                          toast.success("Github link copied!");
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* linkdin  */}
              <div className="flex items-center justify-between border border-transparent hover:border hover:border-blue-900 transition-all duration-300 px-3 py-2 rounded-sm">
                {editField === "linkedin" ? (
                  <input
                    value={socialLinks.linkedin}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    onBlur={handleSocialLinks}
                    onKeyDown={(e) => e.key === "Enter" && handleSocialLinks()}
                    className="bg-slate-900 text-white border-b border-blue-600 focus:outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="w-full overflow-hidden normal-color flex items-center cursor-pointer">
                      <Linkedin
                        size={18}
                        className="mr-2 text-blue-600 shrink-0"
                      />
                      <span className=" text-sm break-all whitespace-normal">
                        {socialLinks.linkedin || "Linkedin"}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <SquarePen
                        size={18}
                        className="mr-2 cursor-pointer hover:text-white"
                        onClick={() => setEditField("linkedin")}
                      />
                      <Copy
                        size={18}
                        className="cursor-pointer hover:text-white transform transition-transform duration-150 active:scale-90"
                        onClick={() => {
                          navigator.clipboard.writeText(socialLinks.linkedin);
                          toast.success("Linkedin link copied!");
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Instagram  */}
              <div className="flex items-center justify-between border border-transparent hover:border hover:border-blue-900 transition-all duration-300 px-3 py-2 rounded-sm">
                {editField === "instagram" ? (
                  <input
                    value={socialLinks.instagram}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        instagram: e.target.value,
                      })
                    }
                    onBlur={handleSocialLinks}
                    onKeyDown={(e) => e.key === "Enter" && handleSocialLinks()}
                    className="bg-slate-900 text-white border-b border-blue-600 focus:outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="w-full overflow-hidden normal-color flex items-center cursor-pointer">
                      <Instagram
                        size={18}
                        className="mr-2 text-pink-400 shrink-0"
                      />
                      <span className="text-sm break-all whitespace-normal">
                        {socialLinks.instagram || "Instagram"}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <SquarePen
                        size={18}
                        className="mr-2 cursor-pointer hover:text-white"
                        onClick={() => setEditField("instagram")}
                      />
                      <Copy
                        size={18}
                        className="cursor-pointer hover:text-white transform transition-transform duration-150 active:scale-90"
                        onClick={() => {
                          navigator.clipboard.writeText(socialLinks.instagram);
                          toast.success("Instagram link copied!");
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* resume Container */}
      <div className="flex-1 p-1 mt-3">
        <div className="w-full md:flex gap-20">
          {/* Resumne  */}
          <div className="flex-1 shadow-2xs shadow-blue-700 border border-blue-900 px-4 py-3 rounded-xl">
            <Resume />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
