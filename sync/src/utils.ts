import { ICustomer } from "./customer.interface";
import { promises as fs } from "fs";
import { ANONYMIZE_STRING_LENGTH, FULL_REINDEX_LOCK_FILE } from "./constants";

export function anonymizeString(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (result.length < ANONYMIZE_STRING_LENGTH) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function anonymizeCustomer(customer: ICustomer): ICustomer {
  const anonymized = { ...customer };
  anonymized.firstName = anonymizeString();
  anonymized.lastName = anonymizeString();
  anonymized.email = `${anonymizeString()}@${anonymized.email.split("@")[1]}`;
  anonymized.address.line1 = anonymizeString();
  anonymized.address.line2 = anonymizeString();
  anonymized.address.postcode = anonymizeString();
  return anonymized;
}

export async function getResumeToken() {
  try {
    return JSON.parse(await fs.readFile("resume_token.json", "utf8"));
  } catch (error) {
    console.log("No resume token found");
    return null;
  }
}

export async function checkLockFileExists() {
  try {
    await fs.access(FULL_REINDEX_LOCK_FILE, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
