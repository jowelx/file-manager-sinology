import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { PathSecurityService } from "../services/path-security.service.js";
import { ReadFileContentDto } from "../dto/read-file-content.dto.js";
import { StoredFileContent } from "../../shared/types/stored-file-content.type.js";

export class ReadFileContentUseCase {
    constructor(
        private readonly fileRepository: FileRepositoryPort,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async execute(dto: ReadFileContentDto): Promise<StoredFileContent> {
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