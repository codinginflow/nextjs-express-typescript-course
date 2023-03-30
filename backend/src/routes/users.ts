import express from "express";
import passport from "passport";
import * as UsersController from "../controllers/users";
import requiresAuth from "../middlewares/requiresAuth";

const router = express.Router();

router.get("/me", requiresAuth, UsersController.getAuthenticatedUser);

router.post("/signup", UsersController.signUp);

router.post("/login", passport.authenticate("local"), (req, res) => res.status(200).json(req.user));

router.post("/logout", UsersController.logOut);

export default router;