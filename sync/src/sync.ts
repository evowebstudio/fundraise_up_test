import { MongoClient, WithId } from "mongodb";
import {
  anonymizeCustomer,
  checkLockFileExists,
  getResumeToken,
} from "./utils";
import { promises as fs } from "fs";
import { ICustomer } from "./customer.interface";
import {
  BATCH_SIZE,
  COLLECTION_TIME_MS,
  DB_COLLECTION_NAME,
  DB_COLLECTION_NAME_ANONYMISEDS,
  DB_URI,
  FULL_REINDEX_LOCK_FILE,
} from "./constants";

async function bootstrap() {
  const client = await MongoClient.connect(DB_URI);
  const db = client.db();
  await db.command({ ping: 1 });
  console.log("Successfully connected to DB");

  const customers = db.collection(DB_COLLECTION_NAME);
  const customersAnonymized = db.collection(DB_COLLECTION_NAME_ANONYMISEDS);

  if (process.argv[2] === "--full-reindex") {
    await fs.writeFile(FULL_REINDEX_LOCK_FILE, "");
    setTimeout(async () => {
      await customersAnonymized.drop();
      const data = await customers.find().toArray();
      const anonymizedCustomers = data.map((item: WithId<ICustomer>) =>
        anonymizeCustomer(item)
      );
      await customersAnonymized.insertMany(anonymizedCustomers);
    }, COLLECTION_TIME_MS);
    await fs.unlink(FULL_REINDEX_LOCK_FILE);
    process.exit(0);
  } else {
    let timeoutId: NodeJS.Timeout;
    let resumeToken = await getResumeToken();

    const insertStream = customers.watch(
      [
        {
          $match: { operationType: "insert" },
        },
      ],
      {
        fullDocument: "updateLookup",
        resumeAfter: resumeToken,
      }
    );
    let batch: ICustomer[] = [];
    insertStream.on("change", async (change: { fullDocument: ICustomer }) => {
      const lockFileExists = await checkLockFileExists();

      if (!lockFileExists) {
        const anonymizedData: ICustomer = anonymizeCustomer(
          change.fullDocument
        );
        batch.push(anonymizedData);

        if (batch.length === BATCH_SIZE) {
          clearTimeout(timeoutId);
          await executeInsertTransaction();
        } else if (!timeoutId) {
          timeoutId = setTimeout(async () => {
            await executeInsertTransaction();
          }, COLLECTION_TIME_MS);
        }
      }

      async function executeInsertTransaction() {
        if (batch.length === 0) {
          return;
        }

        const session = client.startSession();
        try {
          await session.withTransaction(async () => {
            const data: ICustomer[] = batch;
            batch = [];
            await customersAnonymized.insertMany(data, { session });
          });
          await session.commitTransaction();
        } catch (error) {
          console.error("Error in INSERT stream:", error);
          await session.abortTransaction();
        } finally {
          await session.endSession();
          clearTimeout(timeoutId);
          timeoutId = undefined;
          resumeToken = insertStream.resumeToken;
          await fs.writeFile("resume_token.json", JSON.stringify(resumeToken));
        }
      }
    });

    const updateStream = customers.watch(
      [
        {
          $match: { operationType: "update" },
        },
      ],
      {
        fullDocument: "updateLookup",
      }
    );
    updateStream.on("change", async (change: { fullDocument: ICustomer }) => {
      const lockFileExists = await checkLockFileExists();
      if (!lockFileExists) {
        const anonymizedData: ICustomer = anonymizeCustomer(
          change.fullDocument
        );
        await customersAnonymized.updateOne(
          { _id: anonymizedData._id },
          { $set: anonymizedData }
        );
      }
    });
  }
}

bootstrap();
