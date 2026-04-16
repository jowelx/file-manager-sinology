import { FileItem } from "../entities/file-item.entity.js";
import { UploadedFileData } from "../../shared/types/uploaded-file-data.type.js";
import { StoredFileContent } from "../../shared/types/stored-file-content.type.js";
export interface FileRepositoryPort {
    list(relativePath: string): Promise<FileItem[]>;
    getItem(relativePath: string): Promise<FileItem | null>;
    openReadStream(relativePath: string): Promise<StoredFileContent>;
    createFolder(parentRelativePath: string, folderName: string): Promise<FileItem>;
    saveFile(targetRelativePath: string, file: UploadedFileData): Promise<FileItem>;
    rename(targetRelativePath: string, newName: string): Promise<FileItem>;
    delete(targetRelativePath: string): Promise<void>;
    move(sourceRelativePath: string, destinationRelativePath: string): Promise<FileItem>;
    exists(relativePath: string): Promise<boolean>;
    isDirectory(relativePath: string): Promise<boolean>;
}
