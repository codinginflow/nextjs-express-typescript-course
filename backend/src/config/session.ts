import RedisStore from "connect-redis";
import { SessionOptions, CookieOptions } from "express-session";
import env from "../env";
import crypto from "crypto";
import redisClient from "./redisClient";

const cookieConfig: CookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

if (env.NODE_ENV === "production") {
    cookieConfig.secure = true;
}

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieConfig,
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