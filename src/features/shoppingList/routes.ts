import express from "express";
import AuthCheck from "../../middleware/authCheck";
import { createShoppingList } from "./controller";

const shoppingListRouter = express.Router();
const { verifyAccessToken } = AuthCheck;

shoppingListRouter.post("/", verifyAccessToken, createShoppingList);

export default shoppingListRouter;
