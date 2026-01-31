import React from 'react'
import { MoveUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
const UpGoingBtn = () => {
  const { theme } = useTheme();
    // function to appear up going button on scroll
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            document.querySelector(".up-going-btn").style.display = "block";
        } else {
            document.querySelector(".up-going-btn").style.display = "none";
        }
    });
  return (
    <div>
      <a href="#top" className={`hidden up-going-btn fixed bottom-10 right-10 normal-color p-4 rounded-full z-[60] shadow-2xl transition-all hover:scale-110 active:scale-95 border ${theme.border} ${theme.card} animate-in fade-in zoom-in duration-300`}>
        <MoveUp className={`${theme.text}`}/>
      </a>
    </div>
  )
}

export default UpGoingBtn
