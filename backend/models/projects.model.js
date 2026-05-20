import user from "./user.model.js";
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
});

const projectSchema = new mongoose.Schema({
    image: {
        type: imageSchema,
        required: true
    },
    ProjectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: {
        type: Array,
        required: true
    },
    githubLink: {
        type: String,
    },
    liveLink: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const project = mongoose.model("Project", projectSchema)
export default project;