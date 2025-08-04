/*
 * Agent Buddy widget - SAP Aik Integration
 */

/**
 * SAP Aik CTI Integration Object
 */
// Check if jQuery.sap is available (SAP environment)
if (typeof jQuery !== 'undefined' && jQuery.sap) {
    jQuery.sap.declare("aik.cti.integration");
}

/**
 * Initialize the Aik CTI integration object
 */
var aik = aik || {};
aik.cti = aik.cti || {};
aik.cti.integration = function() {
    this.init();
};

aik.cti.integration._privateInstance = null;

/**
 * Return the singleton instance
 * @returns {null|aik.cti.integration}
 */
aik.cti.integration.getInstance = function() {
    if (!aik.cti.integration._privateInstance) {
        aik.cti.integration._privateInstance = new aik.cti.integration();
    }
    return aik.cti.integration._privateInstance;
};

/**
 * Send incoming call information to Aik
 * @param parameters - Call parameters
 */
aik.cti.integration.prototype.sendIncomingCalltoAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming call verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send incoming chat information to Aik
 * @param parameters - Chat parameters
 */
aik.cti.integration.prototype.sendIncomingChatToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming chat verzonden naar Aik: ' + parameters.originator);
};

/**
 * Send call accept to Aik
 * @param parameters - Call accept parameters
 */
