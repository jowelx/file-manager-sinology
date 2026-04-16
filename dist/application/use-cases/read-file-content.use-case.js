import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
export class ReadFileContentUseCase {
    fileRepository;
    pathSecurityService;
    constructor(fileRepository, pathSecurityService) {
        this.fileRepository = fileRepository;
        this.pathSecurityService = pathSecurityService;
    }
    async execute(dto) {
        const targetPath = this.pathSecurityService.normalizeRelativePath(dto.path);
        if (!targetPath) {
            throw new InvalidPathError("A file path is required");
        }
        const item = await this.fileRepository.getItem(targetPath);
        if (!item) {
            throw new ItemNotFoundError("File not found");
        }
        if (item.type !== "file") {
            throw new InvalidPathError("Target path must be a file");
        }
        return this.fileRepository.openReadStream(targetPath);
    }
}
//# sourceMappingURL=read-file-content.use-case.js.map