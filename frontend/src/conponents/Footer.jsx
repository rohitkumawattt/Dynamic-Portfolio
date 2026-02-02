import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileContext } from "../context/profileContext";
const Footer = () => {
  const { theme } = useTheme();
  const { profile } = useProfileContext();
  return (
    <footer id="footer"
      className={`mt-24 py-16 px-6 border-t ${theme.border} text-center space-y-10`}
    >
      <div className="flex justify-center gap-12">
        <span>
          <Link to={profile?.socialLinks?.github} target="true">
            <Github
              size={24}
              className="opacity-40 hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
            />
          </Link>
        </span>
        <span>
          <Link to={profile?.socialLinks?.linkedin} target="true">
             <Linkedin
            size={24}
            className="opacity-40 hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
          />
          </Link>
        </span>
        <span>
          <Link to={profile?.socialLinks?.instagram} target="true">
            <Instagram
            size={24}
            className="opacity-40 hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
          />
          </Link>
          
        </span>
        <span>
          <a href={"https://mail.google.com/mail/?view=cm&fs=1&to=rohitmaroth3@gmail.com"} target="_blank" rel="noopener noreferrer">
            <Mail
            size={24}
            className="opacity-40 hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
          />
          </a>
            
          
        </span>
      </div>
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">
          Architected by Rohit Kumawat
        </p>
        <p className="text-[10px] font-medium opacity-20">
          © {new Date().getFullYear()} All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;

{
  /* <div className="socal-icons preload-hidden flex gap-4 text-3xl text-white">
            <span>
              <Link to={profile?.socialLinks?.linkedin} target="true">
                <CiLinkedin className="hover:scale-110 duration-300 cursor-pointer text-blue-600" />
              </Link>
            </span>
            <span>
              <Link to={profile?.socialLinks?.github} target="true">
                <FaGithub className="hover:scale-110 duration-300 cursor-pointer text-white" />
              </Link>
            </span>
            <span>
              <Link to={profile?.socialLinks?.instagram} target="true">
                <FaInstagram className="hover:scale-110 duration-300 cursor-pointer text-pink-600" />
              </Link>
            </span>
          </div> */
}
