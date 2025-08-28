/**
 * PostMessage Integration voor SAP Service Cloud
 * Agent Buddy → SAP Service Cloud communicatie via iframe
 */

// ============================================================================
// AGENT BUDDY SIDE (iframe) - PostMessage Sender
// ============================================================================

/**
 * Send SAP payload to parent window via PostMessage
 */
function sendSAPPayloadToParent(sapPayload) {
    if (window.parent && window.parent !== window) {
        try {
            // Add metadata to payload
            const enhancedPayload = {
                ...sapPayload,
                source: 'agent-buddy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            // Send to parent window
            window.parent.postMessage(enhancedPayload, "*");
            
            console.log('📤 PostMessage verzonden naar SAP:', enhancedPayload);
            addLog('📤 SAP payload verzonden via PostMessage: ' + enhancedPayload.Action);
            
            return true;
        } catch (error) {
            console.error('❌ PostMessage error:', error);
            addLog('❌ Fout bij PostMessage: ' + error.message);
            return false;
        }
    } else {
        console.warn('⚠️ Geen parent window gevonden voor PostMessage');
        return false;
    }
}

/**
 * Send call notification to SAP
 */
function sendCallNotification(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "NOTIFY",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString()
    };
    
    return sendSAPPayloadToParent(sapPayload);
}

/**
 * Send call accept to SAP
 */
function sendCallAccept(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "ACCEPT",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString()
    };
    
    return sendSAPPayloadToParent(sapPayload);
}

/**
 * Send call decline to SAP
 */
function sendCallDecline(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "DECLINE",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString()
    };
    
    return sendSAPPayloadToParent(sapPayload);
}

/**
 * Listen for messages from SAP parent window
 */
function setupPostMessageListener() {
    window.addEventListener('message', function(event) {
        console.log('📨 PostMessage ontvangen van SAP:', event.data);
        
        // Verify origin (optional security check)
        // if (event.origin !== "https://your-sap-instance.service.cloud.sap") return;
        
        if (event.data && event.data.source === 'sap-service-cloud') {
            handleSAPMessage(event.data);
        }
    });
}

/**
 * Handle messages from SAP
 */
function handleSAPMessage(sapMessage) {
    switch (sapMessage.type) {
        case 'CUSTOMER_LOADED':
            addLog('✅ Customer geladen in SAP: ' + sapMessage.customerId);
            break;
        case 'CALL_ENDED':
            addLog('📞 Call beëindigd in SAP');
            break;
        case 'ERROR':
            addLog('❌ SAP error: ' + sapMessage.message);
            break;
        default:
            addLog('📨 SAP bericht: ' + JSON.stringify(sapMessage));
    }
}

// ============================================================================
// SAP SERVICE CLOUD SIDE (parent) - PostMessage Receiver
// ============================================================================

/**
 * SAP Service Cloud PostMessage Handler
 * Deze code draait in de SAP Service Cloud parent window
 */
function setupSAPPostMessageHandler() {
    window.addEventListener('message', function(event) {
        console.log('📨 PostMessage ontvangen van Agent Buddy:', event.data);
        
        // Verify origin (security check)
        if (event.origin !== "https://glowing-frangollo-44ac94.netlify.app") {
            console.warn('⚠️ Onbekende origin:', event.origin);
            return;
        }
        
        // Handle call events
        if (event.data && event.data.Type === 'CALL') {
            handleCallEvent(event.data);
        }
    });
}

/**
 * Handle call events from Agent Buddy
 */
function handleCallEvent(callData) {
    console.log('📞 Call event ontvangen:', callData);
    
    switch (callData.Action) {
        case 'NOTIFY':
            handleIncomingCall(callData);
            break;
        case 'ACCEPT':
            handleCallAccepted(callData);
            break;
        case 'DECLINE':
            handleCallDeclined(callData);
            break;
        default:
            console.warn('⚠️ Onbekende call action:', callData.Action);
    }
}

/**
 * Handle incoming call notification
 */
function handleIncomingCall(callData) {
    console.log('📞 Incoming call van:', callData.ANI);
    
    // NO customer identification here - only notification
    // Customer identification will happen when call is accepted
    
    // Just log the incoming call
    console.log('📢 Incoming call notification ontvangen voor:', callData.ANI);
    
    // Optionally show incoming call notification
    showIncomingCallNotification(callData.ANI);
}

/**
 * Handle call accepted
 */
