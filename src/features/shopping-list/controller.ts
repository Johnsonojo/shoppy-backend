import { Request, Response } from "express";
import mongoose from "mongoose";
import ShoppingList from "../../db/models/ShoppingList";
import ShoppingListItem from "../../db/models/ShoppingListItem";
import User from "../../db/models/User";

interface listItems {
  name: string;
  quantity: number;
  unitPrice: number;
  shoppingListId: mongoose.Types.ObjectId | string;
}

export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.payload.id;
    const { title, description, category, items } = req.body;

    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    // calculate the total price of the shopping list
    const grandTotal = items.reduce((acc: number, item: listItems) => {
      return acc + item.quantity * item.unitPrice!;
    }, 0);

    const newShoppingList = await ShoppingList.create({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      category,
      user: userId,
      items,
      total: grandTotal,
      isDone: false,
    });

    const newlyCreatedShoppingList = await ShoppingList.findById(
      newShoppingList._id
    ).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    // save the items to the shoppingListItems collection
    items.forEach(async (item: listItems) => {
      await ShoppingListItem.create({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        shoppingListId: newShoppingList._id,
      });
    });

    return res.status(201).json({
      message: "Shopping list created successfully",
      status: "success",
      data: newlyCreatedShoppingList,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};
