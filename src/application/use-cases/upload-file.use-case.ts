import { UploadFileDto } from "../dto/upload-file.dto.js";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { InvalidInputError } from "../../domain/errors/invalid-input.error.js";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemAlreadyExistsError } from "../../domain/errors/item-already-exists.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { FileName } from "../../domain/value-objects/file-name.vo.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";

export class UploadFileUseCase {
    constructor(
        private readonly fileRepository: FileRepositoryPort,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async execute(dto: UploadFileDto): Promise<FileItem> {
        if (!dto.file) {
            throw new InvalidInputError("File is required");
        }

        if (!dto.file.buffer && !dto.file.tempPath) {
            throw new InvalidInputError("File content is missing");
        }

        const targetDir = this.pathSecurityService.normalizeRelativePath(dto.targetDir);
        const fileName = new FileName(dto.file.originalName).value;

        if (targetDir) {
            if (!(await this.fileRepository.exists(targetDir))) {
                throw new ItemNotFoundError("Target directory does not exist");
            }

            if (!(await this.fileRepository.isDirectory(targetDir))) {
                throw new InvalidPathError("Target path must be a directory");
            }
        }

        const filePath = this.pathSecurityService.joinRelativePath(targetDir, fileName);

        if (await this.fileRepository.exists(filePath)) {
            throw new ItemAlreadyExistsError("A file with the same name already exists in the target directory");
        }

        return this.fileRepository.saveFile(targetDir, {
            ...dto.file,
            originalName: fileName,
        });
    }
}