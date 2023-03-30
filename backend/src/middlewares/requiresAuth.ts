import { RequestHandler } from "express";
import createHttpError from "http-errors";

const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        next(createHttpError(401, "User no authenticated"));
    }
}

export default requiresAuth;