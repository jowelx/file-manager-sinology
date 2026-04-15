import fs from "fs/promises";
import path from "path";

export function getStorageRootPath(storageRoot: string): string {
    return path.resolve(process.cwd(), storageRoot);
}

export async function ensureStorageRoot(storageRoot: string): Promise<void> {
    const absoluteStorageRoot = getStorageRootPath(storageRoot);
    await fs.mkdir(absoluteStorageRoot, { recursive: true });
}