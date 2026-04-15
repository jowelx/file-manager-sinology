import { createApp } from "./app.js";
import { env } from "./infrastructure/config/env.js";
import { ensureStorageRoot, getStorageRootPath } from "./infrastructure/storage/storage-root.js";
function registerProcessErrorHandlers() {
    process.on("uncaughtException", (error) => {
        console.error("Uncaught exception", error);
    });
    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled rejection", reason);
    });
}
async function bootstrap() {
    registerProcessErrorHandlers();
    const absoluteStorageRoot = getStorageRootPath(env.storageRoot);
    try {
        await ensureStorageRoot(env.storageRoot);
    }
    catch (error) {
        console.error("Storage root initialization failed", error);
    }
    const app = createApp(absoluteStorageRoot);
    app.listen(env.port, () => {
        console.log(`File manager server listening on port ${env.port}`);
        console.log(`Storage root: ${absoluteStorageRoot}`);
    });
}
bootstrap().catch((error) => {
    console.error("Server bootstrap failed", error);
});
//# sourceMappingURL=server.js.map