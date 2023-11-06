import { NextFunction, Request, Response } from "express";
import InputSanitizer from "./authInputSanitizer";

type Keys = {
  [index: number]: string;
};

class AuthValidator {
  static signUpValidator = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, email, password } = req.body;

    const missingFields = [username, email, password]
      .map((field, index) => {
        const keys: Keys = {
          0: "username",
          1: "email",
          2: "password",
        };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!username || !email || !password) {
      res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const response = (message: string) => {
      res.status(400).json({ message, status: "failure" });
    };

    if (!InputSanitizer.isValidName(username))
      return response("The username you provided is too short");

    if (!InputSanitizer.isEmail(email))
      return response("Please provide a valid email address");

    if (!InputSanitizer.isValidPassword(password))
      return response(
        "Password must be at least eight (8) alphanumeric characters"
      );

    req.username = username.trim();
    req.email = email.trim();
    req.password = password.trim();

    return next();
  };

  static loginValidator(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const missingFields = [email, password]
      .map((field, index) => {
        const keys: Keys = {
          0: "email",
          1: "password",
        };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!email || !password) {
      res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const response = (message: string) => {
      res.status(400).json({ message, status: "failure" });
    };

    if (!InputSanitizer.isEmail(email))
      return response("Please provide a valid email address");

    if (!InputSanitizer.isValidPassword(password))
      return response(
        "Password must be at least eight (8) alphanumeric characters"
      );

    req.email = email.trim();
    req.password = password.trim();

    return next();
  }
}

export default AuthValidator;
