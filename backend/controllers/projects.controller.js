import project from "../models/projects.model.js";
import user from "../models/user.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// create new project
export const createProject = async (req, res) => {
    try {
        const { ProjectName, description, technologies, githubLink, liveLink } = req.body;
        const technologiesArray = technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech.length > 0);
        if (!technologiesArray) {
            return res.status(400).json({
                success: false,
                message: "At least one technology is required",
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            })
        }
        const imageUrl = await uploadToCloudinary(req.file.path);
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Image upload failed to cloudinary",
            })
        }
        const imageObject = {
            url: imageUrl.secure_url,
            public_id: imageUrl.public_id,
        }

        const newProject = new project({
            user: req.user.id,
            ProjectName,
            description,
            technologies: technologiesArray,
            githubLink,
            liveLink,
            image: imageObject,
        });
        await newProject.save();
        return res.status(201).json({
            success: true,
            message: "Project uploaded successfully",
            project: newProject
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// get all uploaded projects
export const getProjects = async (req, res) => {
    try {
        const projects = await project.find().populate("user");
        if (!projects) {
            return res.status(404).json({
                success: false,
                message: "No projects found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            projects,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// get specific project by slug 

export const getProject = async (req, res) => {
    try {
        const { slug } = req.params;
        const specficProject = await project.findOne({ slug }).populate("user");
        if (!specficProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            specficProject,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
// update existing project 
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { ProjectName, description, technologies, githubLink, liveLink } = req.body;
        const technologiesArray = technologies.split(",").map(tech => tech.trim()).filter(tech => tech.length > 0);
        const specficProject = await project.findById(id);
        if (!specficProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            })
        }
        let newImage = specficProject.image;
        if (req.file) {
            await deleteFromCloudinary(specficProject.image.public_id);
            const uploaded = await uploadToCloudinary(req.file.path);
            newImage = {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            };
        }
        specficProject.ProjectName = ProjectName;
        specficProject.description = description;
        specficProject.technologies = technologiesArray;
        specficProject.githubLink = githubLink;
        specficProject.liveLink = liveLink;
        specficProject.image = newImage;

        await specficProject.save();
        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project: specficProject,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// delete specific existing project 
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const specficProject = await project.findOne({ _id: id });
        if (!specficProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            })
        }
        await deleteFromCloudinary(specficProject.image.public_id);
        await specficProject.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}