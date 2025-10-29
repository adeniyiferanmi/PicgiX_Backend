import express from "express"
const app = express()
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectToDb from "./config/connectToDB.js"
import authRouter from "./router/authRouter.js"
import morgan from "morgan"
import errorHandler from "./middleWare/errorHandler.js"
import videoRouter from "./router/videoRouter.js"

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

const PORT = process.env.PORT 

app.listen(PORT,() => {
    console.log("App is running✅");  
})


app.get("/", (req, res) => {
  res.send("✅ Welcome to Picfix AI Video Generator — Server is running!");
});


app.get("/api/v1",(req,res)=>{
    res.send("Welcome to Picfix ai video generator version 1")
})

connectToDb()
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/aivideo",videoRouter)


app.use("/{*any}", errorHandler)