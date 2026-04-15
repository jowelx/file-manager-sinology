import { DomainError } from "./domain.error.js";
export declare class ItemAlreadyExistsError extends DomainError {
    constructor(message?: string);
}
