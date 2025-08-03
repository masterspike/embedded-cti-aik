/**
 * SAP C4C (Cloud for Customer) Integration
 * Based on official SAP C4C CTI integration example
 * Adapted for Agent Buddy widget
 */

/**
 * SAP C4C CTI Integration Object
 */
// Check if jQuery.sap is available (SAP environment)
if (typeof jQuery !== 'undefined' && jQuery.sap) {
    jQuery.sap.declare("c4c.cti.integration");
}

/**
 * Initialize the C4C CTI integration object
 */
var c4c = c4c || {};
c4c.cti = c4c.cti || {};
c4c.cti.integration = function() {
    this.init();
};

c4c.cti.integration._privateInstance = null;

/**
 * Return the singleton instance
 * @returns {null|c4c.cti.integration}
 */
c4c.cti.integration.getInstance = function() {
    if (!c4c.cti.integration._privateInstance) {
        c4c.cti.integration._privateInstance = new c4c.cti.integration();
    }
    return c4c.cti.integration._privateInstance;
};

/**
 * Send incoming call information to C4C
 * @param parameters - Call parameters
 */
c4c.cti.integration.prototype.sendIncomingCalltoC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming call verzonden naar C4C: ' + parameters.ANI);
};

/**
 * Send incoming chat information to C4C
 * @param parameters - Chat parameters
 */
c4c.cti.integration.prototype.sendIncomingChatToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('📤 Incoming chat verzonden naar C4C: ' + parameters.originator);
};

/**
 * Send call accept to C4C
 * @param parameters - Call accept parameters
 */
c4c.cti.integration.prototype.sendCallAcceptToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('✅ Call accept verzonden naar C4C: ' + parameters.ANI);
};

/**
 * Send call decline to C4C
 * @param parameters - Call decline parameters
 */
c4c.cti.integration.prototype.sendCallDeclineToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('❌ Call decline verzonden naar C4C: ' + parameters.ANI);
};

/**
 * Send customer identification to C4C
 * @param parameters - Customer identification parameters
 */
c4c.cti.integration.prototype.sendCustomerIdentificationToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
    addLog('👤 Customer identification verzonden naar C4C: ' + parameters.ANI);
};

/**
 * Post message to parent window (C4C)
 * @param sPayload - Payload to send
 * @private
 */
c4c.cti.integration.prototype._doCall = function(sPayload) {
    if (window.parent !== window) {
        // Send to C4C parent window
        window.parent.postMessage(sPayload, "*");
        console.log('📤 C4C payload verzonden:', sPayload);
    } else {
        console.warn('⚠️ Geen C4C parent window gevonden');
        addLog('⚠️ Agent Buddy niet embedded in C4C');
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
 * Handle incoming messages from C4C
 * @param event - Message event
 * @private
 */
c4c.cti.integration.prototype._onMessage = function(event) {
    if (this._validateMessage(event.data, event.origin) === true) {
        console.log('📨 Bericht ontvangen van C4C:', event.data);
        addLog('📨 C4C bericht ontvangen: ' + JSON.stringify(event.data));
        
        if (this._callbackFunction) {
            this._callbackFunction(event);
        }
        
        // Handle specific C4C message types
        this._handleC4CMessage(event.data);
    }
};

/**
 * Handle specific C4C message types
 * @param message - C4C message
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
 * Handle incoming call from C4C
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleIncomingCallFromC4C = function(payload) {
    console.log('📞 Incoming call van C4C:', payload);
    addLog('📞 C4C: Incoming call van ' + payload.ANI);
    
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
 * Handle call accepted from C4C
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleCallAcceptedFromC4C = function(payload) {
    console.log('✅ Call accepted van C4C:', payload);
    addLog('✅ C4C: Call geaccepteerd voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Geaccepteerd door C4C';
    }
};

/**
 * Handle call declined from C4C
 * @param payload - Call payload
 * @private
 */
c4c.cti.integration.prototype._handleCallDeclinedFromC4C = function(payload) {
    console.log('❌ Call declined van C4C:', payload);
    addLog('❌ C4C: Call afgewezen voor ' + payload.ANI);
    
    // Update Agent Buddy UI
    const callStatus = document.getElementById('callStatus');
    if (callStatus) {
        callStatus.textContent = 'Afgewezen door C4C';
    }
};

/**
 * Handle customer loaded from C4C
 * @param payload - Customer payload
 * @private
 */
c4c.cti.integration.prototype._handleCustomerLoadedFromC4C = function(payload) {
    console.log('👤 Customer loaded van C4C:', payload);
    addLog('👤 C4C: Klant geladen - ' + payload.customerName);
    
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
 * Handle agent status update from C4C
 * @param payload - Status payload
 * @private
 */
c4c.cti.integration.prototype._handleAgentStatusUpdateFromC4C = function(payload) {
    console.log('👤 Agent status update van C4C:', payload);
    addLog('👤 C4C: Agent status - ' + payload.status);
    
    // Update agent status in Agent Buddy
    const agentId = document.getElementById('agentId');
    if (agentId) {
        agentId.textContent = payload.agentId || '-';
    }
};

/**
 * Handle widget configuration from C4C
 * @param payload - Config payload
 * @private
 */
c4c.cti.integration.prototype._handleWidgetConfigFromC4C = function(payload) {
    console.log('⚙️ Widget config van C4C:', payload);
    addLog('⚙️ C4C: Widget configuratie ontvangen');
    
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
    addLog('🔌 C4C callback geregistreerd');
};

/**
 * Send call request to CTI adapter (legacy)
 * @param cadData - CAD data
 */
c4c.cti.integration.prototype.onSendCallRequestToCTIAdapter = function(cadData) {
    var query = "CID=BCM1234";
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
 * Send incoming call to C4C with Agent Buddy format
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
 * Send call accept to C4C with Agent Buddy format
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
 * Send call decline to C4C with Agent Buddy format
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
 * Send customer identification to C4C with Agent Buddy format
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

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize C4C integration for Agent Buddy
 */
function initializeAgentBuddyC4CIntegration() {
    console.log('🚀 Agent Buddy C4C integratie initialiseren...');
    
    try {
        // Initialize C4C integration
        var c4cIntegration = c4c.cti.integration.getInstance();
        
        // Register callback for C4C messages
        c4cIntegration.registerOutboundCallback(function(event) {
            console.log('📨 C4C callback triggered:', event);
        });
        
        addLog('🚀 Agent Buddy C4C integratie geïnitialiseerd');
    } catch (error) {
        console.warn('⚠️ C4C integratie initialisatie gefaald:', error.message);
        addLog('⚠️ C4C integratie niet beschikbaar - gebruik fallback mode');
        
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
window.initializeAgentBuddyC4CIntegration = initializeAgentBuddyC4CIntegration;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAgentBuddyC4CIntegration);
} else {
    initializeAgentBuddyC4CIntegration();
} 