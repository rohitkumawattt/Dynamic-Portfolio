import express from "express"
import { addMessage, getMessages, getMessageById, setMsgStatus, deleteMsg, markMessageAsRead } from "../controllers/messages.controller.js";
const router = express.Router();


router.post("/send",addMessage);
router.get("/",getMessages);
//search 
router.get("/search/:slug",getMessageById);
// toggle read/unread
router.post("/status/:id",markMessageAsRead);
router.patch("/status/:id",setMsgStatus);
router.delete("/delete/:id", deleteMsg);
export default router;
