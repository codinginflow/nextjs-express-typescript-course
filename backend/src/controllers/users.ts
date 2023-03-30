import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import assertIsDefined from "../utils/assertIsDefined";
import { SignUpBody } from "../validation/users";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const user = await UserModel.findById(authenticatedUser._id).select("+email").exec();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password: passwordRaw } = req.body;

    try {
        const existingUsername = await UserModel.findOne({ username })
            .collation({ locale: "en", strength: 2 })
            .exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const result = await UserModel.create({
            username,
            displayName: username,
            email,
            password: passwordHashed,
        });

        const newUser = result.toObject();

        delete newUser.password;

        req.logIn(newUser, error => {
            if (error) throw error;
            res.status(201).json(newUser);
        });
    } catch (error) {
        next(error);
    }
}

export const logOut: RequestHandler = (req, res) => {
    req.logOut(error => {
        if (error) throw error;
        res.sendStatus(200);
    })
}