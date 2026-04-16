import { Router } from "express";
import { FileController } from "../controllers/file.controller.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";
import { validateJsonMiddleware } from "../middleware/validate-json.middleware.js";

export function createFileRouter(fileController: FileController): Router {
    const router = Router();

    router.get("/", fileController.listDirectory);
    router.get("/content", fileController.readFileContent);
    router.post("/folder", validateJsonMiddleware, fileController.createFolder);
    router.post(
        "/upload",
        uploadMiddleware.single("file"),
        fileController.uploadFile,
    );
    router.patch("/rename", validateJsonMiddleware, fileController.renameItem);
    router.patch("/move", validateJsonMiddleware, fileController.moveItem);
    router.delete("/", validateJsonMiddleware, fileController.deleteItem);

    return router;
}