import { ObjectId } from "mongodb";

export interface ICustomer {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
  createdAt: Date;
}

interface IAddress {
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}
