// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/campus-safety', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Incident Model
const incidentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved'],
        default: 'new'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Incident = mongoose.model('Incident', incidentSchema);

// Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // For demo purposes - replace with proper user authentication
        if (username === 'vnr' && password === 'vnrvjiet') {
            const token = jwt.sign(
                { username },
                'YOUR_SECRET_KEY',
                { expiresIn: '1h' }
            );
            return res.json({ token });
        }
        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create incident
app.post('/api/incidents', async (req, res) => {
    try {
        const incident = new Incident(req.body);
        await incident.save();
        res.status(201).json(incident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all incidents
app.get('/api/incidents', authMiddleware, async (req, res) => {
    try {
        const incidents = await Incident.find()
            .sort({ timestamp: -1 });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update incident status
app.patch('/api/incidents/:id', authMiddleware, async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }
        
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});