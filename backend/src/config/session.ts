import RedisStore from "connect-redis";
import { SessionOptions } from "express-session";
import env from "../env";
import crypto from "crypto";
import redisClient from "./redisClient";

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    rolling: true,
    store: new RedisStore({
        client: redisClient,
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