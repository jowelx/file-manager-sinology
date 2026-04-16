import { NextFunction, Request, Response } from "express";
export declare function createApiKeyMiddleware(apiKey: string | null): (request: Request, response: Response, next: NextFunction) => void;
