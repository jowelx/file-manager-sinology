import { DomainError } from "./domain.error.js";
export class InvalidInputError extends DomainError {
    constructor(message) {
        super(message, 400, "INVALID_INPUT");
    }
}
//# sourceMappingURL=invalid-input.error.js.map