import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

export default (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
