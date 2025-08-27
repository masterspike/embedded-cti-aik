/**
 * SAP Service Cloud Integration
 * Agent Buddy → SAP Service Cloud communicatie voor embedded widget
 */

// ============================================================================
// AGENT BUDDY → SAP SERVICE CLOUD COMMUNICATION
// ============================================================================

/**
 * Send enhanced payload to SAP Service Cloud parent window
 */
function sendToSAPServiceCloud(sapPayload) {
    if (window.parent && window.parent !== window) {
        try {
            // Enhanced payload with metadata for SAP Service Cloud
            const enhancedPayload = {
                ...sapPayload,
                source: 'agent-buddy',
                widgetId: 'crm-agent-cti-plugin',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                agentId: getAgentId(),
                sessionId: getSessionId()
            };
            
            // Send to SAP Service Cloud parent window
            window.parent.postMessage(enhancedPayload, "*");
            
            console.log('📤 SAP Service Cloud payload verzonden:', enhancedPayload);
            addLog('📤 SAP Service Cloud: ' + enhancedPayload.Action + ' voor ' + enhancedPayload.ANI);
            
            return true;
        } catch (error) {
            console.error('❌ SAP Service Cloud PostMessage error:', error);
            addLog('❌ Fout bij SAP Service Cloud communicatie: ' + error.message);
            return false;
        }
    } else {
        console.warn('⚠️ Geen SAP Service Cloud parent window gevonden');
        addLog('⚠️ Agent Buddy niet embedded in SAP Service Cloud');
        return false;
    }
}

/**
 * Send call notification to SAP Service Cloud
 */
function sendCallNotificationToSAP(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "NOTIFY",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString(),
        "Priority": "HIGH",
        "CallType": "INBOUND"
    };
    
    return sendToSAPServiceCloud(sapPayload);
}

/**
 * Send call accept to SAP Service Cloud
 */
function sendCallAcceptToSAP(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "ACCEPT",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString(),
        "AgentAction": "ACCEPTED",
        "CallDuration": 0
    };
    
    return sendToSAPServiceCloud(sapPayload);
}

/**
 * Send call decline to SAP Service Cloud
 */
function sendCallDeclineToSAP(phoneNumber, callId) {
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "DECLINE",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": new Date().toISOString(),
        "AgentAction": "DECLINED",
        "Reason": "Agent not available"
    };
    
    return sendToSAPServiceCloud(sapPayload);
}

/**
 * Send call end to SAP Service Cloud
 */
function sendCallEndToSAP(phoneNumber, callId) {
    const endTime = new Date();
    const sapPayload = {
        "Type": "CALL",
        "EventType": "INBOUND",
        "Action": "END",
        "ANI": phoneNumber,
        "ExternalReferenceID": callId,
        "Timestamp": endTime.toISOString(),
        "interactionEndedOn": endTime.toISOString(),
        "AgentAction": "ENDED",
        "Reason": "Call terminated by agent"
    };
    
    // Send call end payload
    const result = sendToSAPServiceCloud(sapPayload);
    
    // Also send timer stop command
    sendTimerStopToSAP();
    
    return result;
}

/**
 * Send timer stop command to SAP Service Cloud
 */
function sendTimerStopToSAP() {
    const timerStopPayload = {
        "Type": "TIMER",
        "EventType": "CONTROL",
        "Action": "STOP",
        "TimerId": "crm-cti-caller-status",
        "Timestamp": new Date().toISOString(),
        "source": "agent-buddy",
        "widgetId": "crm-agent-cti-plugin",
        "agentId": getAgentId(),
        "sessionId": getSessionId()
    };
    
    const result = sendToSAPServiceCloud(timerStopPayload);
    
    // Send additional timer stop commands with delays
    setTimeout(() => {
        const delayedTimerStop = {
            "Type": "TIMER",
            "EventType": "CONTROL",
            "Action": "STOP",
            "TimerId": "crm-cti-caller-status",
            "Timestamp": new Date().toISOString(),
            "source": "agent-buddy",
            "widgetId": "crm-agent-cti-plugin",
            "agentId": getAgentId(),
            "sessionId": getSessionId(),
            "retry": true
        };
        sendToSAPServiceCloud(delayedTimerStop);
    }, 1000);
    
    setTimeout(() => {
        const timerReset = {
            "Type": "TIMER",
            "EventType": "CONTROL",
            "Action": "RESET",
            "TimerId": "crm-cti-caller-status",
            "Timestamp": new Date().toISOString(),
            "source": "agent-buddy",
            "widgetId": "crm-agent-cti-plugin",
            "agentId": getAgentId(),
            "sessionId": getSessionId()
        };
        sendToSAPServiceCloud(timerReset);
    }, 2000);
    
    return result;
}

