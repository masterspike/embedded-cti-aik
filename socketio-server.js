const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Basic CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://glowing-frangollo-44ac94.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
    res.send('Socket.io Server Running');
});

// Socket.io
const io = socketIo(server, {
    cors: {
        origin: "https://glowing-frangollo-44ac94.netlify.app",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.emit('CONNECTION_ESTABLISHED', {
        message: 'Connected to Socket.io server',
        socketId: socket.id,
        timestamp: new Date().toISOString()
    });
    
    socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('MESSAGE_RECEIVED', {
            originalMessage: data,
            timestamp: new Date().toISOString()
        });
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 