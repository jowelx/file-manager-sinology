export type FileItemType = "file" | "directory";
export interface FileItem {
    name: string;
    relativePath: string;
    type: FileItemType;
    size: number | null;
    modifiedAt: string;
}
