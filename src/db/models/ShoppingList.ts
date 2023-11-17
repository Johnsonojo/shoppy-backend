import mongoose, { Document, Schema, Types } from "mongoose";

interface IShoppingList {
  title: string;
  user: Types.ObjectId | string;
  items: Types.ObjectId[] | string[];
  isDone: boolean;
}

interface IShoppingListModel extends IShoppingList, Document {}

const shoppingListSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide a title for your shopping list"],
    },
    description: {
      type: String,
      default: "No description",
      unique: true,
      required: [true, "Please provide a description"],
    },
    category: { type: String, required: [true, "Please provide a category"] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: {
          type: String,
          required: [true, "Please provide the item's name"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide the item's quantity"],
        },
        unitPrice: {
          type: Number,
          required: [true, "Please provide the item's unit price"],
        },
      },
    ],
    total: { type: Number, required: true },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IShoppingListModel>(
  "ShoppingList",
  shoppingListSchema
);
