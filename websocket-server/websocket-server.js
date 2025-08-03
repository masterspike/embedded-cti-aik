const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
    // Health check endpoint
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            websocket: 'running'
        }));
        return;
    }
    
    // Default response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server Running');
});

// Create WebSocket server with proper upgrade handling
const wss = new WebSocket.Server({ 
    server,
    path: '/ws' // Add specific path for WebSocket
});

console.log('🚀 WebSocket Server Starting...');
console.log('📡 Listening on port', process.env.PORT || 3001);
console.log('🌐 Environment:', process.env.PORT ? 'Railway Production' : 'Local Development');

// Handle WebSocket connections
wss.on('connection', function connection(ws, req) {
    console.log('✅ New WebSocket connection established');
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'CONNECTION_ESTABLISHED',
        message: 'WebSocket server connected successfully',
        timestamp: new Date().toISOString()
    }));
    
    // Handle incoming messages
    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            console.log('📨 Received message:', data);
            
            // Echo the message back to confirm receipt
            const response = {
                type: 'MESSAGE_RECEIVED',
                originalMessage: data,
                timestamp: new Date().toISOString()
            };
            
            ws.send(JSON.stringify(response));
            console.log('📤 Sent confirmation:', response);
            
            // If it's a call simulation, broadcast to all connected clients
            if (data.type === 'CALL_SIMULATED') {
                const broadcastMessage = {
                    type: 'CALL_SIMULATED_BROADCAST',
                    callData: data.callData,
                    socketId: data.socketId,
                    timestamp: new Date().toISOString()
                };
                
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(broadcastMessage));
                    }
                });
                
                console.log('📢 Broadcasted call simulation to all clients');
            }
            
        } catch (error) {
            console.log('❌ Error parsing message:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid JSON message',
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    // Handle connection close
    ws.on('close', function close() {
        console.log('🔌 WebSocket connection closed');
    });
    
    // Handle errors
    ws.on('error', function error(err) {
        console.log('❌ WebSocket error:', err);
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Add error handling for server start
server.listen(PORT, HOST, () => {
    console.log(`🎯 WebSocket server is running on ${HOST}:${PORT}`);
    console.log(`🔗 Connect your widget to: ${process.env.PORT ? 'wss://embedd-cti-railway-production.up.railway.app' : 'ws://localhost:3001'}`);
}).on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        process.exit(0);
    });
});

// Handle SIGTERM for Railway
process.on('SIGTERM', () => {
    console.log('\n🛑 Railway shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
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