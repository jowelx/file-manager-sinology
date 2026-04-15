import fs from "fs/promises";
import { InvalidInputError } from "../../domain/errors/invalid-input.error.js";
import { FileItemMapper } from "../mappers/file-item.mapper.js";
export class LocalFileRepository {
    storageRoot;
    pathSecurityService;
    constructor(storageRoot, pathSecurityService) {
        this.storageRoot = storageRoot;
        this.pathSecurityService = pathSecurityService;
    }
    async list(relativePath) {
        const directoryPath = this.resolveAbsolutePath(relativePath);
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        const items = await Promise.all(entries.map(async (entry) => {
            const entryRelativePath = this.pathSecurityService.joinRelativePath(relativePath, entry.name);
            const stats = await fs.stat(this.resolveAbsolutePath(entryRelativePath));
            return FileItemMapper.fromStat(entryRelativePath, stats);
        }));
        return items.sort((left, right) => {
            if (left.type !== right.type) {
                return left.type === "directory" ? -1 : 1;
            }
            return left.name.localeCompare(right.name);
        });
    }
    async getItem(relativePath) {
        if (!relativePath) {
            return null;
        }
        try {
            const stats = await fs.stat(this.resolveAbsolutePath(relativePath));
            return FileItemMapper.fromStat(relativePath, stats);
        }
        catch (error) {
            if (this.isMissingError(error)) {
                return null;
            }
            throw error;
        }
    }
    async createFolder(parentRelativePath, folderName) {
        const folderRelativePath = this.pathSecurityService.joinRelativePath(parentRelativePath, folderName);
        await fs.mkdir(this.resolveAbsolutePath(folderRelativePath));
        return this.getExistingItem(folderRelativePath);
    }
    async saveFile(targetRelativePath, file) {
        const fileRelativePath = this.pathSecurityService.joinRelativePath(targetRelativePath, file.originalName);
        const absoluteFilePath = this.resolveAbsolutePath(fileRelativePath);
        if (file.buffer) {
            await fs.writeFile(absoluteFilePath, file.buffer);
        }
        else if (file.tempPath) {
            await fs.copyFile(file.tempPath, absoluteFilePath);
        }
        else {
            throw new InvalidInputError("File content is missing");
        }
        return this.getExistingItem(fileRelativePath);
    }
    async rename(targetRelativePath, newName) {
        const parentRelativePath = this.pathSecurityService.getParentPath(targetRelativePath);
        const nextRelativePath = this.pathSecurityService.joinRelativePath(parentRelativePath, newName);
        await fs.rename(this.resolveAbsolutePath(targetRelativePath), this.resolveAbsolutePath(nextRelativePath));
        return this.getExistingItem(nextRelativePath);
    }
    async delete(targetRelativePath) {
        await fs.rm(this.resolveAbsolutePath(targetRelativePath), {
            recursive: true,
            force: false,
        });
    }
    async move(sourceRelativePath, destinationRelativePath) {
        const itemName = this.pathSecurityService.getItemName(sourceRelativePath);
        const nextRelativePath = this.pathSecurityService.joinRelativePath(destinationRelativePath, itemName);
        await this.movePath(this.resolveAbsolutePath(sourceRelativePath), this.resolveAbsolutePath(nextRelativePath));
        return this.getExistingItem(nextRelativePath);
    }
    async exists(relativePath) {
        try {
            await fs.access(this.resolveAbsolutePath(relativePath));
            return true;
        }
        catch (error) {
            if (this.isMissingError(error)) {
                return false;
            }
            throw error;
        }
    }
    async isDirectory(relativePath) {
        const stats = await fs.stat(this.resolveAbsolutePath(relativePath));
        return stats.isDirectory();
    }
    resolveAbsolutePath(relativePath) {
        return this.pathSecurityService.resolveAbsolutePath(this.storageRoot, relativePath);
    }
    async getExistingItem(relativePath) {
        const item = await this.getItem(relativePath);
        if (!item) {
            throw new Error(`Expected item to exist at path: ${relativePath}`);
        }
        return item;
    }
    async movePath(sourcePath, targetPath) {
        try {
            await fs.rename(sourcePath, targetPath);
        }
        catch (error) {
            const nodeError = error;
            if (nodeError.code !== "EXDEV") {
                throw error;
            }
            await fs.cp(sourcePath, targetPath, { recursive: true });
            await fs.rm(sourcePath, { recursive: true, force: false });
        }
    }
    isMissingError(error) {
        return error.code === "ENOENT";
    }
}
//# sourceMappingURL=local-file.repository.js.map