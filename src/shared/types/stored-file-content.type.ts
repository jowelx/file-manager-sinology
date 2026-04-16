import { ReadStream } from "fs";

export interface StoredFileContent {
    name: string;
    size: number;
    stream: ReadStream;
}