import { DomainError } from "./domain.error.js";
export class ItemAlreadyExistsError extends DomainError {
    constructor(message = "Item already exists") {
        super(message, 409, "ITEM_ALREADY_EXISTS");
    }
}
//# sourceMappingURL=item-already-exists.error.js.map