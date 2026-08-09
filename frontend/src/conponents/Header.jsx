/* eslint-disable no-unused-vars */
import React, { useRef, useState, useLayoutEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { masterTL } from "../gsap/masterTimeline.js";
import { useProfileContext } from "../context/profileContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Header = () => {
  const { user, profile } = useProfileContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const introRef = useRef(null);
  const containerRef = useRef(null);

  const aboutText = profile?.about || "";
  const isLongText = aboutText.length > 150;

  const optimizeCloudinaryUrl = (url) => {
    if (!url) return "frontend/src/assets/rohit_image.jpg";
    return url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_500,c_thumb,g_face/",
    );
  };

  useGSAP(
    () => {
      if (!imageLoaded) return;

      const split = new SplitType(introRef.current, {
        types: "lines",
        lineClass: "line-of-text",
      });

      // Ensure all elements are set for clean entrance
      gsap.set(
        [
          ".profile-img",
          ".intro-title",
          ".about",
          ".see-more-btn",
          ".social-icons",
        ],
        {
          visibility: "visible",
        },
      );

      const tl = gsap.timeline();

      tl.from(".profile-img", {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.5)",
      })
        .from(
          ".intro-title",
          { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          split.lines,
          {
            y: 25,
            opacity: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        )

      // Add See All Button to animation sequence if long text exists
      if (isLongText) {
        tl.from(
          ".see-more-btn",
          {
            y: 15,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.1",
        );
      }

      tl.from(
        ".social-icons",
        {
          y: 25,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2",
      );

      masterTL.add(tl);
    },
    { scope: containerRef, dependencies: [imageLoaded, aboutText] },
  );

  return (
    <header ref={containerRef}>
      <div
        id="home"
        className={`w-full min-h-screen flex flex-col justify-center items-center pt-16 ${theme.text}`}
      >
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-evenly items-center md:flex-row-reverse md:justify-evenly md:items-center px-4 sm:px-6 py-10 gap-8 md:gap-0">

          {/* Profile Image Wrapper */}
          <div className="w-full md:w-[35%] lg:w-[30%] flex justify-center items-center">
            <div
              className={`profile-img w-36 h-36 flex justify-center items-center bg-cover bg-center md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-r ${theme.accent} ${theme.dropShadow}`}
              style={{ visibility: "hidden" }}
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
          <div className="w-full flex flex-col justify-center items-center md:items-start gap-4 px-2 sm:px-4 md:w-[60%] lg:w-[65%]">
            <h1
              className="intro-title text-2xl md:text-5xl font-light text-center md:text-left"
              style={{ visibility: "hidden" }}
            >
              Hello, I'm &nbsp;
              <span
                className={`bg-clip-text font-black text-transparent bg-gradient-to-r ${theme.accent}`}
              >
                {profile?.name || user?.name}
              </span>
            </h1>

            <div className="w-full flex flex-col items-center md:items-start">
              {/* Animated Paragraph Wrapper */}
              <div
                className={`w-full transition-all duration-500 ease-in-out ${isLongText && !isExpanded
                    ? "max-h-[85px] sm:max-h-[100px] overflow-hidden md:max-h-none"
                    : "max-h-[1000px]"
                  }`}
              >
                <p
                  ref={introRef}
                  className="about text-sm sm:text-base md:text-lg text-justify md:text-left leading-relaxed"
                  style={{ visibility: "hidden" }}
                >
                  {aboutText}
                </p>
              </div>

              {/* See All / See Less Button - Mobile Only */}
              {isLongText && (
                <div
                  className="see-more-btn flex justify-center md:hidden w-full mt-2"
                  style={{ visibility: "hidden" }}
                >
                  <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group hover:opacity-90 active:scale-95"
                  >
                    <span
                      className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.accent} font-bold underline underline-offset-4 decoration-purple-500/30`}
                    >
                      {isExpanded ? "See Less" : "See All..."}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 text-purple-400 ${isExpanded
                          ? "rotate-180"
                          : "group-hover:translate-y-0.5"
                        }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Social Icons / Contact Button Container */}
            <div
              className="social-icons flex gap-4 mt-2 sm:mt-4"
              style={{ visibility: "hidden" }}
            >
              <a href="#footer">
                <button
                  className={`contact-btn flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold uppercase text-xs text-white transition-all hover:scale-105 bg-gradient-to-r ${theme.accent} shadow-lg group cursor-pointer`}
                >
                  Contact Me
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