import { ListDirectoryDto } from "../dto/list-directory.dto.js";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";
export declare class ListDirectoryUseCase {
    private readonly fileRepository;
    private readonly pathSecurityService;
    constructor(fileRepository: FileRepositoryPort, pathSecurityService: PathSecurityService);
    execute(dto: ListDirectoryDto): Promise<FileItem[]>;
}
