import { connectToDatabase, saveData } from "./database";
import { collectRandomCustomers } from "./dataGenerator";

const bootstrap = async () => {
  await connectToDatabase();
  setInterval(async () => {
    const data = collectRandomCustomers();
    await saveData(data);
  }, 200);
};

bootstrap();
