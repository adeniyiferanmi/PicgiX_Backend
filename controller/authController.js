import userModel from "../model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const SignUp = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Passwords do not match",
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "unable to create user",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Welcome to PicfiX",
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EPX }
    );
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const verifyToken = async (req, res, next) => {
  let tokens;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      tokens = req.headers.authorization.split(" ")[1];
    }
    
    if (!tokens) {
      return res.status(400).json({
        status:"error",
        message:"Token not found"
      })
    }

    const data = jwt.verify(tokens,process.env.JWT_SECRET)
    const user = await userModel.findById(data.id)
    if (!user) {
      return res.status(400).json({
        status:"error",
        message:"User not found"
      })
    }
    res.status(200).json({
      status:"success",
      message:"You are Authenticated",
      user
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
};
