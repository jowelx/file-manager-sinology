import { InvalidPathError } from "../errors/invalid-path.error.js";
export class SafePath {
    value;
    constructor(value) {
        if (value.includes("\\") || value.includes("\0")) {
            throw new InvalidPathError("Path contains invalid characters");
        }
        if (value.startsWith("/") || value === "." || value === "..") {
            throw new InvalidPathError("Path must stay within the storage root");
        }
        if (value.includes("/../") || value.startsWith("../") || value.endsWith("/..")) {
            throw new InvalidPathError("Path traversal is not allowed");
        }
        this.value = value;
    }
}
//# sourceMappingURL=safe-path.vo.js.map