import { FileItem } from "../../domain/entities/file-item.entity.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { UploadedFileData } from "../../shared/types/uploaded-file-data.type.js";
import { PathSecurityService } from "../../application/services/path-security.service.js";
export declare class LocalFileRepository implements FileRepositoryPort {
    private readonly storageRoot;
    private readonly pathSecurityService;
    constructor(storageRoot: string, pathSecurityService: PathSecurityService);
    list(relativePath: string): Promise<FileItem[]>;
    getItem(relativePath: string): Promise<FileItem | null>;
    createFolder(parentRelativePath: string, folderName: string): Promise<FileItem>;
    saveFile(targetRelativePath: string, file: UploadedFileData): Promise<FileItem>;
    rename(targetRelativePath: string, newName: string): Promise<FileItem>;
    delete(targetRelativePath: string): Promise<void>;
    move(sourceRelativePath: string, destinationRelativePath: string): Promise<FileItem>;
    exists(relativePath: string): Promise<boolean>;
    isDirectory(relativePath: string): Promise<boolean>;
    private resolveAbsolutePath;
    private getExistingItem;
    private movePath;
    private isMissingError;
}
