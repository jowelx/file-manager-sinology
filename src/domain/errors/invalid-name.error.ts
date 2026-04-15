import { DomainError } from "./domain.error.js";

export class InvalidNameError extends DomainError {
    constructor(message = "Invalid item name") {
        super(message, 400, "INVALID_NAME");
    }
}