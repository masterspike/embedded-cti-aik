/*
 * Agent Buddy widget - SSCV2
 */

/**
 * Aik - CTI integration component between Side pane and SSCV2 (SAP Service Cloud)
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
 * Send incoming call information to SSCV2
 * @param parameters - Call parameters
 */
aik.cti.integration.prototype.sendIncomingCalltoAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming call verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send incoming chat information to SSCV2
 * @param parameters - Chat parameters
 */
aik.cti.integration.prototype.sendIncomingChatToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming chat verzonden naar Aik: ' + parameters.originator);
};

/**
 * Send call accept to SSCV2
 * @param parameters - Call accept parameters
 */
aik.cti.integration.prototype.sendCallAcceptToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('✅ Call accept verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send call decline to SSCV2
 * @param parameters - Call decline parameters
 */
aik.cti.integration.prototype.sendCallDeclineToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('❌ Call decline verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Send customer identification to SSCV2
 * @param parameters - Customer identification parameters
 */
aik.cti.integration.prototype.sendCustomerIdentificationToAik = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('👤 Customer identification verzonden naar Aik: ' + parameters.ANI);
};

/**
 * Post message to parent window (SSCV2)
 * @param sPayload - Payload to send
 * @private
 */
aik.cti.integration.prototype._doCall = function(sPayload) {
    if (window.parent !== window) {
        // Send to Aik parent window
        window.parent.postMessage(sPayload, "*");
        console.log('📤 SSCV2 payload verzonden:', sPayload);
    } else {
        console.warn('⚠️ Geen SSCV2 parent window gevonden');
        addLog('⚠️ Agent Buddy niet embedded in Service Cloud');
    }
};

/**
 * Construct payload in JSON format
 * @param parameters - Parameters to include in payload
 * @returns {Object} JSON payload
 * @private
 */
c4c.cti.integration.prototype._formJSONPayload = function(parameters) {
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
c4c.cti.integration.prototype._formXMLPayload = function(parameters) {
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
c4c.cti.integration.prototype.init = function() {
    this._callbackFunction = null;
    this._addOnMessageEvent();
    addLog('🚀 C4C CTI integratie geïnitialiseerd');
};

/**
 * Validate incoming message
 * @param message - Message to validate
 * @param origin - Origin of message
 * @returns {boolean} - True if valid
 * @private
 */
c4c.cti.integration.prototype._validateMessage = function(message, origin) {
    // Add origin validation if needed
    // if (origin !== "https://your-c4c-instance.crm.ondemand.com") {
    //     addLog('❌ Onbekende origin: ' + origin);
    //     return false;
    // }
    return true;
};

/**
 * Handle incoming messages from SSCV2
 * @param event - Message event
 * @private
 */
c4c.cti.integration.prototype._onMessage = function(event) {
    if (this._validateMessage(event.data, event.origin) === true) {
        console.log('📨 Bericht ontvangen van SSCV2:', event.data);
        addLog('📨 SSCV2 bericht ontvangen: ' + JSON.stringify(event.data));
        
        if (this._callbackFunction) {
            this._callbackFunction(event);
        }
        
        // Handle specific C4C message types
        this._handleC4CMessage(event.data);
    }
};

/**
 * Handle specific SSCV2 message types
 * @param message - SSCV2 message
 * @private
 */
c4c.cti.integration.prototype._handleC4CMessage = function(message) {
    if (message && message.payload) {
        var payload = message.payload;
        
        switch (payload.type) {
            case 'CALL_INCOMING':
                this._handleIncomingCallFromC4C(payload);
                break;
                
            case 'CALL_ACCEPTED':
                this._handleCallAcceptedFromC4C(payload);
                break;
                
            case 'CALL_DECLINED':
                this._handleCallDeclinedFromC4C(payload);
                break;
                
            case 'CUSTOMER_LOADED':
                this._handleCustomerLoadedFromC4C(payload);
                break;
                
            case 'AGENT_STATUS_UPDATE':
                this._handleAgentStatusUpdateFromC4C(payload);
                break;
                
            case 'WIDGET_CONFIG':
                this._handleWidgetConfigFromC4C(payload);
                break;
                
            default:
                console.log('📨 Onbekend C4C bericht type:', payload.type);
        }
    }
};

/**
 * Handle incoming call from SSCV2
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleIncomingCallFromC4C = function(payload) {
    console.log('📞 Incoming call van SSCV2:', payload);
    addLog('📞 SSCV2: Incoming call van ' + payload.ANI);
    
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
 * Handle call accepted from SSCV2
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleCallAcceptedFromC4C = function(payload) {
    console.log('✅ Call accepted van SSCV2:', payload);
    addLog('✅ SSCV2: Call geaccepteerd voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Geaccepteerd door C4C';
    }
};

/**
 * Handle call declined from SSCV2
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleCallDeclinedFromC4C = function(payload) {
    console.log('❌ Call declined van SSCV2:', payload);
    addLog('❌ SSCV2: Call afgewezen voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Afgewezen door C4C';
    }
};

/**
 * Handle customer loaded from SSCV2
 * @param payload - Customer payload
 * @private
 */
c4c.cti.integration.prototype._handleCustomerLoadedFromC4C = function(payload) {
    console.log('👤 Customer loaded van SSCV2:', payload);
    addLog('👤 SSCV2: Klant geladen - ' + payload.customerName);
    
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
 * Handle agent status update from SSCV2
 * @param payload - Status payload
 * @private
 */
c4c.cti.integration.prototype._handleAgentStatusUpdateFromC4C = function(payload) {
    console.log('👤 Agent status update van SSCV2:', payload);
    addLog('👤 SSCV2: Agent status - ' + payload.status);
    
    // Update agent status in Agent Buddy
    const agentId = document.getElementById('agentId');
    if (agentId) {
        agentId.textContent = payload.agentId || '-';
    }
};

/**
 * Handle widget configuration from SSCV2
 * @param payload - Config payload
 * @private
 */
c4c.cti.integration.prototype._handleWidgetConfigFromC4C = function(payload) {
    console.log('⚙️ Widget config van SSCV2:', payload);
    addLog('⚙️ SSCV2: Widget configuratie ontvangen');
    
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
c4c.cti.integration.prototype._addOnMessageEvent = function() {
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
c4c.cti.integration.prototype.registerOutboundCallback = function(callbackFunction) {
    this._callbackFunction = callbackFunction;
    addLog('🔌 SSCV2 callback geregistreerd');
};

/**
 * Send call request to CTI adapter
 * @param cadData - CAD data
 */
c4c.cti.integration.prototype.onSendCallRequestToCTIAdapter = function(cadData) {
    var query = "AIK=2109";
    for (var key in cadData) {
        query = query + "&" + key + "=" + cadData[key];
    }
    
    // Use fetch instead of jQuery
    if (typeof fetch !== 'undefined') {
        fetch("http://localhost:36729?" + query)
            .then(response => {
                addLog('📞 CTI adapter call request verzonden');
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
 * Send incoming call to SSCV2 with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyIncomingCallToC4C(callData) {
    try {
        var c4cIntegration = c4c.cti.integration.getInstance();
        
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
        
        c4cIntegration.sendIncomingCalltoC4C(parameters);
    } catch (error) {
        console.warn('⚠️ C4C integratie niet beschikbaar:', error.message);
        addLog('⚠️ C4C integratie niet beschikbaar - gebruik fallback');
        
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
            addLog('📤 Fallback PostMessage verzonden naar C4C');
        }
    }
}

/**
 * Send call accept to SSCV2 with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyCallAcceptToC4C(callData) {
    try {
        var c4cIntegration = c4c.cti.integration.getInstance();
        
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
        
        c4cIntegration.sendCallAcceptToC4C(parameters);
    } catch (error) {
        console.warn('⚠️ SSCV2 integratie niet beschikbaar:', error.message);
        addLog('⚠️ SSCV2 integratie niet beschikbaar - gebruik fallback');
        
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
            addLog('📤 Fallback PostMessage verzonden naar SSCV2');
        }
    }
}

/**
 * Send call decline to SSCV2 with Agent Buddy format
 * @param callData - Call data from Agent Buddy
 */
function sendAgentBuddyCallDeclineToC4C(callData) {
    try {
        var c4cIntegration = c4c.cti.integration.getInstance();
        
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
        
        c4cIntegration.sendCallDeclineToC4C(parameters);
    } catch (error) {
        console.warn('⚠️ SSCV2 integratie niet beschikbaar:', error.message);
        addLog('⚠️ SSCV2 integratie niet beschikbaar - gebruik fallback');
        
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
            addLog('📤 Fallback PostMessage verzonden naar SSCV2');
        }
    }
}

/**
 * Send customer identification to SSCV2 with Agent Buddy format
 * @param phoneNumber - Phone number
 * @param customerData - Customer data
 */
function sendAgentBuddyCustomerIdentificationToC4C(phoneNumber, customerData) {
    try {
        var c4cIntegration = c4c.cti.integration.getInstance();
        
        var parameters = {
            "Type": "CUSTOMER",
            "EventType": "IDENTIFICATION",
            "Action": "LOAD",
            "ANI": phoneNumber,
            "CustomerData": customerData,
            "Timestamp": new Date().toISOString(),
            "Source": "agent-buddy"
        };
        
        c4cIntegration.sendCustomerIdentificationToC4C(parameters);
    } catch (error) {
        console.warn('⚠️ SSCV2 integratie niet beschikbaar:', error.message);
        addLog('⚠️ SSCV2 integratie niet beschikbaar - gebruik fallback');
        
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
            addLog('📤 Fallback PostMessage verzonden naar SSCV2');
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize SSCV2 integration for Agent Buddy
 */
function initializeAgentBuddySSCV2Integration() {
    console.log('🚀 Agent Buddy SSCV2 integratie initialiseren...');
    
    try {
        // Initialize C4C integration
        var c4cIntegration = c4c.cti.integration.getInstance();
        
        // Register callback for C4C messages
        c4cIntegration.registerOutboundCallback(function(event) {
            console.log('📨 C4C callback triggered:', event);
        });
        
        addLog('🚀 Agent Buddy SSCV2 integratie geïnitialiseerd');
    } catch (error) {
        console.warn('⚠️ SSCV2 integratie initialisatie gefaald:', error.message);
        addLog('⚠️ SSCV2 integratie niet beschikbaar - gebruik fallback mode');
        
        // Setup basic PostMessage listener as fallback
        window.addEventListener('message', function(event) {
            console.log('📨 Fallback message received:', event.data);
        });
    }
}

// Export functions for global access
window.sendAgentBuddyIncomingCallToC4C = sendAgentBuddyIncomingCallToC4C;
window.sendAgentBuddyCallAcceptToC4C = sendAgentBuddyCallAcceptToC4C;
window.sendAgentBuddyCallDeclineToC4C = sendAgentBuddyCallDeclineToC4C;
window.sendAgentBuddyCustomerIdentificationToC4C = sendAgentBuddyCustomerIdentificationToC4C;
window.initializeAgentBuddySSCV2Integration = initializeAgentBuddySSCV2Integration;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAgentBuddySSCV2Integration);
} else {
    initializeAgentBuddySSCV2Integration();
} 