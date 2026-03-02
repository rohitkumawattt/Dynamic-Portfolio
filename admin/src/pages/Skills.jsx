import React, { useState } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
const Skills = () => {
  const { baseApi, usertoken } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [createSkillForm, setCreateSkillForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: "",
  });
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseApi}/api/skills`);
      if (response.status === 200) {
        // console.log("SKILLS FECTHING DATA : ", response.data);
        setSkills(response.data.skills);
        setLoading(false);
      }
    } catch (error) {
      console.error("SKILLS FEATCHING ERROR : ", error.message);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateSkillForm({
      ...createSkillForm,
      [name]: value,
    });
  };
  // Function for create skill
  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseApi}/api/skills/create`, createSkillForm,{
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });
      // console.log("SKILLS CREATION RESPONSE : ", response.data);  
      if (response.status === 200) {
        setIsOpen(false);
        toast.success("Skill created successfully!");
        setCreateSkillForm({
          name: "",
          category: "Frontend",
          proficiency: "",
        });
      }
      fetchSkills();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // delete function for skills 
  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await axios.delete(`${baseApi}/api/skills/delete/${skillId}`,{
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });
      if (response.status === 200) {
        toast.success("Skill deleted successfully!");
        fetchSkills();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // update skill function 
  

  const getSkillColor = (category) => {
    switch (category?.toLowerCase()) {
      case "frontend":
        return "bg-green-400";
      case "backend":
        return "bg-red-400";
      case "programming language":
        return "bg-violet-400";
      case "tools":
        return "bg-blue-400";
      case "softskills":
      case "soft skills":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };
  useEffect(() => {
    fetchSkills();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center normal-color">Skills</h1>
      {/* Skill adder button  */}
      <div className="flex justify-end mt-3 relative">
        <div className="z-30">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center p-3 rounded-xl font-medium text-green-400 bg-gray-700 hover:bg-emerald-600 hover:text-white transition duration-200 ease-in-out cursor-pointer mt-3"
          >
            <Plus
              className={`w-5 h-5 mr-1 transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-45" : ""
              }`}
            />
            {isOpen ? "Close" : "Add Skill"}
          </button>
        </div>
        {/* Skills Adding components  */}
        <div
          className={`absolute top-20 right-0 bg-slate-900 shadow-2xs shadow-blue-700 rounded-xl border border-blue-900 p-3 overflow-hidden transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto blur-none"
              : "opacity-0 -translate-y-8 scale-90 pointer-events-none blur-md"
          }`}
        >
          <h2 className="text-white text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Add Skill
          </h2>
          <form onSubmit={handleCreateSkill}>
            <div className="space-y-4">
              {/* input filed  */}
              <div>
                <label className="block text-blue-100/50 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={createSkillForm.name}
                  onChange={handleInputChange}
                  placeholder="e.g. React.js"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
                />
              </div>
              <div className="w-full flex justify-between">
                {/* select category  */}
                <div className="w-[50%] relative">
                  <label className="block text-blue-100/50 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
                    Category
                  </label>
                  <select
                    value={createSkillForm.category}
                    onChange={handleInputChange}
                    name="category"
                    id="category"
                    className="w-full appearance-none px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300 cursor-pointer"
                  >
                    <option value="Frontend" className="bg-slate-900">
                      Frontend
                    </option>
                    <option value="Backend" className="bg-slate-900">
                      Backend
                    </option>
                    <option value="Programming Language" className="bg-slate-900">
                      Programming Language
                    </option>
                    <option value="Tools" className="bg-slate-900">
                      Tools
                    </option>
                    <option value="Soft Skills" className="bg-slate-900">
                      Soft Skills
                    </option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-2 top-8  pointer-events-none text-emerald-400">
                    <ChevronDown />
                  </div>
                </div>
                {/* proficiency slection  */}
                <div className="relative">
                  <label className="block text-blue-100/50 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
                    Proficiency
                  </label>
                  <input
                    type="number"
                    name="proficiency"
                    value={createSkillForm.proficiency}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            {/* Action Button */}
            <div className="w-full flex justify-end">
              <button className="px-5.5 py-2 mt-4  bg-gradient-to-r from-emerald-600 to-teal-500 normal-color font-bold rounded-md shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white/10 cursor-pointer">
                <span className="text-xl">+</span> Add
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* category selection section  */}
      <div>
        <div className="mt-5 border border-blue-900 rounded-xl py-4 px-3">
          <h2 className="normal-color font-bold">Skill Categories</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <p className="md:text-xl text-md normal-color bg-green-400 rounded-md md:px-2 py-1 cursor-pointer hover:bg-green-500 hover:text-white transition duration-200 ease-in-out hover:scale-105">
              Frontend
            </p>
            <p className="md:text-xl text-md normal-color bg-red-400 rounded-md md:px-2 px-1 py-1 cursor-pointer hover:bg-red-500 hover:text-white transition duration-200 ease-in-out hover:scale-105">
              Backend
            </p>
            <p className="md:text-xl text-md normal-color bg-violet-400 rounded-md md:px-2 px-1 py-1 cursor-pointer hover:bg-violet-500 hover:text-white transition duration-200 ease-in-out hover:scale-105">
              Programming Language
            </p>
            <p className="md:text-xl text-md normal-color bg-blue-400 rounded-md md:px-2 px-1 py-1 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out hover:scale-105">
              Tools
            </p>
            <p className="md:text-xl text-md normal-color bg-yellow-400 rounded-md md:px-2 px-1 py-1 cursor-pointer hover:bg-yellow-500 hover:text-white transition duration-200 ease-in-out hover:scale-105">
              Soft Skills
            </p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="h-[200px] flex justify-center items-center mt-3">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div className="normal-color py-10 px-2">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className={`${getSkillColor(
                  skill.category
                )} text-white font-semibold py-1 px-3 rounded-md`}
              >
                <div className={` flex items-center justify-center`}>
                  {skill.name}
                  <X onClick={()=>handleDeleteSkill(skill._id)} size={20} className="ml-2 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
