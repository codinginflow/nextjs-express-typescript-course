import "dotenv/config";
import express from "express";
import blogPostRoutes from "./routes/blog-posts";

const app = express();

app.use(express.json());

app.use("/posts", blogPostRoutes);

export default app;