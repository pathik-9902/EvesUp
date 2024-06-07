const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/EvesUp', {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("Error connecting to database:", err));


// User schema and model
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: { type: String, unique: true, required: true },
  fname: String,
  lname: String,
  email: { type: String, unique: true, required: true },
  password: String,
  acStat: String,
});

const User = mongoose.model("User", userSchema);

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Function to generate a new userId
const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ _id: -1 });
  if (!lastUser || !lastUser.userId) {
    return "U1";
  }
  const lastUserId = parseInt(lastUser.userId.slice(1), 10);
  return `U${lastUserId + 1}`;
};

// Login endpoint
app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }]
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: user._id, fname: user.fname }, SECRET_KEY, { expiresIn: "1h" });
        res.send({ message: "Login successfully", token: token, user: user });
        user.acStat = "active";
        await user.save(); // Don't forget to save the updated status
      } else {
        res.status(401).send({ message: "Invalid username/email or password" });
      }
    } else {
      res.status(401).send({ message: "Invalid username/email or password" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).send({ message: "Server error" });
  }
});


// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, fname, lname, email, password, acStat } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).send({ message: "User is already registered" });
    } else {
      const existingUsername = await User.findOne({ username: username });
      if (existingUsername) {
        res.status(400).send({ message: "Username is already taken" });
      } else {
        const userId = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          userId,
          username,
          fname,
          lname,
          email,
          password: hashedPassword,
          acStat,
        });
        await newUser.save();
        res.status(201).send({ message: "Account has been created!! Please Login" });
      }
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// Deactivate user account endpoint
app.post('/deactivate', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      user.acStat = "inactive";
      await user.save();
      res.send({ message: "Account has been deactivated" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error deactivating account:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// Update profile endpoint
app.post("/updateProfile", async (req, res) => {
  const { userId, fname, lname, email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { fname, lname, email } },
      { new: true }
    );
    if (user) {
      res.send({ message: "Profile updated successfully", user });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// Change password endpoint
app.post("/changePassword", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.send({ message: "Password changed successfully" });
      } else {
        res.status(401).send({ message: "Current password is incorrect" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/verifyToken", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (user) {
      res.send({ user });
    } else {
      res.status(401).send({ message: "Invalid token" });
    }
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).send({ message: "Server error" });
  }
});






// Event schema and model
const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  location: String,
  imgbuf: Buffer,
  host: String,
  fee: String,
  userId: String,
});

const Event = mongoose.model('Event', eventSchema);

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/organizer', upload.single('imgbuf'), async (req, res) => {
  try {
    const { title, date, description, location, host, userId, fee } = req.body;

    // Validate required fields
    if (!title || !date || !description || !location || !host || !userId || !fee) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate fee is a valid numeric value
    if (isNaN(parseFloat(fee)) || !isFinite(fee)) {
      return res.status(400).json({ message: 'Invalid fee value' });
    }

    const newEvent = new Event({
      title,
      date,
      description,
      location,
      imgbuf: req.file.buffer,
      host,
      fee,
      userId,
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: 'Error creating event. Please try again later.' });
  }
});

// Get all events endpoint
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events by user ID endpoint
app.get('/api/events/user', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const events = await Event.find({ userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/events/:eventId', upload.single('imgbuf'), async (req, res) => {
  const { eventId } = req.params;
  const { title, date, description, location, host, fee } = req.body;
  const imgbuf = req.file ? req.file.buffer : null;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title;
    event.date = date;
    event.description = description;
    event.location = location;
    event.host = host;
    event.fee = fee;
    if (imgbuf) {
      event.imgbuf = imgbuf;
    }

    await event.save();
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




const deletedEventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  location: String,
  imgbuf: Buffer,
  host: String,
  fee: String,
  userId: String,
});

const DeletedEvent = mongoose.model('DeletedEvent', deletedEventSchema);

app.delete('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create a new deleted event using the event data
    const deletedEvent = new DeletedEvent({
      title: event.title,
      date: event.date,
      description: event.description,
      location: event.location,
      imgbuf: event.imgbuf,
      host: event.host,
      fee: event.fee,
      userId: event.userId,
    });

    // Save the deleted event
    await deletedEvent.save();

    // Delete the event from the Event schema
    await Event.findByIdAndDelete(eventId);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server starting at ${PORT}`);
});
