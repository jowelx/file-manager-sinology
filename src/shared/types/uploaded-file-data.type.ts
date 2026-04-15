export interface UploadedFileData {
    originalName: string;
    mimeType: string;
    buffer?: Buffer;
    tempPath?: string;
    size: number;
}