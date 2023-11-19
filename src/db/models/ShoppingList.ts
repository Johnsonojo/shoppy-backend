import mongoose, { Document, Schema, Types } from "mongoose";

interface IListItems {
  name: string;
  quantity: number;
  unitPrice: number;
}
interface IShoppingList {
  title: string;
  user: Types.ObjectId | string;
  items: IListItems[];
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
      required: [true, "Please provide a description for your shopping list"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category for your shopping list"],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: {
      type: [
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
      validate: {
        validator: function (items: IListItems[]) {
          return items.length > 0;
        },
        message: "The shopping items array should not be empty",
      },
    },
    total: { type: Number, required: true },
    isDone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IShoppingListModel>(
  "ShoppingList",
  shoppingListSchema
);
