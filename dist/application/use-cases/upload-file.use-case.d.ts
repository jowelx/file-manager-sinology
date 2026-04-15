import { UploadFileDto } from "../dto/upload-file.dto.js";
import { FileItem } from "../../domain/entities/file-item.entity.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";
export declare class UploadFileUseCase {
    private readonly fileRepository;
    private readonly pathSecurityService;
    constructor(fileRepository: FileRepositoryPort, pathSecurityService: PathSecurityService);
    execute(dto: UploadFileDto): Promise<FileItem>;
}
