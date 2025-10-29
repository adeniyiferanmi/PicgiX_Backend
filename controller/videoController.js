import videoModel from "../model/videoModel.js";
import dotenv from "dotenv";
dotenv.config();

// export const generateVideo = async (req, res, next) => {
//   const baseUrl = process.env.KIEAI_URL;
//   const apiKey = process.env.KIEAI_API_KEY;
//   const userId = req.user._id;

//   try {
//     if (!req.body) {
//       return res.status(400).json({
//         status: "error",
//         message: "No data provided",
//       });
//     }

//     const video = await videoModel.create({ ...req.body, client: userId });

//     const response = await fetch(`${baseUrl}/generate`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(req.body),
//     });
//     if (!response.ok) {
//       return res.status(400).json({
//         status: "error",
//         message: "Failed to get response from KIE AI",
//       });
//     }

//     const data = await response.json();

//     const taskId = data?.data?.taskId || null;
//     if (!taskId) {
//       return res.status(400).json({
//         status:"error",
//         message:"taskId not found"
//       })
//     }
//     await video.save();

//     res.status(200).json({
//       status: "success",
//       message: "Video generation initiated",
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
// // controller/videoController.js
// export const generateVideoS = async (req, res, next) => {
//   const baseUrl = process.env.KIEAI_URL;
//   const apiKey = process.env.KIEAI_API_KEY;
//   const userId = req.user._id;

//   try {
//     const video = await videoModel.create({ ...req.body, client: userId });

//     // 1️⃣ Send generate request
//     const response = await fetch(`${baseUrl}/generate`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(req.body),
//     });

//     const data = await response.json();
//     const taskId = data?.data?.taskId;

//     if (!taskId) {
//       return res.status(400).json({ status: "error", message: "No taskId returned" });
//     }

//     // 2️⃣ Poll until finished
//     let status = "pending";
//     let videoUrl = null;
//     const maxAttempts = 15; // ~30–45 sec total
//     let attempts = 0;

//     while (attempts < maxAttempts) {
//       const statusRes = await fetch(`${baseUrl}/record-detail?taskId=${taskId}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const statusData = await statusRes.json();

//       status = statusData?.data?.state || "unknown";

//       if (status === "success" || status === "completed") {
//         videoUrl = statusData?.data?.videoInfo?.url;
//         break;
//       }

//       await new Promise((r) => setTimeout(r, 3000)); // wait 3 sec
//       attempts++;
//     }

//     // 3️⃣ Save and respond
//     video.taskId = taskId;
//     video.status = status;
//     video.videoUrl = videoUrl;
//     await video.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Video generated successfully",
//       videoUrl,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// export const getVideoStatus = async (req, res, next) => {
//   const baseUrl = process.env.KIEAI_URL;
//   const apiKey = process.env.KIEAI_API_KEY;
//   const { taskId } = req.params;
//   if (!taskId) {
//     return res.status(400).json({
//       status: "error",
//       message: "Task ID is required",
//     });
//   }
//   try {
//     const response = await fetch(`${baseUrl}/record-detail?taskId=${taskId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     });
//     if (!response.ok) {
//       return res.status(400).json({
//         status: "error",
//         message: "Failed to get response from KIE AI",
//       });
//     }

//     const data = await response.json();

//     const video = await videoModel.findOneAndUpdate(
//       { taskId },
//       {
//         status: data?.data?.state || "unknown",
//         videoInfo: data?.data?.videoInfo || null,
//         response: data,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "Video status retrieved",
//       data,
//       video,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };


// controller/videoController.js
export const generateVideo = async (req, res, next) => {
  const baseUrl = process.env.KIEAI_URL;
  const apiKey = process.env.KIEAI_API_KEY;
  const userId = req.user._id;

  try {
    const video = await videoModel.create({ ...req.body, client: userId });

    const response = await fetch(`${baseUrl}/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    const taskId = data?.data?.taskId;

    if (!taskId) {
      return res.status(400).json({ status: "error", message: "No taskId returned" });
    }

    let status
    let videoInfo
    const maxAttempts = 15; 
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusRes = await fetch(`${baseUrl}/record-detail?taskId=${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });
      const statusData = await statusRes.json();

      status = statusData?.data?.state || "unknown";

      if (status === "success" || status === "completed") {
        videoInfo = statusData?.data?.videoInfo;
      }

      await new Promise((r) => setTimeout(r, 3000)); 
      attempts++;
    }

    // 3️⃣ Save and respond
    video.taskId = taskId;
    video.status = status;
    video.videoInfo = videoInfo;
    await video.save();

    return res.status(200).json({
      status: "success",
      message: "Video generated successfully",
      videoInfo,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserVideo = async (req, res, next) => {

   const client = req.user?._id;

    if (!client) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

  try {
   
    const video = await videoModel.find({ client }).sort({ createdAt: -1 });    

    if (!video || video.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No videos found for this user",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User videos retrieved",
      video,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getUserSingleVideo = async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId) {
    return res.status(400).json({
      status: "error",
      message: "Video ID is required",
    });
  }

  try {

    const video = await videoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({
        status: "error",
        message: "Video not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User video retrieved",
      video,
    });
  } catch (error) {
    console.log(error);
    next(error);
    
  }
}

