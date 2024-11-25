// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const bcrypt = require('bcryptjs'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const axios = require('axios');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string
const mongoURI = 'mongodb+srv://1ep22cs116:Vaibhav123@mycluster.z4vvm.mongodb.net/women_safety?retryWrites=true&w=majority';

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if the connection fails
    }
};

connectToDatabase();

app.use(cors({
    origin: '*', // Allow all origins (for development only)
}));
app.use(bodyParser.json());

// Define a Mongoose schema for users
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emergencyContacts: [{ type: String }],
    profileImage: { type: String }
});

// Create a Mongoose model for users, checking if it already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Define a Mongoose schema for alerts
const alertSchema = new mongoose.Schema({
    userId: String,
    location: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a Mongoose model for alerts
const Alert = mongoose.model('Alert', alertSchema);

// In-memory storage for user locations (for demonstration purposes)
const userLocations = {}; // { userId: { latitude, longitude } }

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Endpoint to register a new user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Endpoint to login a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        console.log('User not found:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('Password mismatch for user:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    console.log('Token received:', token); // Log the token
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.error('Token verification failed:', err); // Log the error
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Endpoint to update user location (call this when the user logs in or updates their location)
app.post('/api/update-location', authenticateToken, async (req, res) => {
    const { latitude, longitude } = req.body;
    userLocations[req.user.id] = { latitude, longitude };
    res.status(200).json({ message: 'Location updated' });
});

// Modify the existing /api/alerts endpoint to notify nearby users
app.post('/api/alerts', authenticateToken, async (req, res) => {
    console.log('Alert received:', req.body); // Log the received alert
    const { username, location } = req.body; // Get username and location from the request
    const alert = new Alert({ userId: req.user.id, location });

    try {
        await alert.save(); // Save the alert to the database
        console.log('Alert saved:', alert); // Log saved alert

        // Notify nearby users (simple example)
        const nearbyUsers = Object.entries(userLocations).filter(([userId, loc]) => {
            const [lat, lon] = loc.latitude.split(','); // Assuming loc is stored as a string
            const distance = calculateDistance(lat, lon, location); // Implement this function
            return distance < 5; // Example: within 5 km
        });

        // Prepare the response with nearby users
        const nearbyUserDetails = nearbyUsers.map(([userId, loc]) => ({
            userId,
            location: loc,
        }));

        res.status(201).json({ message: 'Bachao Bachao!', alert, nearbyUsers: nearbyUserDetails });
    } catch (error) {
        console.error('Error saving alert:', error); // Log error
        res.status(500).json({ message: 'Error saving alert', error });
    }
});

// Function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

// Endpoint to get all distress alerts (protected)
app.get('/api/alerts', authenticateToken, async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.user.id }); // Retrieve alerts for the authenticated user
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving alerts', error });
    }
});

const sendNotification = async (userIds, message) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic dqkmxpaiyemznvnpuixvbtyir',
    };

    const data = {
        app_id: '9602db57-3f2b-47eb-aebd-2fcdd8c16d2e',
        include_external_user_ids: userIds, // Array of user IDs
        contents: { en: message },
    };

    try {
        const response = await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
        console.log('Notification sent:', response.data); // Log the response from OneSignal
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error); // Log any errors
        throw error;
    }
};

// Example usage in an endpoint
app.post('/api/send-notification', async (req, res) => {
    const { userIds, message } = req.body;
    try {
        const result = await sendNotification(userIds, message);
        res.status(200).json({ message: 'Notification sent', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification', error });
    }
});

// Endpoint to save emergency contacts
app.post('/api/save-contacts', authenticateToken, async (req, res) => {
    const { contacts } = req.body;

    try {
        await User.findByIdAndUpdate(req.user.id, { emergencyContacts: contacts });
        res.status(200).json({ message: 'Contacts saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving contacts', error });
    }
});

// Endpoint to upload profile image
app.post('/api/upload-profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
    try {
        const imagePath = `/uploads/${req.file.filename}`;
        const result = await User.findByIdAndUpdate(req.user.id, { profileImage: imagePath });
        console.log('Update result:', result);
        res.status(200).json({ message: 'Profile image uploaded successfully', imagePath });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ message: 'Error uploading profile image', error });
    }
});

app.get('/api/user-profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile image', error });
    }
});

const messageSchema = new mongoose.Schema({
    text: String,
    userId: String,
    username: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

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
    const user = await User.findById(req.user.id); // Get the user to retrieve the username

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user); // Log the user object

    const message = new Message({ text, userId: req.user.id, username: user.username }); // Include username

    try {
        await message.save();
        res.status(201).json(message); // Ensure this includes the username
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});