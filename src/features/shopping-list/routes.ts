import express from "express";
import AuthCheck from "../../middleware/authCheck";
import {
  createShoppingList,
  deleteOneShoppingListForUser,
  editOneShoppingListForUser,
  getAllShoppingListsForAUser,
  getOneShoppingListForUser,
  makeOneShoppingListDoneForUser,
} from "./controller";

const shoppingListRouter = express.Router();
const { verifyAccessToken } = AuthCheck;

shoppingListRouter.post("/", verifyAccessToken, createShoppingList);

shoppingListRouter.get("/", verifyAccessToken, getAllShoppingListsForAUser);

shoppingListRouter.get("/:id", verifyAccessToken, getOneShoppingListForUser);

shoppingListRouter.put("/:id", verifyAccessToken, editOneShoppingListForUser);

shoppingListRouter.put(
  "/:id/done",
  verifyAccessToken,
  makeOneShoppingListDoneForUser
);

shoppingListRouter.delete(
  "/:id",
  verifyAccessToken,
  deleteOneShoppingListForUser
);

export default shoppingListRouter;
