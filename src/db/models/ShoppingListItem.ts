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
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    shoppingList: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingList",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IShoppingListItem>(
  "ShoppingListItem",
  shoppingListItemSchema
);
