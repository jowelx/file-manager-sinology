import { InvalidInputError } from "../../../domain/errors/invalid-input.error.js";
import { FilePresenter } from "../presenters/file.presenter.js";
export class FileController {
    dependencies;
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    listDirectory = async (request, response, next) => {
        try {
            const path = typeof request.query.path === "string" ? request.query.path : "";
            const items = await this.dependencies.listDirectoryUseCase.execute({ path });
            response.json(FilePresenter.success("Directory listed successfully", { items }));
        }
        catch (error) {
            next(error);
        }
    };
    createFolder = async (request, response, next) => {
        try {
            const folder = await this.dependencies.createFolderUseCase.execute({
                targetPath: request.body.targetPath ?? "",
                folderName: request.body.folderName ?? "",
            });
            response.status(201).json(FilePresenter.success("Folder created successfully", { item: folder }));
        }
        catch (error) {
            next(error);
        }
    };
    uploadFile = async (request, response, next) => {
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
            response.status(201).json(FilePresenter.success("File uploaded successfully", { item }));
        }
        catch (error) {
            next(error);
        }
    };
    renameItem = async (request, response, next) => {
        try {
            const item = await this.dependencies.renameItemUseCase.execute({
                targetPath: request.body.targetPath ?? "",
                newName: request.body.newName ?? "",
            });
            response.json(FilePresenter.success("Item renamed successfully", { item }));
        }
        catch (error) {
            next(error);
        }
    };
    moveItem = async (request, response, next) => {
        try {
            const item = await this.dependencies.moveItemUseCase.execute({
                sourcePath: request.body.sourcePath ?? "",
                destinationDir: request.body.destinationDir ?? "",
            });
            response.json(FilePresenter.success("Item moved successfully", { item }));
        }
        catch (error) {
            next(error);
        }
    };
    deleteItem = async (request, response, next) => {
        try {
            await this.dependencies.deleteItemUseCase.execute({
                targetPath: request.body.targetPath ?? "",
            });
            response.json(FilePresenter.success("Item deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=file.controller.js.map