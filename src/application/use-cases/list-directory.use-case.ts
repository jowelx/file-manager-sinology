import { ListDirectoryDto } from "../dto/list-directory.dto.js";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";

export class ListDirectoryUseCase {
    constructor(
        private readonly fileRepository: FileRepositoryPort,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async execute(dto: ListDirectoryDto): Promise<FileItem[]> {
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