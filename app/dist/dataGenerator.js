"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRandomCustomers = void 0;
const faker_1 = require("@faker-js/faker");
const createRandomCustomer = () => {
    return {
        firstName: faker_1.faker.name.firstName(),
        lastName: faker_1.faker.name.lastName(),
        email: faker_1.faker.internet.email(),
        address: {
            line1: faker_1.faker.address.street(),
            line2: faker_1.faker.address.secondaryAddress(),
            postcode: faker_1.faker.address.zipCode(),
            city: faker_1.faker.address.city(),
            state: faker_1.faker.address.stateAbbr(),
            country: faker_1.faker.address.countryCode(),
        },
    };
};
const randomInt = (min, max) => {
    let random = min + Math.random() * (max + 1 - min);
    return Math.floor(random);
};
const collectRandomCustomers = () => {
    const customers = [];
    const count = randomInt(1, 10);
    for (let i = 0; i < count; i++) {
        customers.push(createRandomCustomer());
    }
    console.log(`${count} records generated`);
    return customers;
};
exports.collectRandomCustomers = collectRandomCustomers;
