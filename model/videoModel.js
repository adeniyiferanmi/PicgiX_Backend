import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  prompt:{
    type:String,
    required:true
  },
  taskId:{
    type: String
  },
  model:{
    type:String,
    enum:["runway-duration-5-generate"],
    default:"runway-duration-5-generate",
    required:true
  },
  aspectRatio:{
    type:String,
    enum:["16:9","9:16","1:1" ,"3:4", "4:3"],
    default:"16:9",
    required:"true"
  },
  duration:{
    type:Number,
    default:5,
    required:true
  },
  quality:{
    type:String,
    enum:["1080p","720p"],
    default:"720p",
    required:true
  },
  callBackUrl:{
    type:String,
    
  },
  status:{
    type:String,
    enum:["pending","success","fail","generating"],
    default:"pending"
  },
  resultUrls:{
    type:String,
  },
  waterMark:{
    type:String,
  },
  videoInfo:{
    type:Object,
  },
  client:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"users"
  }

  
  
},{ timestamps: true })
const videoModel = mongoose.model("videos",videoSchema)
export default videoModel