import path from "path";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { FileName } from "../../domain/value-objects/file-name.vo.js";
import { SafePath } from "../../domain/value-objects/safe-path.vo.js";

export class PathSecurityService {
    normalizeRelativePath(input?: string | null): string {
        const raw = (input ?? "").trim().replace(/\\/g, "/");

        if (!raw || raw === "/" || raw === ".") {
            return "";
        }

        const normalized = path.posix.normalize(raw).replace(/^\/+|\/+$/g, "");

        if (!normalized || normalized === ".") {
            return "";
        }

        return new SafePath(normalized).value;
    }

    resolveAbsolutePath(storageRoot: string, relativePath?: string | null): string {
        const normalized = this.normalizeRelativePath(relativePath);
        const absoluteRoot = path.resolve(storageRoot);
        const absolutePath = normalized
            ? path.resolve(absoluteRoot, normalized)
            : absoluteRoot;
        const relativeToRoot = path.relative(absoluteRoot, absolutePath);

        if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
            throw new InvalidPathError("Path escapes the storage root");
        }

        return absolutePath;
    }

    joinRelativePath(basePath: string, itemName: string): string {
        const normalizedBasePath = this.normalizeRelativePath(basePath);
        const validName = new FileName(itemName).value;

        return normalizedBasePath
            ? path.posix.join(normalizedBasePath, validName)
            : validName;
    }

    getParentPath(relativePath: string): string {
        const normalized = this.normalizeRelativePath(relativePath);

        if (!normalized) {
            return "";
        }

        const parentPath = path.posix.dirname(normalized);
        return parentPath === "." ? "" : parentPath;
    }

    getItemName(relativePath: string): string {
        const normalized = this.normalizeRelativePath(relativePath);

        if (!normalized) {
            throw new InvalidPathError("The storage root cannot be used as an item name");
        }

        return path.posix.basename(normalized);
    }

    isSameOrDescendant(sourcePath: string, candidatePath: string): boolean {
        const normalizedSource = this.normalizeRelativePath(sourcePath);
        const normalizedCandidate = this.normalizeRelativePath(candidatePath);

        if (!normalizedSource) {
            return normalizedCandidate === "";
        }

        return (
            normalizedCandidate === normalizedSource ||
            normalizedCandidate.startsWith(`${normalizedSource}/`)
        );
    }
}