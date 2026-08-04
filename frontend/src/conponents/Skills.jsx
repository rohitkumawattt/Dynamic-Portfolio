import React, { useState } from "react";
import { useProfileContext } from "../context/profileContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

const Skills = () => {
  const { theme } = useTheme();
  const [isSkillActive, setIsSkillActive] = useState("All Skills");
  const { skills } = useProfileContext();
  const skillBar = [
    "All Skills",
    "Programming Language",
    "Frontend",
    "Backend",
    "Tools",
    "Soft Skills",
  ];

  const activeSkills = isSkillActive === "All Skills"
    ? skills
    : skills.filter(skill => skill.category === isSkillActive);

  return (
    <section id="skills" className={`w-full min-h-[100vh] ${theme.borderTop}`}>
      <h2 className={`bg-clip-text font-black text-transparent text-4xl bg-gradient-to-r ${theme.accent} mt-20 ml-5 uppercase `}>
      Technical Skills:-
      </h2>
      <div className="w-full p-3 mt-6 flex items-center flex-wrap gap-4">
        {skillBar.map((skill, index) => {
          return (
            <button
              key={index}
              onClick={() => setIsSkillActive(`${skill}`)}
              className={`px-5 py-2 rounded-full text-[10px] md:text-[14px] font-bold uppercase transition-all border cursor-pointer ${theme.border}
                ${isSkillActive === skill ? `bg-gradient-to-r ${theme.accent} text-white border-transparent scale-105 shadow-xl` : 'hover:bg-current/5'}`}
            >
              {skill}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
        <div className="order-1">
          <h3 className={`text-2xl underline font-semibold mb-4 text-center ${theme.text} md:text-left`}>
            Categorized Skills
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 text-lg mt-3">
            {activeSkills.map((skill) => (
              <li key={skill._id}>
                <span className={`bg-clip-text font-black text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600`}>&#10003;</span> {skill.name}
              </li>
            ))}
          </ul>
        </div>

        {/* language animation here */}
        <div className="order-2 hidden md:flex justify-center items-center w-full relative min-h-[350px] md:min-h-[400px] overflow-hidden">
          {/* Ambient Background Blur Orbs */}
          <div className="absolute top-1/4 left-1/4 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />

          <div className="relative w-full h-[350px] md:h-[400px]">
            {/* React Icon */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: "40%", left: "45%" }}
              animate={{
                y: [0, -15, 10, 0],
                x: [0, 10, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.25, rotate: 360, transition: { duration: 0.6 } }}
            >
              <FaReact size={70} color="#61DAFB" className="drop-shadow-[0_0_15px_rgba(97,218,251,0.5)]" />
            </motion.div>

            {/* JavaScript Icon */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: "15%", left: "15%" }}
              animate={{
                y: [0, 12, -15, 0],
                x: [0, -10, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              whileHover={{ scale: 1.25, rotate: 15, transition: { duration: 0.3 } }}
            >
              <FaJs size={55} color="#F7DF1E" className="drop-shadow-[0_0_15px_rgba(247,223,30,0.4)]" />
            </motion.div>

            {/* HTML Icon */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: "20%", left: "70%" }}
              animate={{
                y: [0, -10, 12, 0],
                x: [0, -8, 10, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              whileHover={{ scale: 1.25, rotate: -15, transition: { duration: 0.3 } }}
            >
              <FaHtml5 size={50} color="#E34F26" className="drop-shadow-[0_0_15px_rgba(227,79,38,0.4)]" />
            </motion.div>

            {/* CSS Icon */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: "65%", left: "20%" }}
              animate={{
                y: [0, -12, 8, 0],
                x: [0, 12, -8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              whileHover={{ scale: 1.25, rotate: 15, transition: { duration: 0.3 } }}
            >
              <FaCss3Alt size={50} color="#1572B6" className="drop-shadow-[0_0_15px_rgba(21,114,182,0.4)]" />
            </motion.div>

            {/* Node Icon */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: "60%", left: "70%" }}
              animate={{
                y: [0, 15, -12, 0],
                x: [0, -12, 10, 0],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              whileHover={{ scale: 1.25, rotate: -10, transition: { duration: 0.3 } }}
            >
              <FaNodeJs size={60} color="#339933" className="drop-shadow-[0_0_15px_rgba(51,153,51,0.4)]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
