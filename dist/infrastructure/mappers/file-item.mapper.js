import path from "path";
export class FileItemMapper {
    static fromStat(relativePath, stats) {
        return {
            name: path.posix.basename(relativePath) || "",
            relativePath,
            type: stats.isDirectory() ? "directory" : "file",
            size: stats.isDirectory() ? null : stats.size,
            modifiedAt: stats.mtime.toISOString(),
        };
    }
}
//# sourceMappingURL=file-item.mapper.js.map