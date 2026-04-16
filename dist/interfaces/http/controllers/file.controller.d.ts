import { NextFunction, Request, Response } from "express";
import { CreateFolderUseCase } from "../../../application/use-cases/create-folder.use-case.js";
import { DeleteItemUseCase } from "../../../application/use-cases/delete-item.use-case.js";
import { ListDirectoryUseCase } from "../../../application/use-cases/list-directory.use-case.js";
import { MoveItemUseCase } from "../../../application/use-cases/move-item.use-case.js";
import { ReadFileContentUseCase } from "../../../application/use-cases/read-file-content.use-case.js";
import { RenameItemUseCase } from "../../../application/use-cases/rename-item.use-case.js";
import { UploadFileUseCase } from "../../../application/use-cases/upload-file.use-case.js";
interface FileControllerDependencies {
    createFolderUseCase: CreateFolderUseCase;
    uploadFileUseCase: UploadFileUseCase;
    renameItemUseCase: RenameItemUseCase;
    deleteItemUseCase: DeleteItemUseCase;
    moveItemUseCase: MoveItemUseCase;
    listDirectoryUseCase: ListDirectoryUseCase;
    readFileContentUseCase: ReadFileContentUseCase;
}
export declare class FileController {
    private readonly dependencies;
    constructor(dependencies: FileControllerDependencies);
    listDirectory: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    readFileContent: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    createFolder: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    uploadFile: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    renameItem: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    moveItem: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    deleteItem: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}
export {};