/**
 * Send customer identification to SAP Service Cloud (ONLY when call is accepted)
 */
function sendCustomerIdentificationToSAP(phoneNumber, customerData) {
    const sapPayload = {
        "Type": "CUSTOMER",
        "EventType": "IDENTIFICATION",
        "Action": "LOAD",
        "ANI": phoneNumber,
        "CustomerData": customerData,
        "Timestamp": new Date().toISOString(),
        "Source": "agent-buddy"
    };
    
    return sendToSAPServiceCloud(sapPayload);
}

// ============================================================================
// SAP SERVICE CLOUD → AGENT BUDDY COMMUNICATION
// ============================================================================

/**
 * Setup listener for messages from SAP Service Cloud
 */
function setupSAPServiceCloudListener() {
    window.addEventListener('message', function(event) {
        console.log('📨 Bericht ontvangen van SAP Service Cloud:', event.data);
        
        // Verify it's from SAP Service Cloud
        if (event.data && event.data.source === 'sap-service-cloud') {
            handleSAPServiceCloudMessage(event.data);
        }
    });
    
    addLog('🔌 SAP Service Cloud listener geïnitialiseerd');
}

/**
 * Handle messages from SAP Service Cloud
 */
function handleSAPServiceCloudMessage(message) {
    console.log('📨 SAP Service Cloud bericht verwerken:', message);
    
    switch (message.type) {
        case 'CALL_INCOMING':
            handleIncomingCallFromSAP(message.callData);
            break;
            
        case 'CALL_ACCEPTED':
            handleCallAcceptedFromSAP(message.callData);
            break;
            
        case 'CALL_DECLINED':
            handleCallDeclinedFromSAP(message.callData);
            break;
            
        case 'CUSTOMER_LOADED':
            handleCustomerLoadedFromSAP(message.customerData);
            break;
            
        case 'AGENT_STATUS_UPDATE':
            handleAgentStatusUpdateFromSAP(message.status);
            break;
            
        case 'WIDGET_CONFIG':
            handleWidgetConfigFromSAP(message.config);
            break;
            
        default:
            console.log('📨 Onbekend SAP Service Cloud bericht type:', message.type);
    }
}

/**
 * Handle incoming call from SAP Service Cloud
 */
function handleIncomingCallFromSAP(callData) {
    console.log('📞 Incoming call van SAP Service Cloud:', callData);
    addLog('📞 SAP Service Cloud: Incoming call van ' + callData.phoneNumber);
    
    // Trigger call handling in Agent Buddy
    if (window.handleIncomingCall) {
        window.handleIncomingCall(callData);
    }
}

/**
 * Handle call accepted from SAP Service Cloud
 */
function handleCallAcceptedFromSAP(callData) {
    console.log('✅ Call accepted van SAP Service Cloud:', callData);
    addLog('✅ SAP Service Cloud: Call geaccepteerd voor ' + callData.phoneNumber);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Geaccepteerd door SAP';
    }
}

/**
 * Handle call declined from SAP Service Cloud
 */
function handleCallDeclinedFromSAP(callData) {
    console.log('❌ Call declined van SAP Service Cloud:', callData);
    addLog('❌ SAP Service Cloud: Call afgewezen voor ' + callData.phoneNumber);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Afgewezen door SAP';
    }
}

/**
 * Handle customer loaded from SAP Service Cloud
 */
