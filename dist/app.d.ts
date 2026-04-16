import { Express } from "express";
interface AppSecurityOptions {
    apiKey: string | null;
}
export declare function createApp(storageRoot: string, securityOptions: AppSecurityOptions): Express;
export {};
