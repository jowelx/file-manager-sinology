import { UploadedFileData } from "../../shared/types/uploaded-file-data.type.js";
export interface UploadFileDto {
    targetDir: string;
    file: UploadedFileData;
}
