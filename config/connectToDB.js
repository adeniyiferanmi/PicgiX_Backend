import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const password = process.env.MONGODB_PASSWORD
const username = process.env.MONGODB_USERNAME
const mongoDbUri = process.env.MONGODB_URL.replace("<db_password>",password)

const connectToDb = async () => {
    try {
        const connected = await mongoose.connect(mongoDbUri)
        if (connected) {
            console.log("Mongo DB Connected 😎✅");
            
        }
    } catch (error) {
        console.log(error);
    }
}
export default connectToDb
