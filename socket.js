// Socket.js - WebSocket Communication Module
// Handles real-time communication, connection management, and message handling

// Global socket variables
let socket = null;
let socketId = null;
let isConnected = false;

// Initialize WebSocket connection
function initializeWebSocket() {
    try {
        socketId = Math.floor(Math.random() * 100000000) + 1;
        
        // Try different WebSocket URLs for production and development
        const wsUrls = [
            window.WEBSOCKET_URL || 'wss://embedd-cti-railway-production.up.railway.app',
            'ws://localhost:3001' // Fallback for local development
        ];
        
        // Try to connect to the first available WebSocket server
        let wsUrl = wsUrls[0];
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            wsUrl = 'ws://localhost:3001'; // Use localhost for development
        }
        
        console.log('🔗 Attempting to connect to WebSocket:', wsUrl);
        console.log('📍 Current hostname:', window.location.hostname);
        socket = new WebSocket(wsUrl);
        
        socket.onopen = function() {
            isConnected = true;
            updateWSStatus('Verbonden', 'status-connected');
            addLog('✅ WebSocket verbinding opgezet');
            showToast('WebSocket verbonden!');
            
            // Send initial connection message
            const connectMessage = {
                type: 'CONNECT',
                socketId: socketId,
                timestamp: new Date().toISOString()
            };
            socket.send(JSON.stringify(connectMessage));
            addLog('📤 Verbindingsbericht verzonden: ' + socketId);
        };
        
        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                addLog('❌ Fout bij parsen WebSocket bericht: ' + error.message);
            }
        };
        
        socket.onclose = function() {
            isConnected = false;
            updateWSStatus('Verbroken', 'status-disconnected');
            addLog('🔌 WebSocket verbinding verbroken');
            
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                if (!isConnected) {
                    addLog('🔄 Poging tot herverbinding...');
                    initializeWebSocket();
                }
            }, 5000);
        };
        
        socket.onerror = function(error) {
            isConnected = false;
            updateWSStatus('Fout', 'status-disconnected');
            addLog('❌ WebSocket fout: ' + error);
            console.error('❌ WebSocket error details:', error);
        };
        
    } catch (error) {
        addLog('❌ Kon WebSocket niet initialiseren: ' + error.message);
    }
}

// Handle incoming WebSocket messages
function handleWebSocketMessage(data) {
    addLog('📨 Bericht ontvangen: ' + data.type);
    
    switch (data.type) {
        case 'CONNECTION_ESTABLISHED':
            addLog('✅ WebSocket verbinding bevestigd');
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
            addLog('📨 Onbekend bericht type: ' + data.type);
    }
}

// Send message via WebSocket
function sendWebSocketMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        addLog('📤 Bericht verzonden: ' + message.type);
        return true;
    } else {
        addLog('❌ WebSocket niet beschikbaar voor verzending');
        return false;
    }
}

// Send call simulation
function sendCallSimulation(callData) {
    const message = {
        type: 'CALL_SIMULATED',
        socketId: socketId,
        callData: callData,
        timestamp: new Date().toISOString()
    };
    
    return sendWebSocketMessage(message);
}

// Send SAP integration data
function sendSAPIntegration(sapData) {
    const message = {
        type: 'SAP_INTEGRATION',
        socketId: socketId,
        data: sapData,
        timestamp: new Date().toISOString()
    };
    
    return sendWebSocketMessage(message);
}

// Send test message
function sendTestMessage() {
    const message = {
        type: 'TEST_MESSAGE',
        socketId: socketId,
        data: 'Test from Agent Buddy',
        timestamp: new Date().toISOString()
    };
    
    return sendWebSocketMessage(message);
}

// Update WebSocket status display
function updateWSStatus(status, className) {
    const statusElement = document.getElementById('wsStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status-indicator ${className}"></span>${status}`;
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

// Disconnect WebSocket
function disconnectWebSocket() {
    if (socket) {
        socket.close();
        isConnected = false;
        addLog('🔌 WebSocket handmatig verbroken');
    }
}

// Reconnect WebSocket
function reconnectWebSocket() {
    if (socket) {
        socket.close();
    }
    setTimeout(() => {
        initializeWebSocket();
    }, 1000);
}

// Test connection
function testConnection() {
    if (isConnected) {
        sendTestMessage();
        showToast('✅ Verbinding getest');
    } else {
        showToast('❌ Geen verbinding');
    }
}

// Broadcast message to all connected clients
function broadcastMessage(message) {
    const broadcastData = {
        type: 'BROADCAST',
        socketId: socketId,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    return sendWebSocketMessage(broadcastData);
}

// Handle connection retry
function handleConnectionRetry() {
    if (!isConnected) {
        addLog('🔄 Verbinding opnieuw proberen...');
        initializeWebSocket();
    }
}

// Export socket to global scope for other modules
window.socket = socket;

// Export functions for global access
window.initializeWebSocket = initializeWebSocket;
window.handleWebSocketMessage = handleWebSocketMessage;
window.sendWebSocketMessage = sendWebSocketMessage;
window.sendCallSimulation = sendCallSimulation;
window.sendSAPIntegration = sendSAPIntegration;
window.sendTestMessage = sendTestMessage;
window.updateWSStatus = updateWSStatus;
window.getConnectionStatus = getConnectionStatus;
window.getSocketId = getSocketId;
window.disconnectWebSocket = disconnectWebSocket;
window.reconnectWebSocket = reconnectWebSocket;
window.testConnection = testConnection;
window.broadcastMessage = broadcastMessage;
window.handleConnectionRetry = handleConnectionRetry; 