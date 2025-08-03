const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        websocket: 'running',
        port: process.env.PORT || 8080
    });
});

// Default response
app.get('/', (req, res) => {
    res.send('Socket.io Server Running');
});

console.log('🚀 Socket.io Server Starting... (NEW FILE)');
console.log('📡 Listening on port', process.env.PORT || 8080);
console.log('🌐 Environment:', process.env.PORT ? 'Railway Production' : 'Local Development');

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('✅ New Socket.io connection established:', socket.id);
    
    // Send welcome message
    socket.emit('CONNECTION_ESTABLISHED', {
        message: 'Socket.io server connected successfully',
        socketId: socket.id,
        timestamp: new Date().toISOString()
    });
    
    // Handle incoming messages
    socket.on('message', (data) => {
        console.log('📨 Received message:', data);
        
        // Echo the message back to confirm receipt
        socket.emit('MESSAGE_RECEIVED', {
            originalMessage: data,
            timestamp: new Date().toISOString()
        });
        
        // If it's a call simulation, broadcast to all connected clients
        if (data.type === 'CALL_SIMULATED') {
            const broadcastMessage = {
                type: 'CALL_SIMULATED_BROADCAST',
                callData: data.callData,
                socketId: socket.id,
                timestamp: new Date().toISOString()
            };
            
            io.emit('CALL_SIMULATED_BROADCAST', broadcastMessage);
            console.log('📢 Broadcasted call simulation to all clients');
        }
    });
    
    // Handle call simulation
    socket.on('CALL_SIMULATED', (data) => {
        console.log('📞 Call simulation received:', data);
        
        const broadcastMessage = {
            type: 'CALL_SIMULATED_BROADCAST',
            callData: data,
            socketId: socket.id,
            timestamp: new Date().toISOString()
        };
        
        io.emit('CALL_SIMULATED_BROADCAST', broadcastMessage);
        console.log('📢 Broadcasted call simulation to all clients');
    });
    
    // Handle connection disconnect
    socket.on('disconnect', () => {
        console.log('🔌 Socket.io connection closed:', socket.id);
    });
    
    // Handle errors
    socket.on('error', (err) => {
        console.log('❌ Socket.io error:', err);
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🎯 Socket.io server is running on ${HOST}:${PORT}`);
    console.log(`🔗 Connect your widget to: ${process.env.PORT ? 'wss://embedd-cti-railway-production.up.railway.app' : 'ws://localhost:8080'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Socket.io server...');
    server.close(() => {
        console.log('✅ Socket.io server closed');
        process.exit(0);
    });
});

// Handle SIGTERM for Railway
process.on('SIGTERM', () => {
    console.log('\n🛑 Railway shutting down Socket.io server...');
    server.close(() => {
        console.log('✅ Socket.io server closed');
        process.exit(0);
    });
});

// Keep the process alive
process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
}); 