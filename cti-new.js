// CTI.js - Call Telephony Integration Module
// Handles call management, customer identification, and SAP integration

// Global CTI variables
let currentCall = null;
let sapServiceCloud = null;
let customerData = null;

// Initialize CTI module
function initializeCTI() {
    console.log('🚀 CTI module geïnitialiseerd');
    initializeSAPIntegration();
}

// Initialize SAP Service Cloud integration
function initializeSAPIntegration() {
    // Check if running in SAP Service Cloud environment
    if (typeof window.parent !== 'undefined' && window.parent.postMessage) {
        console.log('SAP Service Cloud integration available');
        sapServiceCloud = {
            sendMessage: function(message) {
                window.parent.postMessage(message, '*');
            },
            receiveMessage: function(event) {
                if (event.data && event.data.type) {
                    handleSAPMessage(event.data);
                }
            }
        };

        // Listen for messages from SAP Service Cloud
        window.addEventListener('message', sapServiceCloud.receiveMessage);

        // Notify SAP Service Cloud that widget is ready
        sapServiceCloud.sendMessage({
            type: 'WIDGET_READY',
            widgetId: 'agent-buddy-cti'
        });
        
        addLog('🏢 SAP Service Cloud integratie geactiveerd');
    } else {
        addLog('⚠️ SAP Service Cloud niet gedetecteerd - running in standalone mode');
    }
}

// Handle incoming call
function handleIncomingCall(callData) {
    currentCall = callData;
    
    // Update call notification
    document.getElementById('incomingPhoneNumber').textContent = callData.phoneNumber || 'Onbekend';
    document.getElementById('callTime').textContent = new Date().toLocaleTimeString();
    document.getElementById('callId').textContent = callData.callId || 'N/A';
    document.getElementById('callStatus').textContent = 'Wachtend';
    
    // Show call notification
    document.getElementById('callNotification').classList.remove('hidden');
    document.getElementById('noCallMessage').classList.add('hidden');
    
    addLog('📞 Incoming call: ' + callData.phoneNumber);
    showToast('🔔 Nieuwe incoming call!');
    
    // Send SAP notification for incoming call
    sendSAPIncomingNotification(callData);
}

// Send SAP notification for incoming call
function sendSAPIncomingNotification(callData) {
    if (sapServiceCloud) {
        const sapNotification = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "NOTIFY", 
            "ANI": callData.phoneNumber || "+31651616126",
            "ExternalReferenceID": callData.callId || generateExternalReferenceId(),
            "Timestamp": new Date().toISOString()
        };
        
        sapServiceCloud.sendMessage(sapNotification);
        addLog('📢 SAP notificatie verzonden voor incoming call');
        
        // Send via Socket.io if available
        if (window.socket && window.socket.connected) {
            const socketMessage = {
                type: 'SAP_INTEGRATION',
                data: sapNotification
            };
            window.socket.emit('message', socketMessage);
            addLog('📡 SAP NOTIFY payload verzonden via Socket.io');
        }
    }
}

// Accept call
function acceptCall() {
    if (!currentCall) return;
    
    addLog('✅ Call geaccepteerd: ' + currentCall.phoneNumber);
    document.getElementById('callStatus').textContent = 'Geaccepteerd';
    
    // Identify customer in SAP
    identifyCustomer(currentCall.phoneNumber);
    
    // Send to SAP Service Cloud
    sendToSAPServiceCloud(currentCall);
    
    // Hide call notification after delay
    setTimeout(() => {
        document.getElementById('callNotification').classList.add('hidden');
        document.getElementById('noCallMessage').classList.remove('hidden');
        currentCall = null;
    }, 3000);
    
    showToast('✅ Call geaccepteerd en naar SAP verzonden!');
}

// Decline call
function declineCall() {
    if (!currentCall) return;
    
    addLog('❌ Call afgewezen: ' + currentCall.phoneNumber);
    document.getElementById('callStatus').textContent = 'Afgewezen';
    
    // Send SAP decline notification
    sendSAPDeclineNotification(currentCall);
    
    // Show decline popup
    showDeclinePopup(currentCall);
    
    // Hide call notification after delay
    setTimeout(() => {
        document.getElementById('callNotification').classList.add('hidden');
        document.getElementById('noCallMessage').classList.remove('hidden');
        currentCall = null;
    }, 3000);
    
    showToast('❌ Call afgewezen');
}

// Send SAP decline notification
function sendSAPDeclineNotification(callData) {
    if (sapServiceCloud) {
        const sapPayload = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "DECLINE", 
            "ANI": callData.phoneNumber || "+31651616126",
            "ExternalReferenceID": callData.callId || generateExternalReferenceId(),
            "Timestamp": new Date().toISOString()
        };
        
        sapServiceCloud.sendMessage(sapPayload);
        addLog('❌ SAP DECLINE payload verzonden: ' + JSON.stringify(sapPayload));
        
        // Send via Socket.io if available
        if (window.socket && window.socket.connected) {
            const socketMessage = {
                type: 'SAP_INTEGRATION',
                data: sapPayload
            };
            window.socket.emit('message', socketMessage);
            addLog('📡 SAP DECLINE payload verzonden via Socket.io');
        }
    }
}

