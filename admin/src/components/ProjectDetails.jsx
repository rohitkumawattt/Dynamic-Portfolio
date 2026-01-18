import React from "react";
import { IoMdClose } from "react-icons/io";
// import toast from "react-hot-toast";
const ProjectDetail = ({ showModal, setShowModal, project }) => {
  return (
    <section
      className={`w-full min-h-screen bg-[#00000099] fixed top-0 left-0 flex items-center justify-center z-50 transition-all duration-300 normal-color ${
        showModal ? "flex" : "hidden"
      } duration-300`}
    >
      <div
        className={`w-[90%] md:w-[50%] max-h-[600px] overflow-y-auto border border-white bg-transparent backdrop-blur-3xl p-8 rounded-lg shadow-lg relative`}
      >
        <button
          onClick={() => setShowModal(false)}
          className="normal-color cursor-pointer text-3xl absolute top-4 right-8"
        >
          <IoMdClose />
        </button>
        
        <h3 className="text-3xl font-bold mb-4">
          {project?.ProjectName || "untitled Project"}
        </h3>
        <p className="text-lg mb-4">
          {project?.description || "No description provided."}
        </p>
        <p className="font-semibold mb-2">Technologies Used:</p>
        <ul className="list-disc list-inside text-lg mb-4">
          {project?.technologies && project.technologies.length > 0 ? (
            project.technologies.map((tech, i) => <li key={i}>{tech}</li>)
          ) : (
            <li>No technologies used.</li>
          )}
        </ul>
        <div className="flex flex-wrap gap-4 mt-6">
          {project?.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#9c85bd] hover:bg-[#8a73a6] text-white font-semibold py-2 px-6 rounded-full transition-transform transform hover:scale-105 shadow-md"
            >
              Live Demo
            </a>
          )}
          {project?.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-transform transform hover:scale-105 shadow-md"
            >
              GitHub Repo
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
