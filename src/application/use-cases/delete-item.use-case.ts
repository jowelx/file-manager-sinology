import { DeleteItemDto } from "../dto/delete-item.dto.js";
import { InvalidPathError } from "../../domain/errors/invalid-path.error.js";
import { ItemNotFoundError } from "../../domain/errors/item-not-found.error.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";

export class DeleteItemUseCase {
    constructor(
        private readonly fileRepository: FileRepositoryPort,
        private readonly pathSecurityService: PathSecurityService,
    ) { }

    async execute(dto: DeleteItemDto): Promise<void> {
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