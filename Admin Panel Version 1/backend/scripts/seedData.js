require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');

const MONGODB_URI = 'mongodb+srv://aditi23github:Xenia25@xenia.zwine.mongodb.net/?retryWrites=true&w=majority&appName=Xenia';

const registrations = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    paymentAmount: 1000,
    paymentStatus: "accepted",
    registrationDate: new Date("2024-03-01")
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    paymentAmount: 1500,
    paymentStatus: "pending",
    registrationDate: new Date("2024-03-02")
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "9876543212",
    paymentAmount: 2000,
    paymentStatus: "rejected",
    registrationDate: new Date("2024-03-03")
  },
  {
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "9876543213",
    paymentAmount: 1200,
    paymentStatus: "accepted",
    registrationDate: new Date("2024-03-04")
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    phone: "9876543214",
    paymentAmount: 1800,
    paymentStatus: "pending",
    registrationDate: new Date("2024-03-05")
  },
  {
    name: "Eva Miller",
    email: "eva@example.com",
    phone: "9876543215",
    paymentAmount: 900,
    paymentStatus: "accepted",
    registrationDate: new Date("2024-03-06")
  },
  {
    name: "David Lee",
    email: "david@example.com",
    phone: "9876543216",
    paymentAmount: 2500,
    paymentStatus: "rejected",
    registrationDate: new Date("2024-03-07")
  },
  {
    name: "Grace Taylor",
    email: "grace@example.com",
    phone: "9876543217",
    paymentAmount: 1700,
    paymentStatus: "accepted",
    registrationDate: new Date("2024-03-08")
  },
  {
    name: "Frank Johnson",
    email: "frank@example.com",
    phone: "9876543218",
    paymentAmount: 1300,
    paymentStatus: "pending",
    registrationDate: new Date("2024-03-09")
  },
  {
    name: "Helen White",
    email: "helen@example.com",
    phone: "9876543219",
    paymentAmount: 1600,
    paymentStatus: "accepted",
    registrationDate: new Date("2024-03-10")
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Registration.deleteMany({}); // Clear existing data
    await Registration.insertMany(registrations);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();