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
const mongodb_1 = require("mongodb");
const utils_1 = require("./utils");
const fs_1 = require("fs");
const constants_1 = require("./constants");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield mongodb_1.MongoClient.connect(constants_1.DB_URI);
        const db = client.db();
        yield db.command({ ping: 1 });
        console.log("Successfully connected to DB");
        const customers = db.collection(constants_1.DB_COLLECTION_NAME);
        const customersAnonymized = db.collection(constants_1.DB_COLLECTION_NAME_ANONYMISEDS);
        if (process.argv[2] === "--full-reindex") {
            yield fs_1.promises.writeFile(constants_1.FULL_REINDEX_LOCK_FILE, "");
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield customersAnonymized.drop();
                const data = yield customers.find().toArray();
                const anonymizedCustomers = data.map((item) => (0, utils_1.anonymizeCustomer)(item));
                yield customersAnonymized.insertMany(anonymizedCustomers);
            }), constants_1.COLLECTION_TIME_MS);
            yield fs_1.promises.unlink(constants_1.FULL_REINDEX_LOCK_FILE);
            process.exit(0);
        }
        else {
            let timeoutId;
            let resumeToken = yield (0, utils_1.getResumeToken)();
            const insertStream = customers.watch([
                {
                    $match: { operationType: "insert" },
                },
            ], {
                fullDocument: "updateLookup",
                resumeAfter: resumeToken,
            });
            let batch = [];
            insertStream.on("change", (change) => __awaiter(this, void 0, void 0, function* () {
                const lockFileExists = yield (0, utils_1.checkLockFileExists)();
                if (!lockFileExists) {
                    const anonymizedData = (0, utils_1.anonymizeCustomer)(change.fullDocument);
                    batch.push(anonymizedData);
                    if (batch.length === constants_1.BATCH_SIZE) {
                        clearTimeout(timeoutId);
                        yield executeInsertTransaction();
                    }
                    else if (!timeoutId) {
                        timeoutId = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield executeInsertTransaction();
                        }), constants_1.COLLECTION_TIME_MS);
                    }
                }
                function executeInsertTransaction() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (batch.length === 0) {
                            return;
                        }
                        const session = client.startSession();
                        try {
                            yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                                const data = batch;
                                batch = [];
                                yield customersAnonymized.insertMany(data, { session });
                            }));
                            yield session.commitTransaction();
                        }
                        catch (error) {
                            console.error("Error in INSERT stream:", error);
                            yield session.abortTransaction();
                        }
                        finally {
                            yield session.endSession();
                            clearTimeout(timeoutId);
                            timeoutId = undefined;
                            resumeToken = insertStream.resumeToken;
                            yield fs_1.promises.writeFile("resume_token.json", JSON.stringify(resumeToken));
                        }
                    });
                }
            }));
            const updateStream = customers.watch([
                {
                    $match: { operationType: "update" },
                },
            ], {
                fullDocument: "updateLookup",
            });
            updateStream.on("change", (change) => __awaiter(this, void 0, void 0, function* () {
                const lockFileExists = yield (0, utils_1.checkLockFileExists)();
                if (!lockFileExists) {
                    const anonymizedData = (0, utils_1.anonymizeCustomer)(change.fullDocument);
                    yield customersAnonymized.updateOne({ _id: anonymizedData._id }, { $set: anonymizedData });
                }
            }));
        }
    });
}
bootstrap();
