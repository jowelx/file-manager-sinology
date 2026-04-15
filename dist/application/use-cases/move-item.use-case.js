import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemAlreadyExistsError } from "../../domain/errors/item-already-exists.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
export class MoveItemUseCase {
    fileRepository;
    pathSecurityService;
    constructor(fileRepository, pathSecurityService) {
        this.fileRepository = fileRepository;
        this.pathSecurityService = pathSecurityService;
    }
    async execute(dto) {
        const sourcePath = this.pathSecurityService.normalizeRelativePath(dto.sourcePath);
        const destinationDir = this.pathSecurityService.normalizeRelativePath(dto.destinationDir);
        if (!sourcePath) {
            throw new InvalidPathError("The storage root cannot be moved");
        }
        const sourceItem = await this.fileRepository.getItem(sourcePath);
        if (!sourceItem) {
            throw new ItemNotFoundError("Source item does not exist");
        }
        if (destinationDir) {
            if (!(await this.fileRepository.exists(destinationDir))) {
                throw new ItemNotFoundError("Destination directory does not exist");
            }
            if (!(await this.fileRepository.isDirectory(destinationDir))) {
                throw new InvalidPathError("Destination path must be a directory");
            }
        }
        if (sourceItem.type === "directory" &&
            this.pathSecurityService.isSameOrDescendant(sourcePath, destinationDir)) {
            throw new InvalidPathError("A directory cannot be moved inside itself or one of its descendants");
        }
        const nextPath = this.pathSecurityService.joinRelativePath(destinationDir, sourceItem.name);
        if (nextPath !== sourcePath && (await this.fileRepository.exists(nextPath))) {
            throw new ItemAlreadyExistsError("An item with the same name already exists in the destination directory");
        }
        if (nextPath === sourcePath) {
            return sourceItem;
        }
        return this.fileRepository.move(sourcePath, destinationDir);
    }
}
//# sourceMappingURL=move-item.use-case.js.map