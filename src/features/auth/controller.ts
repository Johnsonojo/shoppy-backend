import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../../db/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from "../../helpers/util";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = hashPassword(password);

    const userExists = await User.find({ email });
    if (userExists.length) {
      return res
        .status(409)
        .json({ message: "User already exists", status: "failure" });
    }

    const createdUser = await User.create({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      email: email,
      password: hashedPassword,
    });

    const payload = { userId: createdUser._id, role: createdUser.role };
    const accessToken = await generateAccessToken(payload);

    const newlyCreatedUser = await User.findById(createdUser._id).select(
      "-password"
    );
    res.status(201).json({
      message: "User registered successfully",
      status: "success",
      data: { newlyCreatedUser, accessToken },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, status: "failure" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email: email }).exec();

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "User does not exist", status: "failure" });
    }

    const isPasswordCorrect = compareSync(password, userExists.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", status: "failure" });
    }

    const { _id, username, role } = userExists;
    const payload = { id: _id, role: role };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // update the user's refresh token in the database
    await User.updateOne({ _id: _id }, { $set: { token: refreshToken } });

    res.status(200).json({
      message: "User logged in successfully",
      status: "success",
      data: {
        userId: _id,
        username,
        role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, status: "failure" });
  }
};

export const getRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
        status: "failure",
      });
    }
    const userId = verifyRefreshToken(refreshToken);
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(401).json({
        message: "Invalid refresh token",
        status: "failure",
      });
    }
    const payload = { id: foundUser._id };
    const newAccessToken = await generateAccessToken(payload);
    const newRefreshToken = await generateRefreshToken(payload);
    await User.updateOne(
      { _id: foundUser._id },
      { $set: { token: newRefreshToken } }
    );
    res.status(200).json({
      message: "Refresh token generated successfully",
      status: "success",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, status: "failure" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
        status: "failure",
      });
    }
    const userId = verifyRefreshToken(refreshToken);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
        status: "failure",
      });
    }

    await User.updateOne({ _id: userId }, { $set: { token: null } });
    res.status(200).json({
      message: "User logged out successfully",
      status: "success",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, status: "failure" });
  }
};
