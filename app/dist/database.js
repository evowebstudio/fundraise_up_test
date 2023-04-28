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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const customer_model_1 = __importDefault(require("./customer.model"));
dotenv_1.default.config();
const DB_URI = process.env.DB_URI || "";
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, mongoose_1.connect)(DB_URI)
        .then(() => {
        console.log("Successfully connected to DB");
    })
        .catch((err) => {
        console.error("Error connecting to DB: ", err);
        return process.exit(1);
    });
});
exports.connectToDatabase = connectToDatabase;
const saveData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return customer_model_1.default.insertMany(data)
        .then(() => {
        console.log("Records inserted");
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.saveData = saveData;
