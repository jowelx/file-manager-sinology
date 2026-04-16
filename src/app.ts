import cors from "cors";
import express, { Express } from "express";
import { PathSecurityService } from "./application/services/path-security.service.js";
import { CreateFolderUseCase } from "./application/use-cases/create-folder.use-case.js";
import { DeleteItemUseCase } from "./application/use-cases/delete-item.use-case.js";
import { ListDirectoryUseCase } from "./application/use-cases/list-directory.use-case.js";
import { MoveItemUseCase } from "./application/use-cases/move-item.use-case.js";
import { ReadFileContentUseCase } from "./application/use-cases/read-file-content.use-case.js";
import { RenameItemUseCase } from "./application/use-cases/rename-item.use-case.js";
import { UploadFileUseCase } from "./application/use-cases/upload-file.use-case.js";
import { LocalFileRepository } from "./infrastructure/repositories/local-file.repository.js";
import { FileController } from "./interfaces/http/controllers/file.controller.js";
import { createApiKeyMiddleware } from "./interfaces/http/middleware/api-key.middleware.js";
import { errorHandlerMiddleware } from "./interfaces/http/middleware/error-handler.middleware.js";
import { createFileRouter } from "./interfaces/http/routes/file.routes.js";

interface AppSecurityOptions {
    apiKey: string | null;
}

export function createApp(storageRoot: string, securityOptions: AppSecurityOptions): Express {
    const pathSecurityService = new PathSecurityService();
    const fileRepository = new LocalFileRepository(storageRoot, pathSecurityService);
    const fileController = new FileController({
        createFolderUseCase: new CreateFolderUseCase(fileRepository, pathSecurityService),
        uploadFileUseCase: new UploadFileUseCase(fileRepository, pathSecurityService),
        renameItemUseCase: new RenameItemUseCase(fileRepository, pathSecurityService),
        deleteItemUseCase: new DeleteItemUseCase(fileRepository, pathSecurityService),
        moveItemUseCase: new MoveItemUseCase(fileRepository, pathSecurityService),
        listDirectoryUseCase: new ListDirectoryUseCase(fileRepository, pathSecurityService),
        readFileContentUseCase: new ReadFileContentUseCase(fileRepository, pathSecurityService),
    });

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/health", (_request, response) => {
        response.json({ success: true, message: "File manager is running" });
    });

    app.use("/api/files", createApiKeyMiddleware(securityOptions.apiKey));
    app.use("/api/files", createFileRouter(fileController));
    app.use(errorHandlerMiddleware);

    return app;
}