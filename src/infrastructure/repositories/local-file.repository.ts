import fs from "fs/promises";
import path from "path";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { InvalidInputError } from "../../domain/errors/invalid-input.error.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { UploadedFileData } from "../../shared/types/uploaded-file-data.type.js";
import { PathSecurityService } from "../../application/services/path-security.service.js";
import { FileItemMapper } from "../mappers/file-item.mapper.js";

export class LocalFileRepository implements FileRepositoryPort {
    constructor(
        private readonly storageRoot: string,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async list(relativePath: string): Promise<FileItem[]> {
        const directoryPath = this.resolveAbsolutePath(relativePath);
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        const items = await Promise.all(
            entries.map(async (entry) => {
                const entryRelativePath = this.pathSecurityService.joinRelativePath(
                    relativePath,
                    entry.name,
                );
                const stats = await fs.stat(this.resolveAbsolutePath(entryRelativePath));
                return FileItemMapper.fromStat(entryRelativePath, stats);
            }),
        );

        return items.sort((left, right) => {
            if (left.type !== right.type) {
                return left.type === "directory" ? -1 : 1;
            }

            return left.name.localeCompare(right.name);
        });
    }

    async getItem(relativePath: string): Promise<FileItem | null> {
        if (!relativePath) {
            return null;
        }

        try {
            const stats = await fs.stat(this.resolveAbsolutePath(relativePath));
            return FileItemMapper.fromStat(relativePath, stats);
        } catch (error) {
            if (this.isMissingError(error)) {
                return null;
            }

            throw error;
        }
    }

    async createFolder(parentRelativePath: string, folderName: string): Promise<FileItem> {
        const folderRelativePath = this.pathSecurityService.joinRelativePath(
            parentRelativePath,
            folderName,
        );

        await fs.mkdir(this.resolveAbsolutePath(folderRelativePath));

        return this.getExistingItem(folderRelativePath);
    }

    async saveFile(targetRelativePath: string, file: UploadedFileData): Promise<FileItem> {
        const fileRelativePath = this.pathSecurityService.joinRelativePath(
            targetRelativePath,
            file.originalName,
        );
        const absoluteFilePath = this.resolveAbsolutePath(fileRelativePath);

        if (file.buffer) {
            await fs.writeFile(absoluteFilePath, file.buffer);
        } else if (file.tempPath) {
            await fs.copyFile(file.tempPath, absoluteFilePath);
        } else {
            throw new InvalidInputError("File content is missing");
        }

        return this.getExistingItem(fileRelativePath);
    }

    async rename(targetRelativePath: string, newName: string): Promise<FileItem> {
        const parentRelativePath = this.pathSecurityService.getParentPath(targetRelativePath);
        const nextRelativePath = this.pathSecurityService.joinRelativePath(
            parentRelativePath,
            newName,
        );

        await fs.rename(
            this.resolveAbsolutePath(targetRelativePath),
            this.resolveAbsolutePath(nextRelativePath),
        );

        return this.getExistingItem(nextRelativePath);
    }

    async delete(targetRelativePath: string): Promise<void> {
        await fs.rm(this.resolveAbsolutePath(targetRelativePath), {
            recursive: true,
            force: false,
        });
    }

    async move(sourceRelativePath: string, destinationRelativePath: string): Promise<FileItem> {
        const itemName = this.pathSecurityService.getItemName(sourceRelativePath);
        const nextRelativePath = this.pathSecurityService.joinRelativePath(
            destinationRelativePath,
            itemName,
        );

        await this.movePath(
            this.resolveAbsolutePath(sourceRelativePath),
            this.resolveAbsolutePath(nextRelativePath),
        );

        return this.getExistingItem(nextRelativePath);
    }

    async exists(relativePath: string): Promise<boolean> {
        try {
            await fs.access(this.resolveAbsolutePath(relativePath));
            return true;
        } catch (error) {
            if (this.isMissingError(error)) {
                return false;
            }

            throw error;
        }
    }

    async isDirectory(relativePath: string): Promise<boolean> {
        const stats = await fs.stat(this.resolveAbsolutePath(relativePath));
        return stats.isDirectory();
    }

    private resolveAbsolutePath(relativePath: string): string {
        return this.pathSecurityService.resolveAbsolutePath(this.storageRoot, relativePath);
    }

    private async getExistingItem(relativePath: string): Promise<FileItem> {
        const item = await this.getItem(relativePath);

        if (!item) {
            throw new Error(`Expected item to exist at path: ${relativePath}`);
        }

        return item;
    }

    private async movePath(sourcePath: string, targetPath: string): Promise<void> {
        try {
            await fs.rename(sourcePath, targetPath);
        } catch (error) {
            const nodeError = error as NodeJS.ErrnoException;

            if (nodeError.code !== "EXDEV") {
                throw error;
            }

            await fs.cp(sourcePath, targetPath, { recursive: true });
            await fs.rm(sourcePath, { recursive: true, force: false });
        }
    }

    private isMissingError(error: unknown): boolean {
        return (error as NodeJS.ErrnoException).code === "ENOENT";
    }
}