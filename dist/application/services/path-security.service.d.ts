export declare class PathSecurityService {
    normalizeRelativePath(input?: string | null): string;
    resolveAbsolutePath(storageRoot: string, relativePath?: string | null): string;
    joinRelativePath(basePath: string, itemName: string): string;
    getParentPath(relativePath: string): string;
    getItemName(relativePath: string): string;
    isSameOrDescendant(sourcePath: string, candidatePath: string): boolean;
}
