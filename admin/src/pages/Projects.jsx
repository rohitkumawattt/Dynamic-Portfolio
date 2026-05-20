import React, { useEffect, useState } from "react";
import Rohit from "../assets/rohit_image.jpg";
import ProjectDetail from "../components/ProjectDetails";
import { Plus } from "lucide-react";
import AddProject from "../components/AddProject";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { SquarePen, Trash, MoveRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [FormSelected, setFormSelected] = useState("create");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { baseApi, usertoken } = useAuth();
  const [loading, setLoading] = useState(false);
  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseApi}/api/projects`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // console.log("Project details:", response.data);
        setProjects(response.data.projects);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateProjectForm = () => {
    setShowForm(!showForm);
    setFormSelected("create");
  };
  const handleUpdateProjectForm = (project) => {
    setShowForm(!showForm);
    setFormSelected("update");
    setSelectedProject(project);
  };
  const handleDeleteProject = async (project) => {
    const confirmDelete = window.confirm(
      `Are you sure want to delete "${project.ProjectName}"?`
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `${baseApi}/api/projects/delete/${project._id}`,
        {
          headers: {
            Authorization: `bearer ${usertoken}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Project deleted successfully!");
        setProjects((prev) => prev.filter((item) => item._id !== project._id));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchProject();
  }, []);
  const openDetails = (project) => {
    setSelectedProject(project || {});
    setShowModal(true);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-white">Projects</h1>
      <div className="flex justify-end mt-3">
        <div>
          <button
            onClick={() => handleCreateProjectForm()}
            className="w-full flex items-center justify-center p-3 rounded-xl font-medium text-green-400 bg-gray-700 hover:bg-emerald-600 hover:text-white transition duration-200 ease-in-out cursor-pointer mt-3"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Project
          </button>
        </div>
      </div>
      {loading ? (
        <div className="h-[200px] flex justify-center items-center mt-3">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div>
          <div
            id="projectGrid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 px-4 md:px-10"
          >
            {projects.map((project) => {
              return (
                <div
                  key={project._id}
                  className="W-[270px] bg-[#ffffff3e] backdrop-blur-2xl rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow relative"
                  data-project-id={project._id}
                >
                  {/* image  */}
                  <SquarePen
                    onClick={() => handleUpdateProjectForm(project)}
                    className="w-5 h-5 mr-1 absolute top-2 right-2 cursor-pointer"
                  />
                  <div className="flex justify-center mb-4">
                    <div className="w-28 h-28 rounded-lg overflow-hidden bg-white shadow">
                      <img
                        src={project?.image?.url || Rohit}
                        alt="project Logo"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  {/* description  */}
                  <div className="flex-1 text-center">
                    <h3 className="text-2xl font-semibold mb-2">
                      {project?.ProjectName || "untitled Project"}
                    </h3>
                    <p className="text-gray-400 text-base mb-4 line-clamp-3">
                      {project?.description || "No description provided."}
                    </p>
                  </div>
                  {/* buttons  */}
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="w-[40px] h-[40px] flex items-center justify-center rounded-full font-medium text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      <Trash />
                    </button>
                    <button
                      onClick={() => openDetails(project)}
                      className="w-[80%] flex items-center justify-center bg-[#9c85bd] hover:bg-[#8a73a6] normal-color font-semibold rounded-md hover:scale-105 shadow-md cursor-pointer "
                    >
                      View Details <MoveRight className="md:ml-1 ml-3 mt-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <AddProject
        showForm={showForm}
        setShowForm={setShowForm}
        FormSelected={FormSelected}
        selectedProject={selectedProject}
      />
      <ProjectDetail
        showModal={showModal}
        setShowModal={setShowModal}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;
