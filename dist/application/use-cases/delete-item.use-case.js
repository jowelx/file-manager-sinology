import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
export class DeleteItemUseCase {
    fileRepository;
    pathSecurityService;
    constructor(fileRepository, pathSecurityService) {
        this.fileRepository = fileRepository;
        this.pathSecurityService = pathSecurityService;
    }
    async execute(dto) {
        const targetPath = this.pathSecurityService.normalizeRelativePath(dto.targetPath);
        if (!targetPath) {
            throw new InvalidPathError("The storage root cannot be deleted");
        }
        if (!(await this.fileRepository.exists(targetPath))) {
            throw new ItemNotFoundError();
        }
        await this.fileRepository.delete(targetPath);
    }
}
//# sourceMappingURL=delete-item.use-case.js.map