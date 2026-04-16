import { NextFunction, Request, Response } from "express";
import { FilePresenter } from "../presenters/file.presenter.js";

export function createApiKeyMiddleware(apiKey: string | null) {
    return function apiKeyMiddleware(
        request: Request,
        response: Response,
        next: NextFunction,
    ): void {
        if (!apiKey) {
            next();
            return;
        }

        const requestApiKey = request.header("x-api-key")?.trim();

        if (!requestApiKey || requestApiKey !== apiKey) {
            response.status(401).json(FilePresenter.error("Invalid API key"));
            return;
        }

        next();
    };
}