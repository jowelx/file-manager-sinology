import { DeleteItemDto } from "../dto/delete-item.dto.js";
import { FileRepositoryPort } from "../../domain/ports/file-repository.port.js";
import { PathSecurityService } from "../services/path-security.service.js";
export declare class DeleteItemUseCase {
    private readonly fileRepository;
    private readonly pathSecurityService;
    constructor(fileRepository: FileRepositoryPort, pathSecurityService: PathSecurityService);
    execute(dto: DeleteItemDto): Promise<void>;
}
