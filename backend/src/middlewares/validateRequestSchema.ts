import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Schema, ValidationError } from "yup";

const validateRequestSchema = (schema: Schema): RequestHandler =>
    async (req, res, next) => {
        try {
            await schema.validate(req);
            next();
        } catch (error) {
            if (error instanceof ValidationError) {
                next(createHttpError(400, error.message));
            } else {
                next(error);
            }
        }
    }

export default validateRequestSchema;