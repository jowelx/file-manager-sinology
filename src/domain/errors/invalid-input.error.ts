import { DomainError } from "./domain.error.js";

export class InvalidInputError extends DomainError {
    constructor(message: string) {
        super(message, 400, "INVALID_INPUT");
    }
}