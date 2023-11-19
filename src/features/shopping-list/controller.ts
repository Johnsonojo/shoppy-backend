import { Request, Response } from "express";
import mongoose from "mongoose";
import ShoppingList from "../../db/models/ShoppingList";
import ShoppingListItem from "../../db/models/ShoppingListItem";

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

export const getAllShoppingListsForAUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.payload.id;

    const shoppingLists = await ShoppingList.find({ user: userId }).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    return res.status(200).json({
      message: "Shopping lists retrieved successfully",
      status: "success",
      data: shoppingLists,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};

export const getOneShoppingListForUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.payload.id;
    const { id } = req.params;

    const shoppingListFound = await ShoppingList.findOne({
      _id: id,
      user: userId,
    }).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    if (!shoppingListFound) {
      return res.status(404).json({
        message: "Shopping list not found",
        status: "failure",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Shopping list retrieved successfully",
      status: "success",
      data: shoppingListFound,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};

export const editOneShoppingListForUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.payload.id;
    const { id } = req.params;
    const { title, description, category, items } = req.body;

    const shoppingListFound = await ShoppingList.findOne({
      _id: id,
      user: userId,
    }).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    if (!shoppingListFound) {
      return res.status(404).json({
        message: "Shopping list not found",
        status: "failure",
        data: null,
      });
    }

    // calculate the total price of the shopping list
    const grandTotal = items.reduce((acc: number, item: listItems) => {
      return acc + item.quantity * item.unitPrice!;
    }, 0);

    const updatedShoppingList = await ShoppingList.findOneAndUpdate(
      { _id: id, user: userId },
      {
        title,
        description,
        category,
        items,
        total: grandTotal,
      },
      { new: true }
    ).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    // delete all the items in the shoppingListItems collection
    await ShoppingListItem.deleteMany({ shoppingListId: id });

    // save the items to the shoppingListItems collection
    items.forEach(async (item: listItems) => {
      await ShoppingListItem.create({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        shoppingListId: id,
      });
    });

    return res.status(200).json({
      message: "Shopping list updated successfully",
      status: "success",
      data: updatedShoppingList,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};

export const makeOneShoppingListDoneForUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.payload.id;
    const { id } = req.params;

    const shoppingListFound = await ShoppingList.findOne({
      _id: id,
      user: userId,
    }).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    if (!shoppingListFound) {
      return res.status(404).json({
        message: "Shopping list not found",
        status: "failure",
        data: null,
      });
    }

    const updatedShoppingList = await ShoppingList.findOneAndUpdate(
      { _id: id, user: userId },
      {
        isDone: true,
      },
      { new: true }
    ).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    return res.status(200).json({
      message: "Shopping list updated successfully",
      status: "success",
      data: updatedShoppingList,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};

export const deleteOneShoppingListForUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.payload.id;
    const { id } = req.params;

    const shoppingListFound = await ShoppingList.findOne({
      _id: id,
      user: userId,
    }).populate(
      "user",
      "-password -token -isVerified -role -createdAt -updatedAt"
    );

    if (!shoppingListFound) {
      return res.status(404).json({
        message: "Shopping list not found",
        status: "failure",
        data: null,
      });
    }

    await ShoppingList.findOneAndDelete({ _id: id, user: userId });
    await ShoppingListItem.deleteMany({ shoppingListId: id });

    return res.status(200).json({
      message: "Shopping list deleted successfully",
      status: "success",
      data: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "failure",
    });
  }
};
