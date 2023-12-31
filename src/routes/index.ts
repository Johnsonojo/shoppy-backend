import express, { Express } from "express";
import authRouter from "../features/auth/routes";
import shoppingListRouter from "../features/shopping-list/routes";
import otherRouter from "./otherRoutes";

const app: Express = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/shopping-list", shoppingListRouter);
app.use("/", otherRouter);

export default app;
