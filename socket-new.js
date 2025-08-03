// Socket.js - Socket.io Communication Module (NEW VERSION - CACHE BUSTED)
console.log('🚀 Loading NEW socket.js version - cache busted!');
// Handles real-time communication, connection management, and message handling

let socket = null;
let isConnected = false;
let socketId = null;

// Initialize Socket.io connection
function initializeWebSocket() {
    try {
        // Generate unique socket ID
        socketId = 'socket_' + Math.random().toString(36).substr(2, 9);
        
        // Try to connect to the first available Socket.io server
        let socketUrl = 'http://localhost:8080'; // Default to localhost for development
        
        // Only use Railway URL if we're on production (Netlify)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            socketUrl = window.SOCKET_URL || 'https://embedd-cti-railway-production.up.railway.app';
        }
        
        console.log('🔗 Attempting to connect to Socket.io:', socketUrl);
        console.log('📍 Current hostname:', window.location.hostname);
        
        // Load Socket.io client library
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.onload = function() {
            // Initialize Socket.io connection
            socket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });
            
            socket.on('connect', function() {
                isConnected = true;
                socketId = socket.id;
                updateWSStatus('Verbonden', 'status-connected');
                addLog('✅ Socket.io verbinding opgezet');
                showToast('Socket.io verbonden!');
                
                // Send initial connection message
                const connectMessage = {
                    type: 'CONNECT',
                    socketId: socketId,
                    timestamp: new Date().toISOString()
                };
                socket.emit('message', connectMessage);
                addLog('📤 Verbindingsbericht verzonden: ' + socketId);
            });
            
            socket.on('CONNECTION_ESTABLISHED', function(data) {
                addLog('✅ Socket.io verbinding bevestigd');
                handleWebSocketMessage(data);
            });
            
            socket.on('CALL_SIMULATED_BROADCAST', function(data) {
                addLog('📢 Call simulatie ontvangen');
                handleWebSocketMessage(data);
            });
            
            socket.on('MESSAGE_RECEIVED', function(data) {
                addLog('📡 Bericht bevestiging ontvangen');
                handleWebSocketMessage(data);
            });
            
            socket.on('disconnect', function() {
                isConnected = false;
                updateWSStatus('Verbroken', 'status-disconnected');
                addLog('🔌 Socket.io verbinding verbroken');
                
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (!isConnected) {
                        addLog('🔄 Poging tot herverbinding...');
                        initializeWebSocket();
                    }
                }, 5000);
            });
            
            socket.on('connect_error', function(error) {
                isConnected = false;
                updateWSStatus('Fout', 'status-disconnected');
                addLog('❌ Socket.io verbindingsfout: ' + error);
                console.error('❌ Socket.io error details:', error);
            });
            
        };
        document.head.appendChild(script);
        
    } catch (error) {
        addLog('❌ Kon Socket.io niet initialiseren: ' + error.message);
    }
}

// Handle incoming Socket.io messages
function handleWebSocketMessage(data) {
    addLog('📨 Bericht ontvangen: ' + (data.type || 'unknown'));
    
    switch (data.type) {
        case 'CONNECTION_ESTABLISHED':
            addLog('✅ Socket.io verbinding bevestigd');
            break;
            
        case 'CALL_SIMULATED_BROADCAST':
            handleIncomingCall(data.callData);
            break;
            
        case 'CALL_INCOMING':
            handleIncomingCall(data.callData);
            break;
            
        case 'MESSAGE_RECEIVED':
            addLog('📡 Bericht bevestiging ontvangen');
            break;
            
        case 'SAP_INTEGRATION':
            addLog('🏢 SAP integratie bericht ontvangen');
            break;
            
        case 'ERROR':
            addLog('❌ Server fout: ' + data.message);
            break;
            
        default:
            addLog('📨 Onbekend bericht type: ' + (data.type || 'unknown'));
    }
}

// Send message via Socket.io
function sendWebSocketMessage(message) {
    if (socket && socket.connected) {
        socket.emit('message', message);
        addLog('📤 Bericht verzonden: ' + message.type);
        return true;
    } else {
        addLog('❌ Socket.io niet beschikbaar voor verzending');
        return false;
    }
}

// Send call simulation
function sendCallSimulation(callData) {
    if (socket && socket.connected) {
        socket.emit('CALL_SIMULATED', callData);
        addLog('📞 Call simulatie verzonden');
        return true;
    } else {
        addLog('❌ Socket.io niet beschikbaar voor call simulatie');
        return false;
    }
}

// Send SAP integration message
function sendSAPIntegration(sapData) {
    if (socket && socket.connected) {
        socket.emit('SAP_INTEGRATION', sapData);
        addLog('🏢 SAP integratie bericht verzonden');
        return true;
    } else {
        addLog('❌ Socket.io niet beschikbaar voor SAP integratie');
        return false;
    }
}

// Send test message
function sendTestMessage() {
    const testMessage = {
        type: 'TEST',
        message: 'Test bericht van Agent Buddy',
        timestamp: new Date().toISOString()
    };
    return sendWebSocketMessage(testMessage);
}

// Update WebSocket status display
function updateWSStatus(status, className) {
    const statusElement = document.getElementById('ws-status');
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'status-indicator ' + className;
    }
}

// Get connection status
function getConnectionStatus() {
    return isConnected;
}

// Get socket ID
function getSocketId() {
    return socketId;
}

// Disconnect Socket.io
function disconnectWebSocket() {
    if (socket) {
        socket.disconnect();
        isConnected = false;
        addLog('🔌 Socket.io handmatig verbroken');
    }
}

// Reconnect Socket.io
function reconnectWebSocket() {
    if (socket) {
        socket.connect();
        addLog('🔄 Socket.io herverbinding gestart');
    }
}

// Test connection
function testConnection() {
    if (socket && socket.connected) {
        sendTestMessage();
        addLog('🧪 Socket.io verbinding getest');
    } else {
        addLog('❌ Socket.io niet verbonden voor test');
    }
}

// Broadcast message to all clients
function broadcastMessage(message) {
    if (socket && socket.connected) {
        socket.emit('broadcast', message);
        addLog('📢 Bericht uitgezonden naar alle clients');
    } else {
        addLog('❌ Socket.io niet beschikbaar voor broadcast');
    }
}

// Handle connection retry
function handleConnectionRetry() {
    if (!isConnected) {
        addLog('🔄 Socket.io herverbinding...');
        initializeWebSocket();
    }
} 