import React, { useEffect } from "react";
import UpGoingBtn from "./conponents/UpGoingBtn.jsx";
import Navbar from "./conponents/Navbar.jsx";
import Header from "./conponents/Header.jsx";
import Skills from "./conponents/Skills.jsx";
import Project from "./conponents/Project.jsx";
import Connect from "./conponents/Connect.jsx";
import Footer from "./conponents/Footer.jsx";
import { masterTL } from "./gsap/masterTimeline.js";
import { useProfileContext } from "./context/profileContext.jsx";
import Feedback from "./conponents/Feedback.jsx";
import Skeleton from "./conponents/Skeleton.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

function App() {
  const { isReady } = useProfileContext();
  const { theme } = useTheme();
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => masterTL.play(), 100);
      document.body.style.overflow = "auto";
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isReady]);

  return (
    <>
      {!isReady && <Skeleton />}
      <div
        className={`transition-all duration-700 min-h-screen ${theme.style} ${theme.text}`}
        style={{ visibility: isReady ? "visible" : "hidden" }}
      >
        <Navbar />
        <Header />
        <Skills />
        <Project />
        <div
          className={`flex md:flex-row flex-col items-stretch gap-4 md:gap-0 ${theme.borderTop}`}
        >
          <div className="flex-1">
            <Connect />
          </div>
          <div className="flex-1">
            <Feedback />
          </div>
        </div>
        <Footer />
        <UpGoingBtn />
      </div>
    </>
  );
}

export default App;
