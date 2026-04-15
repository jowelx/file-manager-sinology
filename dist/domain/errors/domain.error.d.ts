export declare class DomainError extends Error {
    readonly statusCode: number;
    readonly code: string;
    constructor(message: string, statusCode: number, code: string);
}
