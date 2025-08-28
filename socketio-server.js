const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();

// Add CORS headers for all routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Always allow the production origin
    if (origin === 'https://glowing-frangollo-44ac94.netlify.app') {
        res.header('Access-Control-Allow-Origin', origin);
    } else if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        // Allow localhost for development
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        // For all other requests, allow the production origin
        res.header('Access-Control-Allow-Origin', 'https://glowing-frangollo-44ac94.netlify.app');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'false');
    res.header('Access-Control-Max-Age', '86400');
    
    console.log('🌐 CORS headers set for:', origin, 'Method:', req.method, 'URL:', req.url);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('🛡️ Handling preflight request');
        res.status(200).end();
        return;
    }
    
    next();
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://glowing-frangollo-44ac94.netlify.app",
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
    allowEIO4: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e8,
    connectTimeout: 45000,
    path: '/socket.io/'
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        websocket: 'running',
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Default response
app.get('/', (req, res) => {
    res.send('Socket.io Server Running on Render.com');
});

console.log('🚀 Socket.io Server Starting on Render.com...');
console.log('📡 Listening on port', process.env.PORT || 3000);
console.log('🌐 Environment:', process.env.NODE_ENV || 'development');

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('✅ New Socket.io connection established:', socket.id);
    console.log('🌐 Client origin:', socket.handshake.headers.origin);
    console.log('🔗 Client transport:', socket.handshake.transport);
    
    // Send welcome message
    socket.emit('CONNECTION_ESTABLISHED', {
        message: 'Socket.io server connected successfully on Render.com',
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
        
        // Handle call accept events
        if (data.type === 'CALL_ACCEPTED') {
            console.log('✅ Call accepted by agent:', data);
            
            const acceptMessage = {
                type: 'CALL_ACCEPTED',
                phoneNumber: data.phoneNumber,
                callId: data.callId,
                agentId: socket.id,
                timestamp: new Date().toISOString()
            };
            
            // Broadcast to all clients
            io.emit('CALL_ACCEPTED', acceptMessage);
            console.log('📢 Broadcasted call accepted to all clients');
        }
        
        // Handle call decline events
        if (data.type === 'CALL_DECLINED') {
            console.log('❌ Call declined by agent:', data);
            
            const declineMessage = {
                type: 'CALL_DECLINED',
                phoneNumber: data.phoneNumber,
                callId: data.callId,
                agentId: socket.id,
                timestamp: new Date().toISOString()
            };
            
            // Broadcast to all clients
            io.emit('CALL_DECLINED', declineMessage);
            console.log('📢 Broadcasted call declined to all clients');
        }
        
        // Handle call end events
        if (data.type === 'CALL_ENDED') {
            console.log('📞 Call ended:', data);
            
            const endMessage = {
                type: 'CALL_ENDED',
                phoneNumber: data.phoneNumber,
                callId: data.callId,
                agentId: socket.id,
                timestamp: new Date().toISOString()
            };
            
            // Broadcast to all clients
            io.emit('CALL_ENDED', endMessage);
            console.log('📢 Broadcasted call ended to all clients');
        }
        
        // Handle SAP integration messages
        if (data.type === 'SAP_INTEGRATION') {
            console.log('🏢 SAP Integration message received:', data.data);
            
            // Broadcast SAP message to all connected clients
            const sapBroadcastMessage = {
                type: 'SAP_INTEGRATION_BROADCAST',
                sapData: data.data,
                socketId: socket.id,
                timestamp: new Date().toISOString()
            };
            
            io.emit('SAP_INTEGRATION_BROADCAST', sapBroadcastMessage);
            console.log('📢 Broadcasted SAP integration message to all clients');
            
            // Log the SAP payload for debugging
            console.log('📋 SAP Payload:', JSON.stringify(data.data, null, 2));
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
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🎯 Socket.io server is running on ${HOST}:${PORT}`);
    console.log(`🔗 Connect your widget to: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Socket.io server...');
    server.close(() => {
        console.log('✅ Socket.io server closed');
        process.exit(0);
    });
});

// Handle SIGTERM for Render
process.on('SIGTERM', () => {
    console.log('\n🛑 Render shutting down Socket.io server...');
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