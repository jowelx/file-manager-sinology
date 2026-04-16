import { FilePresenter } from "../presenters/file.presenter.js";
export function createApiKeyMiddleware(apiKey) {
    return function apiKeyMiddleware(request, response, next) {
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
//# sourceMappingURL=api-key.middleware.js.map