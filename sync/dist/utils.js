"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLockFileExists = exports.getResumeToken = exports.anonymizeCustomer = exports.anonymizeString = void 0;
const fs_1 = require("fs");
const constants_1 = require("./constants");
function anonymizeString() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    while (result.length < constants_1.ANONYMIZE_STRING_LENGTH) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
exports.anonymizeString = anonymizeString;
function anonymizeCustomer(customer) {
    const anonymized = Object.assign({}, customer);
    anonymized.firstName = anonymizeString();
    anonymized.lastName = anonymizeString();
    anonymized.email = `${anonymizeString()}@${anonymized.email.split("@")[1]}`;
    anonymized.address.line1 = anonymizeString();
    anonymized.address.line2 = anonymizeString();
    anonymized.address.postcode = anonymizeString();
    return anonymized;
}
exports.anonymizeCustomer = anonymizeCustomer;
function getResumeToken() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return JSON.parse(yield fs_1.promises.readFile("resume_token.json", "utf8"));
        }
        catch (error) {
            console.log("No resume token found");
            return null;
        }
    });
}
exports.getResumeToken = getResumeToken;
function checkLockFileExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.promises.access(constants_1.FULL_REINDEX_LOCK_FILE, fs_1.promises.constants.F_OK);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
exports.checkLockFileExists = checkLockFileExists;
