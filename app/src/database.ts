import { connect } from "mongoose";
import dotenv from "dotenv";
import Customer, { ICustomer } from "./customer.model";

dotenv.config();

const DB_URI = process.env.DB_URI || "";

export const connectToDatabase = async () => {
  return connect(DB_URI)
    .then(() => {
      console.log("Successfully connected to DB");
    })
    .catch((err) => {
      console.error("Error connecting to DB: ", err);
      return process.exit(1);
    });
};

export const saveData = async (data: ICustomer[]) => {
  return Customer.insertMany(data)
    .then(() => {
      console.log("Records inserted");
    })
    .catch((err) => {
      console.log(err);
    });
};