function handleCustomerLoadedFromSAP(customerData) {
    console.log('👤 Customer loaded van SAP Service Cloud:', customerData);
    addLog('👤 SAP Service Cloud: Klant geladen - ' + customerData.name);
    
    // Update customer info in Agent Buddy
    const customerName = document.getElementById('customerName');
    const customerId = document.getElementById('customerId');
    const customerEmail = document.getElementById('customerEmail');
    const customerCompany = document.getElementById('customerCompany');
    
    if (customerName) customerName.textContent = customerData.name || '-';
    if (customerId) customerId.textContent = customerData.id || '-';
    if (customerEmail) customerEmail.textContent = customerData.email || '-';
    if (customerCompany) customerCompany.textContent = customerData.company || '-';
}

/**
 * Handle agent status update from SAP Service Cloud
 */
function handleAgentStatusUpdateFromSAP(status) {
    console.log('👤 Agent status update van SAP Service Cloud:', status);
    addLog('👤 SAP Service Cloud: Agent status - ' + status);
    
    // Update agent status in Agent Buddy
    const agentId = document.getElementById('agentId');
    if (agentId) {
        agentId.textContent = status.agentId || '-';
    }
}

/**
 * Handle widget configuration from SAP Service Cloud
 */
function handleWidgetConfigFromSAP(config) {
    console.log('⚙️ Widget config van SAP Service Cloud:', config);
    addLog('⚙️ SAP Service Cloud: Widget configuratie ontvangen');
    
    // Apply configuration to Agent Buddy
    if (config.socketUrl) {
        const socketUrlInput = document.getElementById('socketUrl');
        if (socketUrlInput) {
            socketUrlInput.value = config.socketUrl;
        }
    }
    
    if (config.sapEndpoint) {
        const sapEndpointInput = document.getElementById('sapEndpoint');
        if (sapEndpointInput) {
            sapEndpointInput.value = config.sapEndpoint;
        }
    }
}


/**
 * Get active agent ID from SSCV2
 */
function getAgentId() {
    // Try to get from SAP Service Cloud context
    if (window.parent && window.parent !== window) {
        try {
            // This would be set by SAP Service Cloud
            return window.agentId || 'AGENT-' + Math.random().toString(36).substr(2, 9);
        } catch (error) {
            return 'AGENT-' + Math.random().toString(36).substr(2, 9);
        }
    }
    return 'AGENT-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get session ID from SSCV2 or generate one
 */
function getSessionId() {
    // Try to get from SAP Service Cloud context
    if (window.parent && window.parent !== window) {
        try {
            // This would be set by SAP Service Cloud
            return window.sessionId || 'SESSION-' + Date.now();
        } catch (error) {
            return 'SESSION-' + Date.now();
        }
    }
    return 'SESSION-' + Date.now();
}

/**
 * Notify SAP Service Cloud that Agent Buddy is ready
 */
function notifySAPServiceCloudReady() {
    const readyPayload = {
        "Type": "WIDGET",
        "EventType": "STATUS",
        "Action": "READY",
        "WidgetId": "crm-agent-cti-plugin",
        "Timestamp": new Date().toISOString(),
        "source": "agent-buddy",
        "version": "1.0.0"
    };
    
    sendToSAPServiceCloud(readyPayload);
    addLog('✅ Agent Buddy ready notification verzonden naar SAP Service Cloud');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize SAP Service Cloud integration
 */
function initializeSAPServiceCloudIntegration() {
    console.log('🚀 SAP Service Cloud integratie initialiseren...');
    
    // Setup listener for SAP Service Cloud messages
    setupSAPServiceCloudListener();
    
    // Notify SAP Service Cloud that Agent Buddy is ready
    setTimeout(() => {
        notifySAPServiceCloudReady();
    }, 1000);
    
    addLog('🚀 SAP Service Cloud integratie geïnitialiseerd');
}

// Export functions for global access
window.sendToSAPServiceCloud = sendToSAPServiceCloud;
window.sendCallNotificationToSAP = sendCallNotificationToSAP;
window.sendCallAcceptToSAP = sendCallAcceptToSAP;
window.sendCallDeclineToSAP = sendCallDeclineToSAP;
window.sendCallEndToSAP = sendCallEndToSAP;
window.sendCustomerIdentificationToSAP = sendCustomerIdentificationToSAP;
window.initializeSAPServiceCloudIntegration = initializeSAPServiceCloudIntegration;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSAPServiceCloudIntegration);
} else {
    initializeSAPServiceCloudIntegration();
} 