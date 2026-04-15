import multer from "multer";
import { DomainError } from "../../../domain/errors/domain.error.js";
import { FilePresenter } from "../presenters/file.presenter.js";
export function errorHandlerMiddleware(error, _request, response, _next) {
    if (error instanceof DomainError) {
        response
            .status(error.statusCode)
            .json(FilePresenter.error(error.message));
        return;
    }
    if (error instanceof multer.MulterError) {
        response.status(400).json(FilePresenter.error(error.message));
        return;
    }
    console.error("Unexpected request error", error);
    response.status(500).json(FilePresenter.error("Unexpected server error"));
}
//# sourceMappingURL=error-handler.middleware.js.map