function handleCallAccepted(callData) {
    console.log('✅ Call geaccepteerd voor:', callData.ANI);
    
    // NOW identify customer via phone number (ONLY when call is accepted)
    identifyCustomerByPhone(callData.ANI).then(customer => {
        if (customer) {
            // Open customer window
            openCustomerWindow(customer);
            
            // Send confirmation back to Agent Buddy
            sendMessageToAgentBuddy({
                type: 'CUSTOMER_LOADED',
                customerId: customer.id,
                phoneNumber: callData.ANI
            });
            
            console.log('✅ Customer geïdentificeerd en geladen:', customer.id);
        } else {
            console.warn('⚠️ Customer niet gevonden voor:', callData.ANI);
            
            // Send notification that no customer was found
            sendMessageToAgentBuddy({
                type: 'CUSTOMER_NOT_FOUND',
                phoneNumber: callData.ANI
            });
        }
    });
    
    // Update customer screen status
    updateCustomerScreenStatus(callData.ANI, 'ACCEPTED');
    
    // Log call acceptance
    logCallAction(callData, 'ACCEPTED');
}

/**
 * Handle call declined
 */
function handleCallDeclined(callData) {
    console.log('❌ Call afgewezen voor:', callData.ANI);
    
    // Log call decline
    logCallAction(callData, 'DECLINED');
    
    // Optionally show decline notification
    showCallDeclineNotification(callData.ANI);
}

/**
 * Send message back to Agent Buddy iframe
 */
function sendMessageToAgentBuddy(message) {
    // Find Agent Buddy iframe
    const agentBuddyFrame = document.querySelector('iframe[src*="glowing-frangollo-44ac94.netlify.app"]');
    
    if (agentBuddyFrame && agentBuddyFrame.contentWindow) {
        try {
            const enhancedMessage = {
                ...message,
                source: 'sap-service-cloud',
                timestamp: new Date().toISOString()
            };
            
            agentBuddyFrame.contentWindow.postMessage(enhancedMessage, "*");
            console.log('📤 Bericht verzonden naar Agent Buddy:', enhancedMessage);
        } catch (error) {
            console.error('❌ Fout bij verzenden naar Agent Buddy:', error);
        }
    } else {
        console.warn('⚠️ Agent Buddy iframe niet gevonden');
    }
}

// ============================================================================
// HELPER FUNCTIES
// ============================================================================

/**
 * Identificeer customer via telefoonnummer
 */
async function identifyCustomerByPhone(phoneNumber) {
    console.log('🔍 DEBUG: identifyCustomerByPhone aangeroepen voor:', phoneNumber);
    console.trace('🔍 DEBUG: Call stack voor identifyCustomerByPhone');
    
    try {
        // SAP Service Cloud API call
        const response = await fetch(`/sap/opu/odata/sap/ZAGENTBUDDY_SRV/Customers?$filter=PhoneNumber eq '${phoneNumber}'`);
        const data = await response.json();
        
        if (data.d && data.d.results && data.d.results.length > 0) {
            return data.d.results[0];
        }
        
        return null;
    } catch (error) {
        console.error('❌ Fout bij customer identificatie:', error);
        return null;
    }
}

/**
 * Open customer window in SAP
 */
function openCustomerWindow(customer) {
    // SAP Fiori launchpad navigation
    const customerUrl = `/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-ushell-default-tile-action=action&sap-ushell-default-tile-group=GROUP_CUSTOMER&sap-ushell-default-tile-semantic-object=Customer&sap-ushell-default-tile-action-params={"CustomerID":"${customer.id}"}`;
    
    // Open in new window/tab
    window.open(customerUrl, '_blank');
    
    console.log('🪟 Customer window geopend voor:', customer.id);
}

/**
 * Update customer screen status
 */
function updateCustomerScreenStatus(phoneNumber, status) {
    // Update UI elements in SAP
    console.log('📱 Customer screen status updated:', phoneNumber, status);
}

/**
 * Log call action
 */
function logCallAction(callData, action) {
    // Log to SAP system
    console.log('📝 Call action logged:', action, callData);
}

/**
 * Show call decline notification
 */
function showCallDeclineNotification(phoneNumber) {
    // Show SAP notification
    console.log('🔔 Call decline notification voor:', phoneNumber);
}

/**
 * Show incoming call notification
 */
function showIncomingCallNotification(phoneNumber) {
    // Show SAP notification for incoming call (no customer lookup)
    console.log('📞 Incoming call notification voor:', phoneNumber);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize PostMessage handlers
document.addEventListener('DOMContentLoaded', function() {
    setupPostMessageListener();
    console.log('📡 PostMessage integration geïnitialiseerd');
});

// Export functions for global access
window.sendSAPPayloadToParent = sendSAPPayloadToParent;
window.sendCallNotification = sendCallNotification;
window.sendCallAccept = sendCallAccept;
window.sendCallDecline = sendCallDecline;
window.setupSAPPostMessageHandler = setupSAPPostMessageHandler; 