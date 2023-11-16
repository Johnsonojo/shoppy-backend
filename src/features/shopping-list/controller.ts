import { Request, Response } from "express";
import mongoose from "mongoose";
import ShoppingList from "../../db/models/ShoppingList";
import ShoppingListItem from "../../db/models/ShoppingListItem";
import User from "../../db/models/User";

interface listItems {
  name: string;
  quantity: number;
  shoppingList: mongoose.Types.ObjectId | string;
}

export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.payload.id;
    const { title, description, category, items } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const newShoppingList = await ShoppingList.create({
      _id: new mongoose.Types.ObjectId(),
      title,
      description: description,
      category: category,
      user: userId,
      items: items,
      isDone: false,
    });

    const newlyCreatedShoppingList = await ShoppingList.findById(
      newShoppingList._id
    ).populate("user", "-password -token");

    //   save the items to the shoppingListItems collection
    items.forEach(async (item: listItems) => {
      await ShoppingListItem.create({
        name: item.name,
        quantity: item.quantity,
        shoppingList: newShoppingList._id,
      });
    });

    return res.status(201).json({
      message: "Shopping list created successfully",
      status: "success",
      data: newlyCreatedShoppingList,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: "failure" });
  }
};
