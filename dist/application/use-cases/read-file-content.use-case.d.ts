import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";
import { ReadFileContentDto } from "../dto/read-file-content.dto.js";
import { StoredFileContent } from "../../shared/types/stored-file-content.type.js";
export declare class ReadFileContentUseCase {
    private readonly fileRepository;
    private readonly pathSecurityService;
    constructor(fileRepository: FileRepositoryPort, pathSecurityService: PathSecurityService);
    execute(dto: ReadFileContentDto): Promise<StoredFileContent>;
}
