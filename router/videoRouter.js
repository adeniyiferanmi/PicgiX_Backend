import { Router } from "express";
import { generateVideo, getUserSingleVideo, getUserVideo, } from "../controller/videoController.js";
import isLoggedIn from "../middleWare/isLoggedIn.js";

const videoRouter = Router();

videoRouter.post("/generate-video",isLoggedIn,generateVideo)
// videoRouter.get("/status/:taskId",isLoggedIn,getVideoStatus)
videoRouter.get("/user-video",isLoggedIn,getUserVideo)
videoRouter.get("/user-video/:videoId",isLoggedIn,getUserSingleVideo)
export default videoRouter;  