import path from "path";
import { Stats } from "fs";
import { FileItem } from "../../domain/entities/file-item.entity.js";

export class FileItemMapper {
    static fromStat(relativePath: string, stats: Stats): FileItem {
        return {
            name: path.posix.basename(relativePath) || "",
            relativePath,
            type: stats.isDirectory() ? "directory" : "file",
            size: stats.isDirectory() ? null : stats.size,
            modifiedAt: stats.mtime.toISOString(),
        };
    }
}