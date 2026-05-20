import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Upload, GitBranch, Globe, Terminal, FileText } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AddProject = ({
  showForm,
  setShowForm,
  FormSelected,
  selectedProject,
}) => {
  const [formData, setFormData] = useState({
    ProjectName: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: "",
  });

  useEffect(() => {
    if (FormSelected === "update" && selectedProject) {
      const technologiesString = Array.isArray(selectedProject.technologies)
        ? selectedProject.technologies.join(", ")
        : selectedProject.technologies || "";

      setFormData({
        ProjectName: selectedProject.ProjectName || "",
        description: selectedProject.description || "",
        technologies: technologiesString,
        githubLink: selectedProject.githubLink || "",
        liveLink: selectedProject.liveLink || "",
      });
      if (selectedProject.image?.url) {
        setImagePreviewUrl(selectedProject.image.url);
      } else {
        setImagePreviewUrl("");
      }
    } else {
      setFormData({
        ProjectName: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveLink: "",
      });
      setImagePreviewUrl("");
      setImageFile(null);
    }
  }, [FormSelected, selectedProject, showForm]);

  // 2. State for image file and preview
  const { baseApi, usertoken } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles changes for all text/url inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles image file selection and creates a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local URL for image preview
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl("");
    }
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataBody = new FormData();
    formDataBody.append("ProjectName", formData.ProjectName);
    formDataBody.append("description", formData.description);
    formDataBody.append("technologies", formData.technologies);
    formDataBody.append("githubLink", formData.githubLink);
    formDataBody.append("liveLink", formData.liveLink);
    if (imageFile) {
      formDataBody.append("image", imageFile);
    }
    if (FormSelected === "create") {
      try {
        const response = await axios.post(
          `${baseApi}/api/projects/create`,
          formDataBody,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${usertoken}`,
            },
            withCredentials: true,
          },
        );
        if (response.status === 201) {
          // console.log("Project details:", response);
          toast.success("Project submitted successfully!");
        } else if (response.status === 400) {
          toast.error("project already exist!");
        }
        setFormData({
          ProjectName: "",
          description: "",
          technologies: "",
          githubLink: "",
          liveLink: "",
        });
        setImageFile(null);
        setImagePreviewUrl("");
        setLoading(false);
        setShowForm(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.put(
          `${baseApi}/api/projects/update/${selectedProject._id}`,
          formDataBody,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${usertoken}`,
            },
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          toast.success("Project updated successfully!");
          // console.log("UPDATED PROJECT : ", response.data.project);
        }
        setFormData({
          ProjectName: "",
          description: "",
          technologies: "",
          githubLink: "",
          liveLink: "",
        });
        setImageFile(null);
        setImagePreviewUrl("");
        setLoading(false);
        setShowForm(false);
        // window.location.reload();
      } catch (error) {
        // console.log("Error in updating project : ", error);
        toast.error(error.response.data.message);
        setLoading(false);
      }
    }
  };

  return (
    <section
      className={`w-full h-screen bg-[#00000099] fixed top-0 left-0 flex items-center justify-center z-50 transition-all duration-300 ${showForm ? "flex" : "hidden"
        } p-4 sm:p-8`}
    >
      <div className="md:w-[50%] w-[95%] max-w-4xl bg-[#ffffff18] normal-color backdrop-blur-3xl shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100 my-8 max-h-[600px] overflow-y-auto relative">
        {/* Close Button placed absolutely within the scrollable container */}
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10 cursor-pointer"
          aria-label="Close form"
        >
          <RxCross2 className="w-6 h-6" />
        </button>

        <header className="mb-8 text-center border-b pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            {FormSelected === "create" ? "Create Project" : "Update Project"}
          </h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Core Details (ProjectName, Technologies) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label
                htmlFor="ProjectName"
                className="text-sm font-semibold mb-1 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                Project Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="ProjectName"
                name="ProjectName"
                value={formData.ProjectName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Next.js Portfolio Site"
                className="w-full p-3 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="technologies"
                className="text-sm font-semibold mb-1 flex items-center"
              >
                <Terminal className="w-4 h-4 mr-2 text-blue-500" />
                Technologies (Comma Separated){" "}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                required
                placeholder="e.g., React, Tailwind CSS, Firebase"
                className="w-full p-3 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
          {/* Section 2: Image Upload and Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 p-6 rounded-xl bg-blue-50/50 hover:border-blue-400 transition duration-300">
            <label className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-3 text-blue-600" />
              Project Image <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              required={FormSelected === "create"}
              onChange={handleImageChange}
              className="hidden" // Hide default input
            />
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Image Preview Area */}
              <div className="shrink-0 w-36 h-20 sm:w-48 sm:h-24 rounded-lg border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Project Preview"
                    className="w-full h-full object-cover"
                  />
                ) : FormSelected === "update" && selectedProject?.image ? (
                  <img
                    src={selectedProject.image.url}
                    alt="Project Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500 text-sm p-2">
                    <Upload className="w-6 h-6 mx-auto mb-1" />
                    No Image Selected
                  </div>
                )}
              </div>

              {/* Custom Upload Button */}
              <div>
                <button
                  type="button"
                  onClick={() => document.getElementById("imageUpload").click()}
                  className="px-6 py-2 bg-[#9c85bd] hover:bg-[#8a73a6] text-white font-semibold rounded-full shadow-lgtransition duration-150 transform hover:scale-[1.02]"
                >
                  {imagePreviewUrl
                    ? "Change Image"
                    : FormSelected === "update" && selectedProject?.image
                      ? "Update Image"
                      : "Select Image"}
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  Required for project showcase.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold mb-1"
            >
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Provide a detailed, compelling description of what your project does, its features, and the technologies used."
              className="w-full p-3 border border-gray-300 rounded-lg resize-y transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            ></textarea>
          </div>

          {/* Section 4: Links (githubLink, liveLink) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label
                htmlFor="githubLink"
                className="text-sm font-semibold mb-1 flex items-center"
              >
                <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/your-project-repo"
                className="w-full p-3 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="liveLink"
                className="text-sm font-semibold mb-1 flex items-center"
              >
                <Globe className="w-4 h-4 mr-2 text-blue-500" />
                Live Demo URL
              </label>
              <input
                type="url"
                id="liveLink"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleInputChange}
                placeholder="https://your-project.app"
                className="w-full p-3 border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:ring-2 focus:ring-[#8a73a6] focus:border-[#8a73a6] shadow-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3  bg-[#9c85bd] hover:bg-[#8a73a6] font-bold text-lg rounded-xl transition duration-300 ease-in-out shadow-xl transform hover:scale-[1.005]"
          >
            {loading
              ? FormSelected === "create"
                ? "Submitting..."
                : "Updating..."
              : FormSelected === "create"
                ? "Add Project to Portfolio"
                : "Update Project"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProject;
