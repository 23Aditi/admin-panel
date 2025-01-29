require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Event = require('../models/Event');
const Team = require('../models/Team');

const MONGODB_URI = 'mongodb+srv://aditi23github:pw@xenia.zwine.mongodb.net/test?retryWrites=true&w=majority';

const users = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
  },
];

const events = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Event 1',
    description: 'An exciting event 1',
    date: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Event 2',
    description: 'An exciting event 2',
    date: new Date(),
  },
];

const teams = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Team A',
    leader: users[0]._id,
    members: [users[0]._id, users[1]._id],
    event: events[0]._id,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Team B',
    leader: users[1]._id,
    members: [users[1]._id, users[2]._id],
    event: events[1]._id,
  },
];

const registrations = [
  {
    userId: users[0]._id,
    eventId: events[0]._id,
    teamId: teams[0]._id,
    email: 'john@example.com',
    mobile: '9876543210',
    transactionID: 'TXN001',
    paymentStatus: 'accepted',
    isVerified: true,
  },
  {
    userId: users[1]._id,
    eventId: events[1]._id,
    teamId: teams[1]._id,
    email: 'jane@example.com',
    mobile: '9876543211',
    transactionID: 'TXN002',
    paymentStatus: 'pending',
  },
  {
    userId: users[2]._id,
    eventId: events[0]._id,
    teamId: teams[0]._id,
    email: 'bob@example.com',
    mobile: '9876543212',
    transactionID: 'TXN003',
    paymentStatus: 'rejected',
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');

    console.log('Clearing existing data...');
    await Promise.all([User.deleteMany({}), Event.deleteMany({}), Team.deleteMany({}), Registration.deleteMany({})]);
    console.log('Existing data cleared.');

    console.log('Seeding data...');
    await Promise.all([
      User.insertMany(users),
      Event.insertMany(events),
      Team.insertMany(teams),
      Registration.insertMany(registrations),
    ]);
    console.log('Database seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();