import express from "express"
import { getFeedback, createFeedback, deleteFeedback, searchFeedback, setFeedbackStatus } from "../controllers/feedback.controller.js"

const router = express.Router();

router.post("/send",createFeedback);
router.get("/",getFeedback);
// search 
router.get("/search/:slug", searchFeedback);
// toggle read/unread
router.post("/status/:id",setFeedbackStatus);
router.delete("/delete/:id",deleteFeedback);

export default router;