import { NextFunction, Request, Response } from "express";
import { InvalidInputError } from "../../../domain/errors/invalid-input.error.js";

export function validateJsonMiddleware(
    request: Request,
    _response: Response,
    next: NextFunction,
): void {
    if (!request.is("application/json")) {
        next(new InvalidInputError("Content-Type must be application/json"));
        return;
    }

    next();
}