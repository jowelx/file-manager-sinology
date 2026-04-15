import { CreateFolderDto } from "../dto/create-folder.dto.js";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemAlreadyExistsError } from "../../domain/errors/item-already-exists.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { FileName } from "../../domain/value-objects/file-name.vo.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";

export class CreateFolderUseCase {
    constructor(
        private readonly fileRepository: FileRepositoryPort,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async execute(dto: CreateFolderDto): Promise<FileItem> {
        const targetPath = this.pathSecurityService.normalizeRelativePath(dto.targetPath);
        const folderName = new FileName(dto.folderName).value;

        if (targetPath) {
            const targetExists = await this.fileRepository.exists(targetPath);

            if (!targetExists) {
                throw new ItemNotFoundError("Target directory does not exist");
            }

            if (!(await this.fileRepository.isDirectory(targetPath))) {
                throw new InvalidPathError("Target path must be a directory");
            }
        }

        const folderPath = this.pathSecurityService.joinRelativePath(targetPath, folderName);

        if (await this.fileRepository.exists(folderPath)) {
            throw new ItemAlreadyExistsError("An item with the same name already exists in the target directory");
        }

        return this.fileRepository.createFolder(targetPath, folderName);
    }
}