import React from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
const ProjectDetail = ({ showModal, setShowModal, projectSelected }) => {
  const { theme } = useTheme();
  return (
    <section
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300 w-full min-h-[100vh] bg-[#00000099] top-0 left-0 transition-all ${
        showModal ? "flex" : "hidden"
      } duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setShowModal(false)}
      ></div>
      {/* project details card  */}
      <div
        className={`relative w-full max-w-2xl p-8 md:p-12 border ${theme.border} ${theme.style} ${theme.text} rounded-xl shadow-2xl animate-in zoom-in-95 duration-300`}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-current/10 cursor-pointer"
        >
          <IoMdClose />
        </button>
        <h3 className="text-4xl font-black tracking-tighter mb-4">
          {projectSelected?.ProjectName || "Project Name"}
        </h3>
        <p className="text-lg opacity-70 mb-8 leading-relaxed text-justify">
          {projectSelected?.description || "Project Description"}
        </p>
        <div className="space-y-4 mb-8">
          <p className="font-bold text-[10px] uppercase tracking-widest opacity-40">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {projectSelected?.technologies?.map((t) => (
              <span
                key={t}
                className={`px-4 py-1 rounded-full border ${theme.border} text-[10px] font-bold uppercase`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          {projectSelected?.liveLink ? (
            <Link
              to={projectSelected.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white bg-gradient-to-r ${theme.accent} hover:shadow-xl transition-all`}
            >
              Live Project
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 text-center py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-800/40 border border-slate-700/50 cursor-not-allowed opacity-60 transition-all"
              title="Live demo link is not available"
            >
              Live Link Not Available
            </button>
          )}

          {projectSelected?.githubLink ? (
            <Link
              to={projectSelected.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border ${theme.border} hover:bg-current/5 transition-all`}
            >
              GitHub Repo
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 text-center py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-800/40 border border-dashed border-slate-700/50 cursor-not-allowed opacity-60 transition-all"
              title="GitHub repository is not available"
            >
              GitHub Not Available
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
