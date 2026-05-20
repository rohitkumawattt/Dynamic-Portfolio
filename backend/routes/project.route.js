import { upload } from "../middlerware/multer.js";
import express from "express"
import { createProject, getProjects, getProject, updateProject, deleteProject } from "../controllers/projects.controller.js";
import { protect } from "../middlerware/user.middleware.js";
const router = express.Router();

router.post("/create", protect, upload.single("image"), createProject);
router.get("/", getProjects);
router.get("/project/:slug", protect, getProject);
router.put("/update/:id", protect, upload.single("image"), updateProject);
router.delete("/delete/:id", protect, deleteProject);

export default router;
