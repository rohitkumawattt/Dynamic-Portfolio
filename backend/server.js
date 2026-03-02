import express from "express"
import dotenv from "dotenv"
dotenv.config({ path: './.env' });
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDb from "./config/db.js";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
import skillRoute from "./routes/skills.route.js";
import userProfileRoute from "./routes/userProfile.route.js";
import messageRouter from "./routes/messages.routes.js";
import resumeRouter from "./routes/resume.route.js"
const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(
  cors({
    origin: ["https://rohit-kumawat.onrender.com","https://admin-rohit.onrender.com","http://localhost:5173","http://localhost:5174","http://10.68.114.117:5174","http://10.68.114.117:5173",'http://10.56.203.117:5173'], // frontend port
    credentials: true, // this will allow cookies to be sent
  })
);

const port = process.env.PORT || 3000 // Default port to 3000 if not specified
connectDb();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// user routes 
app.use("/api/users", userRoute);
// project routes
app.use("/api/projects", projectRoute);
// skill routes
app.use("/api/skills", skillRoute);
// userProfile routes
app.use("/api/user-profile", userProfileRoute);
// message routes
app.use("/api/messages", messageRouter);
// resume router 
app.use("/api/resume",resumeRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
