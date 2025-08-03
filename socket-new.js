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
        let socketUrl = 'http://localhost:3001'; // Default to localhost for development
        
        // Only use Render URL if we're on production (Netlify)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Safe check for config - if not available, use fallback
            let configSocketUrl = null;
            try {
                if (window.CONFIG && window.getConfig) {
                    configSocketUrl = getConfig('SOCKET_URL');
                    console.log('🔧 Config gevonden, SOCKET_URL:', configSocketUrl);
                } else {
                    console.log('⚠️ Config niet beschikbaar, gebruik fallback URL');
                }
            } catch (error) {
                console.log('⚠️ Config error:', error.message);
            }
            
            // Try multiple fallback URLs
            socketUrl = configSocketUrl || window.SOCKET_URL || 'https://agent-buddy-socketio.onrender.com';
            
            // If Render.com fails, we can add more fallbacks here
            console.log('🔗 Using Socket.io URL:', socketUrl);
        }
        
        console.log('🔗 Attempting to connect to Socket.io:', socketUrl);
        console.log('📍 Current hostname:', window.location.hostname);
        console.log('🌐 Protocol:', window.location.protocol);
        console.log('🔗 Full URL:', window.location.href);
        console.log('📋 Config status:', window.CONFIG ? 'Available' : 'Not available');
        console.log('🔧 getConfig status:', typeof window.getConfig);
        
        // Update initial status
        updateWSStatus('Verbinding maken...', 'status-connecting');
        
        // Load Socket.io client library
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.onload = function() {
            console.log('📦 Socket.io library geladen');
        };
        script.onerror = function() {
            console.error('❌ Socket.io library kon niet geladen worden');
            addLog('❌ Socket.io library fout');
        };
        script.onload = function() {
            // Initialize Socket.io connection
            socket = io(socketUrl, {
                transports: ['polling'],
                timeout: 30000,
                forceNew: true,
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                withCredentials: false
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
            
            socket.on('CALL_ACCEPTED', function(data) {
                addLog('✅ Call geaccepteerd door agent');
                handleCallAccepted(data);
            });
            
            socket.on('CALL_DECLINED', function(data) {
                addLog('❌ Call afgewezen door agent');
                handleCallDeclined(data);
            });
            
            socket.on('CALL_ENDED', function(data) {
                addLog('📞 Call beëindigd');
                handleCallEnded(data);
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
                addLog('❌ Socket.io verbindingsfout: ' + error.message);
                console.error('🔍 Detailed connect error:', error);
                
                // Log more details for debugging
                console.log('🌐 Current URL:', socketUrl);
                console.log('🔗 Socket state:', socket.connected);
                console.log('📡 Transport:', socket.io.engine.transport.name);
                
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (!isConnected) {
                        addLog('🔄 Poging tot herverbinding...');
                        initializeWebSocket();
                    }
                }, 5000);
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
            
        case 'SAP_INTEGRATION_BROADCAST':
            console.log('🏢 SAP Integration broadcast received:', data);
            addLog('📨 SAP bericht ontvangen: ' + data.sapData.Action);
            
            // Update SAP status based on the action
            if (data.sapData.Action === 'ACCEPT') {
                document.getElementById('sapStatus').textContent = 'Verbonden';
                document.getElementById('lastSapAction').textContent = 'Call geaccepteerd';
                addLog('✅ SAP ACCEPT verwerkt');
            } else if (data.sapData.Action === 'DECLINE') {
                document.getElementById('sapStatus').textContent = 'Verbroken';
                document.getElementById('lastSapAction').textContent = 'Call afgewezen';
                addLog('❌ SAP DECLINE verwerkt');
            } else if (data.sapData.Action === 'NOTIFY') {
                document.getElementById('sapStatus').textContent = 'Actief';
                document.getElementById('lastSapAction').textContent = 'Call notificatie';
                addLog('📢 SAP NOTIFY verwerkt');
            }
            break;
            
        case 'ERROR':
            addLog('❌ Server fout: ' + data.message);
            break;
            
        default:
            addLog('📨 Onbekend bericht type: ' + (data.type || 'unknown'));
    }
}

// Handle call accepted event
function handleCallAccepted(data) {
    console.log('✅ Call accepted event:', data);
    addLog('✅ Call geaccepteerd: ' + (data.phoneNumber || 'unknown'));
    
    // Update UI
    document.getElementById('callStatus').textContent = 'Geaccepteerd';
    document.getElementById('lastAction').textContent = 'Call geaccepteerd';
    
    // Send to SAP
    if (window.sendCallAccept) {
        window.sendCallAccept(data.phoneNumber, data.callId);
    }
    
    // Disable accept/decline buttons
    const acceptBtn = document.getElementById('acceptButton');
    const declineBtn = document.getElementById('declineButton');
    if (acceptBtn) acceptBtn.disabled = true;
    if (declineBtn) declineBtn.disabled = true;
}

// Handle call declined event
function handleCallDeclined(data) {
    console.log('❌ Call declined event:', data);
    addLog('❌ Call afgewezen: ' + (data.phoneNumber || 'unknown'));
    
    // Update UI
    document.getElementById('callStatus').textContent = 'Afgewezen';
    document.getElementById('lastAction').textContent = 'Call afgewezen';
    
    // Send to SAP
    if (window.sendCallDecline) {
        window.sendCallDecline(data.phoneNumber, data.callId);
    }
    
    // Disable accept/decline buttons
    const acceptBtn = document.getElementById('acceptButton');
    const declineBtn = document.getElementById('declineButton');
    if (acceptBtn) acceptBtn.disabled = true;
    if (declineBtn) declineBtn.disabled = true;
}

// Handle call ended event
function handleCallEnded(data) {
    console.log('📞 Call ended event:', data);
    addLog('📞 Call beëindigd: ' + (data.phoneNumber || 'unknown'));
    
    // Update UI
    document.getElementById('callStatus').textContent = 'Beëindigd';
    document.getElementById('lastAction').textContent = 'Call beëindigd';
    
    // Re-enable accept/decline buttons for next call
    const acceptBtn = document.getElementById('acceptButton');
    const declineBtn = document.getElementById('declineButton');
    if (acceptBtn) acceptBtn.disabled = false;
    if (declineBtn) declineBtn.disabled = false;
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
    const statusElement = document.getElementById('wsStatus');
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'status-indicator ' + className;
        console.log('📊 WebSocket status bijgewerkt naar:', status);
    } else {
        console.warn('⚠️ wsStatus element niet gevonden');
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