import { faker } from "@faker-js/faker";
import { ICustomer } from "./customer.model";

const createRandomCustomer = (): ICustomer => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    address: {
      line1: faker.address.street(),
      line2: faker.address.secondaryAddress(),
      postcode: faker.address.zipCode(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      country: faker.address.countryCode(),
    },
  };
};

const randomInt = (min: number, max: number): number => {
  let random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

export const collectRandomCustomers = (): ICustomer[] => {
  const customers = [];
  const count = randomInt(1, 10);
  for (let i = 0; i < count; i++) {
    customers.push(createRandomCustomer());
  }
  console.log(`${count} records generated`);
  return customers;
};