// Identify customer by phone number
function identifyCustomer(phoneNumber) {
    addLog('🔍 Klant identificeren voor: ' + phoneNumber);
    
    // Simulate customer lookup (replace with actual SAP API call)
    customerData = {
        name: 'Indy Vidueel',
        id: 'NSR' + Math.floor(Math.random() * 10000),
        email: 'indy.vidueel@ns.nl',
        company: 'Indy BV',
        phoneNumber: phoneNumber
    };
    
    // Update customer info display
    document.getElementById('customerName').textContent = customerData.name;
    document.getElementById('customerId').textContent = customerData.id;
    document.getElementById('customerEmail').textContent = customerData.email;
    document.getElementById('customerCompany').textContent = customerData.company;
    
    // Show customer info
    document.getElementById('customerInfo').classList.remove('hidden');
    document.getElementById('noCustomerMessage').classList.add('hidden');
    
    addLog('✅ Klant geïdentificeerd: ' + customerData.name);
}

// Send call data to SAP Service Cloud
function sendToSAPServiceCloud(callData) {
    addLog('🏢 Call acceptatie verzenden naar SAP Service Cloud');
    
    // SAP Service Cloud expects this specific payload format for ACCEPT
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND", 
        "Action": "ACCEPT",
        "ANI": callData.phoneNumber || "+31651616126",
        "ExternalReferenceID": callData.callId || generateExternalReferenceId(),
        "Timestamp": new Date().toISOString()
    };
    
    // Send to SAP if available
    if (sapServiceCloud) {
        sapServiceCloud.sendMessage(sapPayload);
        addLog('✅ SAP ACCEPT payload verzonden: ' + JSON.stringify(sapPayload));
    }
    
    // Simulate SAP API call
    setTimeout(() => {
        document.getElementById('sapStatus').textContent = 'Verbonden';
        document.getElementById('lastSapAction').textContent = 'Call geaccepteerd';
        addLog('✅ Call succesvol naar SAP verzonden');
    }, 1000);
    
    // Send via Socket.io if available
    if (window.socket && window.socket.connected) {
        const socketMessage = {
            type: 'SAP_INTEGRATION',
            data: sapPayload
        };
        window.socket.emit('message', socketMessage);
        addLog('📡 SAP payload verzonden via Socket.io');
    }
}

// Generate external reference ID for SAP
function generateExternalReferenceId() {
    return 'ED' + Math.random().toString(36).substr(2, 15).toUpperCase() + 
           Date.now().toString(36).toUpperCase();
}

// Show decline popup
function showDeclinePopup(callData) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1001;
        text-align: center;
        min-width: 300px;
    `;
    
    popup.innerHTML = `
        <h3>❌ Call Afgewezen</h3>
        <p>Telefoonnummer: ${callData.phoneNumber}</p>
        <p>Tijd: ${new Date().toLocaleTimeString()}</p>
        <p><strong>Reden:</strong> Agent niet beschikbaar</p>
        <button onclick="this.parentElement.remove()" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
        ">Sluiten</button>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
}

// Handle messages from SAP Service Cloud
function handleSAPMessage(message) {
    console.log('Received SAP message:', message);
    addLog('📨 SAP bericht ontvangen: ' + message.type);

    switch (message.type) {
        case 'ACTIVITY_LOADED':
            currentActivity = message.activity;
            updateActivityDisplay(message.activity);
            break;
        case 'CALL_INCOMING':
            handleIncomingCall(message.callData);
            break;
        case 'CALL_OUTGOING':
            handleOutgoingCall(message.callData);
            break;
        case 'CHAT_MESSAGE':
            handleChatMessage(message.chatData);
            break;
    }
}

// Update activity display with SAP data
function updateActivityDisplay(activity) {
    if (activity) {
        addLog('📊 SAP activity geladen: ' + activity.objectId);
        // Update UI with SAP activity data
    }
}

// Handle outgoing call from SAP
function handleOutgoingCall(callData) {
    console.log('Outgoing call from SAP:', callData);
    addLog('📞 Outgoing call van SAP: ' + callData.phoneNumber);
    showToast('Outgoing call initiated from SAP Service Cloud');
}

// Handle chat message from SAP
function handleChatMessage(chatData) {
    console.log('Chat message from SAP:', chatData);
    addLog('💬 Chat bericht van SAP: ' + chatData.message);
    showToast('Chat message received from SAP Service Cloud');
}

// Test SAP connection
function testSapConnection() {
    const endpoint = document.getElementById('sapEndpoint').value;
    const apiKey = document.getElementById('sapApiKey').value;
    
    addLog('🔗 SAP verbinding testen...');
    
    // Simulate connection test
    setTimeout(() => {
        if (endpoint && apiKey) {
            document.getElementById('sapStatus').textContent = 'Verbonden';
            document.getElementById('lastSapAction').textContent = 'Verbinding getest';
            addLog('✅ SAP verbinding succesvol');
            showToast('SAP verbinding succesvol!');
        } else {
            document.getElementById('sapStatus').textContent = 'Fout';
            document.getElementById('lastSapAction').textContent = 'Verbinding mislukt';
            addLog('❌ SAP verbinding mislukt');
            showToast('SAP verbinding mislukt!');
        }
    }, 2000);
}

// Simulate incoming call for testing
function simulateIncomingCall() {
    const testCall = {
        phoneNumber: '+31651616126', // Aik's Dutch phone number
        callId: generateExternalReferenceId(),
        timestamp: new Date().toISOString()
    };
    
    handleIncomingCall(testCall);
}

// Export functions for global access
window.initializeCTI = initializeCTI;
window.handleIncomingCall = handleIncomingCall;
window.acceptCall = acceptCall;
window.declineCall = declineCall;
window.identifyCustomer = identifyCustomer;
window.sendToSAPServiceCloud = sendToSAPServiceCloud;
window.showDeclinePopup = showDeclinePopup;
window.handleSAPMessage = handleSAPMessage;
window.testSapConnection = testSapConnection;
window.simulateIncomingCall = simulateIncomingCall; 