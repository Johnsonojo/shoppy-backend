import express, { Express } from "express";
import connectDB from "./db";
import registerMiddlewares from "./middleware";
import router from "./routes";

const app: Express = express();

registerMiddlewares(app);

connectDB();

app.use(router);

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () =>
  console.log(`Shoppy backend is running on port ${port}`)
);
