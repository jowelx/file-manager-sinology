import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
export class ListDirectoryUseCase {
    fileRepository;
    pathSecurityService;
    constructor(fileRepository, pathSecurityService) {
        this.fileRepository = fileRepository;
        this.pathSecurityService = pathSecurityService;
    }
    async execute(dto) {
        const targetPath = this.pathSecurityService.normalizeRelativePath(dto.path);
        if (targetPath) {
            if (!(await this.fileRepository.exists(targetPath))) {
                throw new ItemNotFoundError("Directory not found");
            }
            if (!(await this.fileRepository.isDirectory(targetPath))) {
                throw new InvalidPathError("Target path must be a directory");
            }
        }
        return this.fileRepository.list(targetPath);
    }
}
//# sourceMappingURL=list-directory.use-case.js.map