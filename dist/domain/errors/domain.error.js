export class DomainError extends Error {
    statusCode;
    code;
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = new.target.name;
    }
}
//# sourceMappingURL=domain.error.js.map