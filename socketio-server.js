const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Simple CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://glowing-frangollo-44ac94.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'false');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

// Simple Socket.io setup
const io = socketIo(server, {
    cors: {
        origin: "https://glowing-frangollo-44ac94.netlify.app",
        methods: ["GET", "POST"],
        credentials: false
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        websocket: 'running'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Socket.io Server Running on Render.com');
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    
    // Send welcome message
    socket.emit('CONNECTION_ESTABLISHED', {
        message: 'Connected to Socket.io server',
        socketId: socket.id,
        timestamp: new Date().toISOString()
    });
    
    // Handle messages
    socket.on('message', (data) => {
        console.log('📨 Received message:', data);
        socket.emit('MESSAGE_RECEIVED', {
            originalMessage: data,
            timestamp: new Date().toISOString()
        });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
}); 