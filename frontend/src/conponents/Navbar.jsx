import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { masterTL } from "../gsap/masterTimeline.js";
import { useProfileContext } from "../context/profileContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import axios from "axios";
const Navbar = () => {
  const { user, baseApi } = useProfileContext();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navRef = useRef();
  const sidebarRef = useRef();
  const sidebarTL = useRef(null);

  const links = [
    { label: "Home", id: "home" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Let's Connect", id: "connect" }
  ];

  // function for download resume 
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // 1. Fetch the latest resume details from your API
      const res = await axios.get(`${baseApi}/api/resume`);
      const resumeUrl = res.data.resumeDetails.cloudinaryUrl;

      if (!resumeUrl) return alert("Resume not found!");

      // 2. Fetch the file as a blob to force download
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 3. Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user?.name || "Rohit"}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to download resume. Please try again later.");
    }finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Combined Entrance Animation
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Start all "animate-in" elements as invisible and slightly shifted
      gsap.set(".animate-in", { autoAlpha: 0, y: -10 });
      gsap.set(".nav-action", { opacity: 0 });

      tl.to(".logo", { autoAlpha: 1, y: 0, duration: 0.6, ease: "bounce.out" })
        .to(
          ".nav-link",
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "back.out(2)",
          },
          "-=0.4",
        )
        .to(
          ".nav-action",
          {
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(2)", // Added a slight pop effect
          },
          "-=0.2",
        );

      if (masterTL) masterTL.add(tl, 0);
    },
    { scope: navRef },
  );

  // Sidebar Logic
  useGSAP(
    () => {
      sidebarTL.current = gsap
        .timeline({ paused: true })
        .to(sidebarRef.current, { x: 0, duration: 0.4, ease: "power3.inOut" })
        .from(
          ".side-link",
          { x: 50, opacity: 0, stagger: 0.05, duration: 0.3 },
          "-=0.2",
        );
    },
    { scope: sidebarRef },
  );

  const toggleSidebar = (open) => {
    setIsOpen(open);
    open ? sidebarTL.current.play() : sidebarTL.current.reverse();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "RK";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav
        ref={navRef}
        className={`mx-auto transition-all duration-500 flex justify-between items-center backdrop-blur-md border ${theme.border} ${theme.text} ${
          isScrolled
            ? "w-full px-6 py-3 shadow-xl border-b border-b-white/40"
            : "w-[92%] md:w-[85%] mt-6 rounded-full px-8 py-4 border shadow-sm"
        }`}
      >
        {/* Logo */}
        <div className="logo animate-in text-2xl font-black italic tracking-tighter cursor-pointer">
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.accent}`}
          >
            {initials}.
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="nav-link animate-in font-medium transition-colors hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="nav-action p-2 rounded-full border border-gray-200/20 hover:bg-gray-100/10 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button
            onClick={handleDownload}
            className={`nav-action hidden sm:block px-5 py-2 rounded-full font-medium hover:scale-105 active:scale-95 transition-transform text-white cursor-pointer bg-gradient-to-r ${theme.accent}`}
          >
            {isDownloading ? "Downloading..." : "Resume"}
          </button>

          {/* ADDED ANIMATION CLASSES HERE: nav-action & animate-in */}
          <button
            onClick={() => toggleSidebar(true)}
            className={`nav-action md:hidden p-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white hover:scale-110 active:scale-90 transition-transform`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Content remains same... */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 w-[280px] h-screen bg-slate-900/95 backdrop-blur-xl z-[60] translate-x-full flex flex-col p-8 shadow-2xl"
      >
        <button
          onClick={() => toggleSidebar(false)}
          className="self-end mb-8 p-2 text-white hover:rotate-90 transition-transform"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => toggleSidebar(false)}
              className="side-link text-white text-2xl font-bold hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          {/* The Download Resume button is right here! */}
          <button
            onClick={handleDownload}
            className={`side-link mt-4 bg-gradient-to-r ${theme.accent} text-white py-4 rounded-xl font-bold text-lg`}
          >
            {isDownloading ? "Downloading..." : "Download Resume"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
