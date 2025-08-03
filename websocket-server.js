const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server Running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

console.log('🚀 WebSocket Server Starting...');
console.log('📡 Listening on port 3001');
console.log('🌐 Connect to: ws://localhost:3001');

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
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🎯 WebSocket server is running on port ${PORT}`);
    console.log(`🔗 Connect your widget to: ws://localhost:3001`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        process.exit(0);
    });
}); 