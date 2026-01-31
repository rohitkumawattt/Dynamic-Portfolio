import React, { useEffect, useState } from "react";
import axios from "axios";

const baseApi =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://dynamic-portfolio-backend-694e.onrender.com";
const userId = "6904ba5ef21e4dc41182e1ff";
const profileContext = React.createContext(null);

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState([]);
  const [user, setUser] = useState({});
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // fetching userPropfile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${baseApi}/api/user-profile/${userId}`);
      setProfile(response.data.profile[0]);
      setUser(response.data.profile[0].user);
      // console.log("USER : ", response.data.profile[0].user);
      // console.log("USER PROFILE", response.data.profile[0]);
    } catch (error) {
      console.log("ERROR WHILE FETCHING USER PROFILE", error);
    }
  };
  // fetch skills

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${baseApi}/api/skills`);
      // console.log("SKILLS", response.data.skills);
      setSkills(response.data.skills);
    } catch (error) {
      console.log("ERROR WHILE FETCHING SKILLS", error);
    }
  };

  // fetching projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/api/projects`);
      // console.log("PROJECTS", response.data.projects);
      setProjects(response.data.projects);
    } catch (error) {
      console.log("ERROR WHILE FETCHING PROJECTS", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    fetchSkills();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (user && profile && projects.length > 0 && skills.length > 0) {
      setIsReady(true);
    }
  }, [user, profile, projects, skills]);

  return (
    <profileContext.Provider
      value={{ profile, user, skills, projects, baseApi, isReady }}
    >
      {children}
    </profileContext.Provider>
  );
};

export const useProfileContext = () => {
  return React.useContext(profileContext);
};
