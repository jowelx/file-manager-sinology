import { DomainError } from "./domain.error.js";

export class InvalidPathError extends DomainError {
    constructor(message = "Invalid path") {
        super(message, 400, "INVALID_PATH");
    }
}