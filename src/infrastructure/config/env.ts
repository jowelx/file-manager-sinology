import dotenv from "dotenv";

dotenv.config();

function parsePort(value: string | undefined): number {
    const parsed = Number(value ?? "3000");

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return 3000;
    }

    return parsed;
}

export const env = {
    port: parsePort(process.env.PORT),
    storageRoot: (process.env.STORAGE_ROOT ?? "storage").trim() || "storage",
    apiKey: (process.env.API_KEY ?? "").trim() || null,
};