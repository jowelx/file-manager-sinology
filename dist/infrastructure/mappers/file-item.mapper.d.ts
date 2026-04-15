import { Stats } from "fs";
import { FileItem } from "../../domain/entities/file-item.entity.js";
export declare class FileItemMapper {
    static fromStat(relativePath: string, stats: Stats): FileItem;
}
