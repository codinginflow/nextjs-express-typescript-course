import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello, server!");
});

export default app;