const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/club_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Participant = require('./models/Participant');
const User = require('./models/User');
const Event = require('./models/Event');
const Team = require('./models/Team');


// Users Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Events Routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    4
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Teams Routes
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find()
    .populate('eventId','name').lean();
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/teams', async (req, res) => {
  const team = new Team(req.body);
  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/teams/:id', async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});


// Participants Routes
app.get('/api/participants', async (req, res) => {
  try {
    console.log('Fetching participants...');
    const participants = await Participant.find()
      .populate({
        path: 'userId',
        select: 'name',
        options: { lean: true }
      })
      .populate({
        path: 'eventId',
        select: 'name',
        options: { lean: true }
      })
      .populate({
        path: 'teamId',
        select: 'name users max',
        options: { lean: true }
      })
      .lean();
    
    console.log('Participants found:', participants.length);
    res.json(participants);
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/participants', async (req, res) => {
  const participant = new Participant(req.body);
  try {
    const newParticipant = await participant.save();
    const populatedParticipant = await Participant.findById(newParticipant._id)
      .populate('userId', 'name')
      .populate('eventId', 'name')
      .populate('teamId', 'name')
      .lean();
    res.status(201).json(populatedParticipant);
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/participants/:id/verify', async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    )
    .populate('userId', 'name')
    .populate('eventId', 'name')
    .populate('teamId', 'name')
    .lean();
    
    res.json(participant);
  } catch (error) {
    console.error('Error verifying participant:', error);
    res.status(400).json({ message: error.message });
  }
});



// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

