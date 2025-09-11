// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customers');

const MONGO_URI = process.env.MONGO_URI;

const customers = [
  { name: "Mohit Sharma", email: "mohit@example.com", phone: "9000000001", spend: 12000, visits: 2, last_active: "2025-06-01" },
  { name: "Anjali Verma", email: "anjali@example.com", phone: "9000000002", spend: 3000, visits: 5, last_active: "2025-07-20" },
  { name: "Ravi Singh", email: "ravi@example.com", phone: "9000000003", spend: 600, visits: 1, last_active: "2024-12-01" },
  { name: "Priya Kaur", email: "priya@example.com", phone: "9000000004", spend: 9000, visits: 3, last_active: "2025-04-10" },
  { name: "Arun Patel", email: "arun@example.com", phone: "9000000005", spend: 15000, visits: 4, last_active: "2025-05-05" }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB, inserting customers...');
    await Customer.deleteMany({}); // optional — clears existing
    const inserted = await Customer.insertMany(customers);
    console.log('Inserted:', inserted.length);
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
