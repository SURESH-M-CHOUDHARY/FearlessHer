require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

mongoose.set('strictQuery', false);

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
connectToDatabase();

// Middleware
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || '*', // Configurable CORS origin
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Static folder for uploads

// Middleware to handle unexpected errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred' });
});

// Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emergencyContacts: [{ type: String }],
    profileImage: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const alertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: String,
    timestamp: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', alertSchema);

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Multer Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.post('/api/update-location', authenticateToken, (req, res) => {
    const { latitude, longitude } = req.body;
    userLocations[req.user.id] = { latitude, longitude };
    res.status(200).json({ message: 'Location updated' });
});

app.post('/api/alerts', authenticateToken, async (req, res) => {
    const { location } = req.body;
    try {
        const alert = new Alert({ userId: req.user.id, location });
        await alert.save();
        res.status(201).json({ message: 'Alert created', alert });
    } catch (error) {
        res.status(500).json({ message: 'Error saving alert', error });
    }
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.user.id });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving alerts', error });
    }
});

app.post('/api/save-contacts', authenticateToken, async (req, res) => {
    const { contacts } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, { emergencyContacts: contacts });
        res.status(200).json({ message: 'Contacts saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving contacts', error });
    }
});

app.post('/api/upload-profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
    try {
        const imagePath = `/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user.id, { profileImage: imagePath });
        res.status(200).json({ message: 'Profile image uploaded', imagePath });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile image', error });
    }
});

app.post('/api/send-notification', async (req, res) => {
    const { userIds, message } = req.body;
    try {
        const response = await sendNotification(userIds, message);
        res.status(200).json({ message: 'Notification sent', response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification', error });
    }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
    const { text } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const message = new Message({ text, userId: req.user.id, username: user.username });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});