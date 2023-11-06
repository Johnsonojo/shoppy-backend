import express from "express";
import AuthValidator from "../../middleware/validators/auth/authValidator";
import { getRefreshToken, login, logout, signup } from "./controller";

const authRouter = express.Router();

const { signUpValidator, loginValidator } = AuthValidator;

authRouter.post("/register", signUpValidator, signup);

authRouter.post("/login", loginValidator, login);

authRouter.post("/refresh-token", getRefreshToken);

authRouter.post("/logout", logout);

export default authRouter;
