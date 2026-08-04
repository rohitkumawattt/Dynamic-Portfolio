import React, { useState } from "react";
import ProjectDetail from "./ProjectDetail";
import { useProfileContext } from "../context/profileContext";
import { useTheme } from "../context/ThemeContext";
import { ArrowUpRight, Layout } from "lucide-react";
const Project = () => {
  const { theme } = useTheme();
  const { projects } = useProfileContext();
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectSelected, setProjectSelected] = useState({});

  const displayedProjects = showAll ? projects : projects.slice(0, 6);


  return (
    <>
      <section
        id="projects"
        className={`w-full min-h-[100vh] ${theme.borderTop} pb-20`}
      >
        <h2
          className={`bg-clip-text font-black text-transparent text-4xl bg-gradient-to-r ${theme.accent} mt-20 ml-5 uppercase `}
        >
          projects :-
        </h2>
        <div
          id="projectGrid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 px-4 md:px-10"
        >
          {displayedProjects.map((project, idx) => {
            return (
              <div
                key={project._id}
                className={`group relative p-6 rounded-xl border ${theme.border} ${theme.card} transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-5`}
                style={{ animationDelay: `${idx * 150}ms` }}
                data-project-id="project1"
                onClick={() => {
                  setShowModal(true);
                  setProjectSelected(project);
                }}
              >
                {/* right-top aniamtion on card */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 rounded-full bg-gradient-to-r ${theme.accent} group-hover:opacity-40 transition-opacity`}
                ></div>
                {/* project logo and open button  */}
                <div className="flex justify-between items-start">
                  <div className="w-24 h-24 text-6xl overflow-hidden text-blue-500 mb-4">
                    <img className="object-contain object-center" src={project.image.url} alt={project.name} />
                  </div>
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {project.ProjectName}
                  </h3>
                  <p className="text-sm opacity-60 line-clamp-2 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-3">
                  {project.technologies.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] mt-4 font-bold uppercase opacity-30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {projects.length > 6 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-8 py-3 rounded-full border ${theme.border} ${theme.text} hover:scale-105 transition-all font-bold`}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>
      <ProjectDetail
        showModal={showModal}
        setShowModal={setShowModal}
        projectSelected={projectSelected}
      />
    </>
  );
};

export default Project;
