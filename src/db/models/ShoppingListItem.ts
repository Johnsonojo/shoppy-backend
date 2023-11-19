import mongoose, { Document, Schema, Types } from "mongoose";

interface IShoppingListItem {
  name: string;
  quantity: number;
  unitPrice?: number;
  shoppingList: Types.ObjectId | string;
}

export interface IShoppingListItemModel extends IShoppingListItem, Document {}

const shoppingListItemSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, "Please provide the item's name"] },
    quantity: {
      type: Number,
      required: [true, "Please provide the item's quantity"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Please provide the item's unit price"],
    },
    shoppingListId: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingList",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IShoppingListItem>(
  "ShoppingListItem",
  shoppingListItemSchema
);
