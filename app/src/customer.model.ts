import mongoose, { Schema } from "mongoose";

interface IAddress {
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}

export interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
}

const CustomerSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    address: {
      line1: { type: String },
      line2: { type: String },
      postcode: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
