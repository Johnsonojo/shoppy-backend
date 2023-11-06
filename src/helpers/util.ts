import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

type DecodedToken = {
  id: string;
  role: string;
  iat: number;
  exp: number;
};

export const generateAccessToken = async (payload: object) => {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || "";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  } catch (err: any) {
    throw { message: err.message, status: "failure" };
  }
};

export const generateRefreshToken = async (payload: object) => {
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || "";
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    return token;
  } catch (err: any) {
    throw { message: err.message, status: "failure" };
  }
};

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    const { id } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || ""
    ) as DecodedToken;
    return id;
  } catch (err: any) {
    throw { message: err.message, status: "failure" };
  }
};

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
