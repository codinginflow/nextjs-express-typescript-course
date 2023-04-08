import MongoStore from "connect-mongo";
import { SessionOptions } from "express-session";
import env from "../env";
import crypto from "crypto";

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
    genid(req) {
        const userId = req.user?._id;
        const randomId = crypto.randomUUID();
        if (userId) {
            return `${userId}-${randomId}`;
        } else {
            return randomId;
        }
    },
}

export default sessionConfig;