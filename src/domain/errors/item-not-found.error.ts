import { DomainError } from "./domain.error.js";

export class ItemNotFoundError extends DomainError {
    constructor(message = "Item not found") {
        super(message, 404, "ITEM_NOT_FOUND");
    }
}