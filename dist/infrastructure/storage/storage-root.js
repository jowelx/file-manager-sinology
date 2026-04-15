import fs from "fs/promises";
import path from "path";
export function getStorageRootPath(storageRoot) {
    return path.resolve(process.cwd(), storageRoot);
}
export async function ensureStorageRoot(storageRoot) {
    const absoluteStorageRoot = getStorageRootPath(storageRoot);
    await fs.mkdir(absoluteStorageRoot, { recursive: true });
}
//# sourceMappingURL=storage-root.js.map