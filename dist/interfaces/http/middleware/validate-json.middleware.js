import { InvalidInputError } from "../../../domain/errors/invalid-input.error.js";
export function validateJsonMiddleware(request, _response, next) {
    if (!request.is("application/json")) {
        next(new InvalidInputError("Content-Type must be application/json"));
        return;
    }
    next();
}
//# sourceMappingURL=validate-json.middleware.js.map