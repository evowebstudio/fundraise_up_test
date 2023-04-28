"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANONYMIZE_STRING_LENGTH = exports.FULL_REINDEX_LOCK_FILE = exports.COLLECTION_TIME_MS = exports.BATCH_SIZE = exports.DB_COLLECTION_NAME_ANONYMISEDS = exports.DB_COLLECTION_NAME = exports.DB_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB_URI = process.env.DB_URI || "";
exports.DB_COLLECTION_NAME = "customers";
exports.DB_COLLECTION_NAME_ANONYMISEDS = "customers_anonymiseds";
exports.BATCH_SIZE = 1000;
exports.COLLECTION_TIME_MS = 1000;
exports.FULL_REINDEX_LOCK_FILE = "full_reindex.lock";
exports.ANONYMIZE_STRING_LENGTH = 8;
