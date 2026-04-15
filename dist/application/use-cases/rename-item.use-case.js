import { ItemAlreadyExistsError } from "../../domain/errors/item-already-exists.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { FileName } from "../../domain/value-objects/file-name.vo.js";
export class RenameItemUseCase {
    fileRepository;
    pathSecurityService;
    constructor(fileRepository, pathSecurityService) {
        this.fileRepository = fileRepository;
        this.pathSecurityService = pathSecurityService;
    }
    async execute(dto) {
        const targetPath = this.pathSecurityService.normalizeRelativePath(dto.targetPath);
        const newName = new FileName(dto.newName).value;
        const currentItem = await this.fileRepository.getItem(targetPath);
        if (!currentItem) {
            throw new ItemNotFoundError();
        }
        const parentPath = this.pathSecurityService.getParentPath(targetPath);
        const nextPath = this.pathSecurityService.joinRelativePath(parentPath, newName);
        if (nextPath !== targetPath && (await this.fileRepository.exists(nextPath))) {
            throw new ItemAlreadyExistsError("An item with the same name already exists in the current directory");
        }
        if (nextPath === targetPath) {
            return currentItem;
        }
        return this.fileRepository.rename(targetPath, newName);
    }
}
//# sourceMappingURL=rename-item.use-case.js.map