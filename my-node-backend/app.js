const express = require('express');
const cors = require('cors'); // Import cors

const app = express();

// Use cors to allow cross-origin requests
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods if needed
    credentials: true // Include if you are sending cookies
}));

// Middleware
app.use(express.json());

// Your routes
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
