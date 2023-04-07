import mongoose from "mongoose";
import app from "./app";
import env from "./env";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const port = process.env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => console.log("Server running on port: " + port));
    })
    .catch(console.error);