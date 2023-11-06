import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

class AuthCheck {
  static verifyAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized action. Access denied" });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({
            status: "failure",
            message: err.message,
          });
        } else {
          return res.status(403).json({
            status: "failure",
            message: "Invalid token",
          });
        }
      }
      req.payload = payload;
      return next();
    });
  };

  static validateAdmin(req: Request, res: Response, next: NextFunction) {
    const { role } = req.payload;
    if (role !== "admin") {
      return res.status(403).json({
        status: "failure",
        message: "Unauthorized action. Access denied",
      });
    }
    return next();
  }
}

export default AuthCheck;
