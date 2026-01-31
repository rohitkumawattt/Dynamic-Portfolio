/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { masterTL } from "../gsap/masterTimeline.js";
import { useProfileContext } from "../context/profileContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Header = () => {
  const { user, profile } = useProfileContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { theme } = useTheme();
  const introRef = useRef(null);

  const optimizeCloudinaryUrl = (url) => {
    if (!url) return "";
    // return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,c_fill/");
    return url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_500,c_thumb,g_face/",
    );
  };

  useGSAP(() => {
    if (!imageLoaded) return;

    const tl = gsap.timeline();
    const split = new SplitType(introRef.current, {
      types: "lines",
      lineClass: "line-of-text",
    });

    // Ensure all elements are visible before animating
    gsap.set(
      [
        ".profile-img",
        ".intro-title",
        ".about",
        ".social-icons",
        ".contact-btn",
      ],
      {
        visibility: "visible",
        opacity: 1,
      },
    );

    tl.from(".profile-img", {
      scale: 0,
      opacity: 0,
      duration: 0.7,
      ease: "back.out(1.5)",
    })
      .from(".intro-title", { y: 40, opacity: 0, duration: 0.5 })
      .from(split.lines, { y: 40, opacity: 0, stagger: 0.08, duration: 0.5 })
      // Updated selector to match the class added below
      .from(".contact-btn", {
        y: 30, // Changed from -30 to 30 for a better "pop up" feel
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

    masterTL.add(tl);
  }, [imageLoaded]);

  return (
    <header>
      <div
        id="home"
        className={`w-full h-[100vh] flex justify-center items-start ${theme.text}`}
      >
        <div className="w-full flex flex-col justify-start items-center gap-7 md:py-5 py-16 md:h-[550px] md:flex-row-reverse md:justify-evenly md:items-center mt-15">
          {/* Profile Image  */}
          <div
            className={`profile-img w-36 h-36 flex justify-center items-center bg-cover bg-center md:w-72 md:h-72 rounded-full bg-gradient-to-r ${theme.accent} ${theme.dropShadow}`}
            style={{ visibility: "hidden" }} // Initial state for GSAP
          >
            {!imageLoaded && (
              <div className="absolute inset-0 w-full h-full bg-slate-800 animate-pulse rounded-full z-10" />
            )}
            <img
              className="w-full h-full rounded-full object-cover"
              src={optimizeCloudinaryUrl(profile?.avatar?.url)}
              alt={profile?.name || "Profile"}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Text Content */}
          <div className="w-full flex flex-col justify-center items-center gap-4 px-4 md:w-[50%]">
            <h1
              className="intro-title text-2xl md:text-5xl font-light"
              style={{ visibility: "hidden" }}
            >
              Hello, I'm
              <span
                className={`bg-clip-text font-black text-transparent bg-gradient-to-r ${theme.accent}`}
              >
                {" "}
                {profile?.name || user?.name}
              </span>
            </h1>

            <p
              ref={introRef}
              className="about text-sm text-center md:text-justify md:text-lg leading-relaxed"
              style={{ visibility: "hidden" }}
            >
              {profile?.about}
            </p>

            {/* Social Icons / Button Container */}
            <div
              className="social-icons flex gap-4 mt-4"
              style={{ visibility: "hidden" }}
            >
              <button
                className={`contact-btn flex items-center gap-3 px-10 py-4 rounded-full font-bold uppercase text-xs text-white transition-all hover:scale-105 bg-gradient-to-r ${theme.accent} shadow-lg group cursor-pointer`}
              >
                <a href="#footer">Contact Me</a>
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
