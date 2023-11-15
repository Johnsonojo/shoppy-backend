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
    title: { type: String, required: true, unique: true },
    description: {
      type: String,
      required: true,
      default: "No description",
      unique: true,
    },
    category: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
      },
    ],
    total: { type: Number, default: 0 },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IShoppingListModel>(
  "ShoppingList",
  shoppingListSchema
);
