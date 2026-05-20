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
        className={`w-full min-h-screen flex flex-col justify-center items-center pt-16 ${theme.text}`}
      >
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-evenly items-center md:flex-row-reverse md:justify-evenly md:items-center px-6 py-10 gap-8 md:gap-0">
          {/* Profile Image Wrapper */}
          <div className="w-full md:w-[35%] lg:w-[30%] flex justify-center items-center">
            <div
              className={`profile-img w-36 h-36 flex justify-center items-center bg-cover bg-center md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-r ${theme.accent} ${theme.dropShadow}`}
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
          </div>

          {/* Text Content */}
          <div className="w-full flex flex-col justify-center items-center md:items-start gap-4 px-4 md:w-[60%] lg:w-[65%] text-justify">
            <h1
              className="intro-title text-2xl md:text-5xl font-light text-center md:text-left"
              style={{ visibility: "hidden" }}
            >
              Hello, I'm{" "}
              <span
                className={`bg-clip-text font-black text-transparent bg-gradient-to-r ${theme.accent}`}
              >
                {profile?.name || user?.name}
              </span>
            </h1>

            <p
              ref={introRef}
              className="about text-xl text-justify md:text-left md:text-lg leading-relaxed"
              style={{ visibility: "hidden" }}
            >
              {profile?.about}
            </p>

            {/* Social Icons / Button Container */}
            <div
              className="social-icons flex gap-4 mt-4"
              style={{ visibility: "hidden" }}
            >
              <a href="#footer">
                <button
                  className={`contact-btn flex items-center gap-3 px-10 py-4 rounded-full font-bold uppercase text-xs text-white transition-all hover:scale-105 bg-gradient-to-r ${theme.accent} shadow-lg group cursor-pointer`}
                >Contact Me
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
