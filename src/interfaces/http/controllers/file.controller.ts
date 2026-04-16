import { NextFunction, Request, Response } from "express";
import { CreateFolderUseCase } from "../../../application/use-cases/create-folder.use-case.js";
import { DeleteItemUseCase } from "../../../application/use-cases/delete-item.use-case.js";
import { ListDirectoryUseCase } from "../../../application/use-cases/list-directory.use-case.js";
import { MoveItemUseCase } from "../../../application/use-cases/move-item.use-case.js";
import { ReadFileContentUseCase } from "../../../application/use-cases/read-file-content.use-case.js";
import { RenameItemUseCase } from "../../../application/use-cases/rename-item.use-case.js";
import { UploadFileUseCase } from "../../../application/use-cases/upload-file.use-case.js";
import { InvalidInputError } from "../../../domain/errors/invalid-input.error.js";
import { FilePresenter } from "../presenters/file.presenter.js";

interface FileControllerDependencies {
    createFolderUseCase: CreateFolderUseCase;
    uploadFileUseCase: UploadFileUseCase;
    renameItemUseCase: RenameItemUseCase;
    deleteItemUseCase: DeleteItemUseCase;
    moveItemUseCase: MoveItemUseCase;
    listDirectoryUseCase: ListDirectoryUseCase;
    readFileContentUseCase: ReadFileContentUseCase;
}

export class FileController {
    constructor(private readonly dependencies: FileControllerDependencies) { }

    listDirectory = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const path = typeof request.query.path === "string" ? request.query.path : "";
            const items = await this.dependencies.listDirectoryUseCase.execute({ path });

            response.json(
                FilePresenter.success("Directory listed successfully", { items }),
            );
        } catch (error) {
            next(error);
        }
    };

    readFileContent = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const targetPath = typeof request.query.path === "string" ? request.query.path : "";
            const disposition = request.query.disposition === "attachment" ? "attachment" : "inline";
            const fileContent = await this.dependencies.readFileContentUseCase.execute({
                path: targetPath,
            });

            response.type(fileContent.name);
            response.setHeader("Content-Length", String(fileContent.size));
            response.setHeader(
                "Content-Disposition",
                `${disposition}; filename*=UTF-8''${encodeURIComponent(fileContent.name)}`,
            );

            fileContent.stream.on("error", next);
            fileContent.stream.pipe(response);
        } catch (error) {
            next(error);
        }
    };

    createFolder = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const folder = await this.dependencies.createFolderUseCase.execute({
                targetPath: request.body.targetPath ?? "",
                folderName: request.body.folderName ?? "",
            });

            response.status(201).json(
                FilePresenter.success("Folder created successfully", { item: folder }),
            );
        } catch (error) {
            next(error);
        }
    };

    uploadFile = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const uploadedFile = request.file;

            if (!uploadedFile) {
                throw new InvalidInputError("File is required");
            }

            const item = await this.dependencies.uploadFileUseCase.execute({
                targetDir: request.body.targetDir ?? "",
                file: {
                    originalName: uploadedFile.originalname,
                    mimeType: uploadedFile.mimetype,
                    buffer: uploadedFile.buffer,
                    size: uploadedFile.size,
                },
            });

            response.status(201).json(
                FilePresenter.success("File uploaded successfully", { item }),
            );
        } catch (error) {
            next(error);
        }
    };

    renameItem = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const item = await this.dependencies.renameItemUseCase.execute({
                targetPath: request.body.targetPath ?? "",
                newName: request.body.newName ?? "",
            });

            response.json(
                FilePresenter.success("Item renamed successfully", { item }),
            );
        } catch (error) {
            next(error);
        }
    };

    moveItem = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const item = await this.dependencies.moveItemUseCase.execute({
                sourcePath: request.body.sourcePath ?? "",
                destinationDir: request.body.destinationDir ?? "",
            });

            response.json(
                FilePresenter.success("Item moved successfully", { item }),
            );
        } catch (error) {
            next(error);
        }
    };

    deleteItem = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            await this.dependencies.deleteItemUseCase.execute({
                targetPath: request.body.targetPath ?? "",
            });

            response.json(
                FilePresenter.success("Item deleted successfully", null),
            );
        } catch (error) {
            next(error);
        }
    };
}