aik.cti.integration.prototype.sendCallAcceptToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('✅ Call accept verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send call decline to Aik
 * @param parameters - Call decline parameters
 */
aik.cti.integration.prototype.sendCallDeclineToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('❌ Call decline verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send customer identification to Aik
 * @param parameters - Customer identification parameters
 */
aik.cti.integration.prototype.sendCustomerIdentificationToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('👤 Customer identification verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send call end to Aik
 * @param parameters - Call end parameters
 */
aik.cti.integration.prototype.sendCallEndToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📞 Call end verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send timer stop to Aik
 * @param parameters - Timer stop parameters
 */
aik.cti.integration.prototype.sendTimerStopToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('⏱️ Timer stop verzonden naar Aik: ' + parameters.TimerId);
};

/**
 * Post message to parent window (Aik)
 * @param sPayload - Payload to send
 * @private
 */
aik.cti.integration.prototype._doCall = function(sPayload) {
    if (window.parent !== window) {
        // Send to Aik parent window
        window.parent.postMessage(sPayload, "*");
        console.log('📤 Aik payload verzonden:', sPayload);
    } else {
        console.warn('⚠️ Geen Aik parent window gevonden');
        addLog('⚠️ Agent Buddy niet embedded in Aik');
    }
};

/**
 * Construct payload in JSON format
 * @param parameters - Parameters to include in payload
 * @returns {Object} JSON payload
 * @private
 */
aik.cti.integration.prototype._formJSONPayload = function(parameters) {
    var payload = {
        "payload": parameters,
        "source": "agent-buddy",
        "widgetId": "crm-agent-cti-plugin",
        "timestamp": new Date().toISOString(),
        "version": "1.0.0"
    };
    return payload;
};

/**
 * Construct payload in XML format (legacy)
 * @param parameters - Parameters to include in payload
 * @returns {string} XML payload
 * @private
 */
aik.cti.integration.prototype._formXMLPayload = function(parameters) {
    var sPayload = "<?xml version='1.0' encoding='utf-8' ?> <payload> ";
    
    for (var key in parameters) {
        var tag = "<" + key + ">" + parameters[key] + "</" + key + ">";
        sPayload = sPayload + tag;
    }
    sPayload = sPayload + "</payload>";
    
    return sPayload;
};

/**
 * Initialize the integration
 */
aik.cti.integration.prototype.init = function() {
    this._callbackFunction = null;
    this._addOnMessageEvent();
    addLog('🚀 Aik CTI integratie geïnitialiseerd');
};

/**
 * Validate incoming message
 * @param message - Message to validate
 * @param origin - Origin of message
 * @returns {boolean} - True if valid
 * @private
 */
aik.cti.integration.prototype._validateMessage = function(message, origin) {
    // Add origin validation if needed
    // if (origin !== "https://your-aik-instance.crm.ondemand.com") {
    //     addLog('❌ Onbekende origin: ' + origin);
    //     return false;
    // }
    return true;
};

/**
 * Handle incoming messages from Aik
 * @param event - Message event
 * @private
 */
aik.cti.integration.prototype._onMessage = function(event) {
    if (this._validateMessage(event.data, event.origin) === true) {
        console.log('📨 Bericht ontvangen van Aik:', event.data);
        addLog('📨 Aik bericht ontvangen: ' + JSON.stringify(event.data));
        
        if (this._callbackFunction) {
            this._callbackFunction(event);
        }
        
        // Handle specific Aik message types
        this._handleAikMessage(event.data);
    }
};

/**
 * Handle specific Aik message types
 * @param message - Aik message
 * @private
 */
aik.cti.integration.prototype._handleAikMessage = function(message) {
    if (message && message.payload) {
        var payload = message.payload;
        
        switch (payload.type) {
            case 'CALL_INCOMING':
                this._handleIncomingCallFromAik(payload);
                break;
                
            case 'CALL_ACCEPTED':
                this._handleCallAcceptedFromAik(payload);
                break;
                
            case 'CALL_DECLINED':
                this._handleCallDeclinedFromAik(payload);
                break;
                
            case 'CUSTOMER_LOADED':
                this._handleCustomerLoadedFromAik(payload);
                break;
                
            case 'AGENT_STATUS_UPDATE':
                this._handleAgentStatusUpdateFromAik(payload);
                break;
                
            case 'WIDGET_CONFIG':
                this._handleWidgetConfigFromAik(payload);
                break;
                
            default:
                console.log('📨 Onbekend Aik bericht type:', payload.type);
        }
    }
};

/**
 * Handle incoming call from Aik
 * @param payload - Call payload
 * @private
 */
aik.cti.integration.prototype._handleIncomingCallFromAik = function(payload) {
    console.log('📞 Incoming call van Aik:', payload);
    addLog('📞 Aik: Incoming call van ' + payload.ANI);
    
    // Trigger call handling in Agent Buddy
    if (window.handleIncomingCall) {
        window.handleIncomingCall({
            phoneNumber: payload.ANI,
            callId: payload.ExternalReferenceID,
            timestamp: payload.Timestamp
        });
    }
};

/**
 * Handle call accepted from Aik
 * @param payload - Call payload
 * @private
 */
aik.cti.integration.prototype._handleCallAcceptedFromAik = function(payload) {
    console.log('✅ Call accepted van Aik:', payload);
    addLog('✅ Aik: Call geaccepteerd voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Geaccepteerd door Aik';
    }
};

/**
 * Handle call declined from Aik
 * @param payload - Call payload
 * @private
 */
aik.cti.integration.prototype._handleCallDeclinedFromAik = function(payload) {
    console.log('❌ Call declined van Aik:', payload);
    addLog('❌ Aik: Call afgewezen voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Afgewezen door Aik';
    }
};

/**
 * Handle customer loaded from Aik
 * @param payload - Customer payload
 * @private
 */
aik.cti.integration.prototype._handleCustomerLoadedFromAik = function(payload) {
    console.log('👤 Customer loaded van Aik:', payload);
    addLog('👤 Aik: Klant geladen - ' + payload.customerName);
    
    // Update customer info in Agent Buddy
    const customerName = document.getElementById('customerName');
    const customerId = document.getElementById('customerId');
    const customerEmail = document.getElementById('customerEmail');
    const customerCompany = document.getElementById('customerCompany');
    
    if (customerName) customerName.textContent = payload.customerName || '-';
    if (customerId) customerId.textContent = payload.customerId || '-';
    if (customerEmail) customerEmail.textContent = payload.customerEmail || '-';
    if (customerCompany) customerCompany.textContent = payload.customerCompany || '-';
};

/**
 * Handle agent status update from Aik
 * @param payload - Status payload
 * @private
 */
aik.cti.integration.prototype._handleAgentStatusUpdateFromAik = function(payload) {
    console.log('👤 Agent status update van Aik:', payload);
    addLog('👤 Aik: Agent status - ' + payload.status);
    
    // Update agent status in Agent Buddy
    const agentId = document.getElementById('agentId');
    if (agentId) {
        agentId.textContent = payload.agentId || '-';
    }
};

/**
 * Handle widget configuration from Aik
 * @param payload - Config payload
 * @private
 */
aik.cti.integration.prototype._handleWidgetConfigFromAik = function(payload) {
    console.log('⚙️ Widget config van Aik:', payload);
    addLog('⚙️ Aik: Widget configuratie ontvangen');
    
    // Apply configuration to Agent Buddy
    if (payload.socketUrl) {
        const socketUrlInput = document.getElementById('socketUrl');
        if (socketUrlInput) {
            socketUrlInput.value = payload.socketUrl;
        }
    }
    
    if (payload.sapEndpoint) {
        const sapEndpointInput = document.getElementById('sapEndpoint');
        if (sapEndpointInput) {
            sapEndpointInput.value = payload.sapEndpoint;
        }
    }
};

/**
 * Add message event listener
 * @private
 */
aik.cti.integration.prototype._addOnMessageEvent = function() {
    if (window.addEventListener) {
        window.addEventListener("message", this._onMessage.bind(this), false);
    } else {
        window.attachEvent("onmessage", this._onMessage.bind(this));
    }
};

/**
 * Register callback function for outbound messages
 * @param callbackFunction - Callback function
 */
aik.cti.integration.prototype.registerOutboundCallback = function(callbackFunction) {
    this._callbackFunction = callbackFunction;
    addLog('🔌 Aik callback geregistreerd');
};

/**
 * Send call request to CTI adapter (legacy)
 * @param cadData - CAD data
 */
    aik.cti.integration.prototype.onSendCallRequestToCTIAdapter = function(cadData) {
    var query = "AIK=2109";
    for (var key in cadData) {
        query = query + "&" + key + "=" + cadData[key];
    }
    
    // Use fetch instead of jQuery
    if (typeof fetch !== 'undefined') {
        fetch("http://localhost:36729?" + query)
            .then(response => {
                addLog('📞 Aik CTI adapter call request verzonden');
            })
            .catch(error => {
                addLog('❌ CTI adapter error: ' + error.message);
            });
    } else {
        addLog('⚠️ Fetch niet beschikbaar voor CTI adapter');
    }
};

// ============================================================================
// AGENT BUDDY INTEGRATION HELPERS
// ============================================================================

/**
 * Send incoming call to Aik with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyIncomingCallToAik(callData) {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        
        var parameters = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "NOTIFY",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": new Date().toISOString(),
            "Priority": "HIGH",
            "CallType": "INBOUND"
        };
        
        aikIntegration.sendIncomingCalltoAik(parameters);
    } catch (error) {
        console.warn('⚠️ Aik integratie niet beschikbaar:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback');
        
        // Fallback: direct PostMessage
        if (window.parent && window.parent !== window) {
            var fallbackPayload = {
                "payload": parameters,
                "source": "agent-buddy",
                "widgetId": "crm-agent-cti-plugin",
                "timestamp": new Date().toISOString(),
                "version": "1.0.0"
            };
            window.parent.postMessage(fallbackPayload, "*");
            addLog('📤 Fallback PostMessage verzonden naar Aik');
        }
    }
}

/**
 * Send call accept to Aik with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyCallAcceptToAik(callData) {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        
        var parameters = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "ACCEPT",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": new Date().toISOString(),
            "AgentAction": "ACCEPTED",
            "CallDuration": 0
        };
        
        aikIntegration.sendCallAcceptToAik(parameters);
    } catch (error) {
        console.warn('⚠️ Aik integratie niet beschikbaar:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback');
        
        // Fallback: direct PostMessage
        if (window.parent && window.parent !== window) {
            var fallbackPayload = {
                "payload": parameters,
                "source": "agent-buddy",
                "widgetId": "crm-agent-cti-plugin",
                "timestamp": new Date().toISOString(),
                "version": "1.0.0"
            };
            window.parent.postMessage(fallbackPayload, "*");
            addLog('📤 Fallback PostMessage verzonden naar Aik');
        }
    }
}

/**
 * Send call decline to Aik with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyCallDeclineToAik(callData) {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        
        var parameters = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "DECLINE",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": new Date().toISOString(),
            "AgentAction": "DECLINED",
            "Reason": "Agent not available"
        };
        
        aikIntegration.sendCallDeclineToAik(parameters);
    } catch (error) {
        console.warn('⚠️ Aik integratie niet beschikbaar:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback');
        
        // Fallback: direct PostMessage
        if (window.parent && window.parent !== window) {
            var fallbackPayload = {
                "payload": parameters,
                "source": "agent-buddy",
                "widgetId": "crm-agent-cti-plugin",
                "timestamp": new Date().toISOString(),
                "version": "1.0.0"
            };
            window.parent.postMessage(fallbackPayload, "*");
            addLog('📤 Fallback PostMessage verzonden naar Aik');
        }
    }
}

/**
 * Send customer identification to Aik with Agent Buddy format
 * @param phoneNumber - Phone number
 * @param customerData - Customer data
 */
function sendAgentBuddyCustomerIdentificationToAik(phoneNumber, customerData) {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        
        var parameters = {
            "Type": "CUSTOMER",
            "EventType": "IDENTIFICATION",
            "Action": "LOAD",
            "ANI": phoneNumber,
            "CustomerData": customerData,
            "Timestamp": new Date().toISOString(),
            "Source": "agent-buddy"
        };
        
        aikIntegration.sendCustomerIdentificationToAik(parameters);
    } catch (error) {
        console.warn('⚠️ Aik integratie niet beschikbaar:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback');
        
        // Fallback: direct PostMessage
        if (window.parent && window.parent !== window) {
            var fallbackPayload = {
                "payload": parameters,
                "source": "agent-buddy",
                "widgetId": "crm-agent-cti-plugin",
                "timestamp": new Date().toISOString(),
                "version": "1.0.0"
            };
            window.parent.postMessage(fallbackPayload, "*");
            addLog('📤 Fallback PostMessage verzonden naar Aik');
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize Aik integration for Agent Buddy
 */
function initializeAgentBuddyAikIntegration() {
    console.log('🚀 Agent Buddy Aik integratie initialiseren...');
    
    try {
        // Initialize Aik integration
        var aikIntegration = aik.cti.integration.getInstance();
        
        // Register callback for Aik messages
        aikIntegration.registerOutboundCallback(function(event) {
            console.log('📨 Aik callback triggered:', event);
        });
        
        addLog('🚀 Agent Buddy Aik integratie geïnitialiseerd');
    } catch (error) {
        console.warn('⚠️ Aik integratie initialisatie gefaald:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback mode');
        
        // Setup basic PostMessage listener as fallback
        window.addEventListener('message', function(event) {
            console.log('📨 Fallback message received:', event.data);
        });
    }
}

/**
 * Send call end to Aik with Agent Buddy format
 * @param callData - Call data object
 */
function sendAgentBuddyCallEndToAik(callData) {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        var endTime = new Date();
        
        var parameters = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "END",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": endTime.toISOString(),
            "CallDuration": Math.floor((Date.now() - (callData.startTime || Date.now())) / 1000),
            "interactionEndedOn": endTime.toISOString(),
            "Source": "agent-buddy"
        };
        
        aikIntegration.sendCallEndToAik(parameters);
        addLog('📞 Call end verzonden naar Aik: ' + callData.phoneNumber);
        
        // Also send timer stop command
        sendTimerStopToAik();
        
    } catch (error) {
        console.warn('⚠️ Aik integratie niet beschikbaar:', error.message);
        addLog('⚠️ Aik integratie niet beschikbaar - gebruik fallback');
        
        // Fallback: direct PostMessage
        if (window.parent && window.parent !== window) {
            var endTime = new Date();
            var fallbackPayload = {
                "Type": "CALL",
                "EventType": "INBOUND",
                "Action": "END",
                "ANI": callData.phoneNumber,
                "ExternalReferenceID": callData.callId,
                "Timestamp": endTime.toISOString(),
                "CallDuration": Math.floor((Date.now() - (callData.startTime || Date.now())) / 1000),
                "interactionEndedOn": endTime.toISOString(),
                "source": "agent-buddy",
                "widgetId": "crm-agent-cti-plugin"
            };
            window.parent.postMessage(fallbackPayload, "*");
            addLog('📞 Call end verzonden via fallback: ' + callData.phoneNumber);
            
            // Also send timer stop via fallback
            sendTimerStopToAikFallback();
        }
    }
}

/**
 * Send timer stop command to Aik
 */
function sendTimerStopToAik() {
    try {
        var aikIntegration = aik.cti.integration.getInstance();
        var timerStopTime = new Date();
        
        var parameters = {
            "Type": "TIMER",
            "EventType": "CONTROL",
            "Action": "STOP",
            "TimerId": "crm-cti-caller-status",
            "Timestamp": timerStopTime.toISOString(),
            "Source": "agent-buddy"
        };
        
        aikIntegration.sendTimerStopToAik(parameters);
        addLog('⏱️ Timer stop verzonden naar Aik');
    } catch (error) {
        console.warn('⚠️ Aik timer stop niet beschikbaar:', error.message);
        sendTimerStopToAikFallback();
    }
}

/**
 * Send timer stop command to Aik via fallback
 */
function sendTimerStopToAikFallback() {
    if (window.parent && window.parent !== window) {
        var timerStopTime = new Date();
        var fallbackPayload = {
            "Type": "TIMER",
            "EventType": "CONTROL",
            "Action": "STOP",
            "TimerId": "crm-cti-caller-status",
            "Timestamp": timerStopTime.toISOString(),
            "source": "agent-buddy",
            "widgetId": "crm-agent-cti-plugin"
        };
        window.parent.postMessage(fallbackPayload, "*");
        addLog('⏱️ Timer stop verzonden via fallback');
    }
}

// Export functions for global access
window.sendAgentBuddyIncomingCallToAik = sendAgentBuddyIncomingCallToAik;
window.sendAgentBuddyCallAcceptToAik = sendAgentBuddyCallAcceptToAik;
window.sendAgentBuddyCallDeclineToAik = sendAgentBuddyCallDeclineToAik;
window.sendAgentBuddyCallEndToAik = sendAgentBuddyCallEndToAik;
window.sendAgentBuddyCustomerIdentificationToAik = sendAgentBuddyCustomerIdentificationToAik;
window.initializeAgentBuddyAikIntegration = initializeAgentBuddyAikIntegration;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAgentBuddyAikIntegration);
} else {
    initializeAgentBuddyAikIntegration();
} 