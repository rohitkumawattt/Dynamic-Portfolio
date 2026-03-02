import React, { useState } from "react";
import SkillGraph from "./SkillGraph";
import { useProfileContext } from "../context/profileContext";
import { useTheme } from "../context/ThemeContext";
const Skills = () => {
  const {theme} = useTheme();
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
  return (
    <section id="skills" className={`w-full min-h-[100vh] ${theme.borderTop}`}>
      <h1 className={`bg-clip-text font-black text-transparent text-4xl bg-gradient-to-r ${theme.accent} mt-20 ml-5 uppercase `}>
        Skills :-
      </h1>
      <div className="w-full p-3 mt-6 flex flex-wrap gap-4">
        {skillBar.map((skill,index) => {
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
        <div className="order-1 md:order-2">
          <h3 className={`text-2xl underline font-semibold mb-4 text-center ${theme.text} md:text-left`}>
            Categorized Skills
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 text-lg mt-3">
            {isSkillActive === "All Skills"
              ? skills.map((skill) => (
                  <li key={skill._id}>
                    <span className={`bg-clip-text font-black text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600`}>&#10003;</span> {skill.name}
                  </li>
                ))
              : skills
                  .filter((skill) => skill.category === isSkillActive)
                  .map((skill) => (
                    <li key={skill._id}>
                      <span className={`bg-clip-text font-black text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600`}>&#10003;</span>{" "}
                      {skill.name}
                    </li>
                  ))}
          </ul>
        </div>
        <div className="order-2 md:order-2">
          <h3 className={`text-2xl underline font-semibold mb-4 text-center ${theme.text} md:text-left md:ml-4`}>
            Technical Proficiency
          </h3>
          <div className={`rounded-[40px] border ${theme.border} ${theme.card} p-4 shadow-2xl`}>
            <SkillGraph skills={skills} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
