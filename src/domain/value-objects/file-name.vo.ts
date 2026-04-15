import { InvalidNameError } from "../errors/invalid-name.error.js";

export class FileName {
    public readonly value: string;

    constructor(value: string) {
        const normalized = value.trim();

        if (!normalized) {
            throw new InvalidNameError("Name cannot be empty");
        }

        if (normalized === "." || normalized === "..") {
            throw new InvalidNameError("Reserved names are not allowed");
        }

        if (/[/\\\0]/.test(normalized)) {
            throw new InvalidNameError("Name cannot contain path separators or null bytes");
        }

        this.value = normalized;
    }
}