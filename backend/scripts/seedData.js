require('dotenv').config();
const mongoose = require('mongoose');
const Participant = require('../models/Participant');
const User = require('../models/User');
const Event = require('../models/Event');
const Team = require('../models/Team');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aditi23github:Xenia25@xenia.zwine.mongodb.net/test?retryWrites=true&w=majority';

// Function to clear previous records of all tables
async function clearDatabase() {
  try {
    console.log('Clearing previous records...');
    await Promise.all([
      User.deleteMany({}),  
      Event.deleteMany({}),
      Team.deleteMany({}),
      Participant.deleteMany({}),
    ]);
    console.log('All previous records cleared.');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB.');

    // Clear previous records before inserting new ones
    await clearDatabase();

    console.log('Seeding new data...');

    const users = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123', // Plain text password (you can hash later if needed)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Jane Doe',
        email: 'jane@example.com',
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
        leadername: 'John Doe',
        eventId: events[0]._id,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Team B',
        leadername: 'Jane Doe',
        eventId: events[1]._id,
      },
    ];

    const participants = [
      {
        userId: users[0]._id,
        eventId: events[0]._id,
        teamId: teams[0]._id,
        email: 'john@example.com',
        mobile: '9876543210',
        pictian: true,
        college: 'PICT',
        classname: 'TE-1',
        rollNo: '33243',
        transactionID: 'TXN001',
        isVerified: true,
      },
      {
        userId: users[1]._id,
        eventId: events[1]._id,
        teamId: teams[1]._id,
        email: 'jane@example.com',
        mobile: '9876543211',
        pictian: false,
        college: 'Other College',
        transactionID: 'TXN002',
      },
    ];

    await Promise.all([
      User.insertMany(users),
      Event.insertMany(events),
      Team.insertMany(teams),
      Participant.insertMany(participants),
    ]);

    console.log('Database seeded successfully.');

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seeding process
seedDatabase();
