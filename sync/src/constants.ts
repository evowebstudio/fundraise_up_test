import dotenv from "dotenv";
dotenv.config();

export const DB_URI = process.env.DB_URI || "";
export const DB_COLLECTION_NAME = "customers";
export const DB_COLLECTION_NAME_ANONYMISEDS = "customers_anonymiseds";
export const BATCH_SIZE = 1000;
export const COLLECTION_TIME_MS = 1000;
export const FULL_REINDEX_LOCK_FILE = "full_reindex.lock";
export const ANONYMIZE_STRING_LENGTH = 8;
