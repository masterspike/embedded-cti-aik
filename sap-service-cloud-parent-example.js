/**
 * SAP Service Cloud Parent Window Handler
 * Voorbeeld van hoe SAP Service Cloud zou moeten reageren op Agent Buddy berichten
 * 
 * Dit bestand toont hoe de SAP Service Cloud parent window zou moeten luisteren
 * naar berichten van de Agent Buddy widget en acties zou moeten uitvoeren.
 */

// ============================================================================
// SAP SERVICE CLOUD PARENT WINDOW HANDLER
// ============================================================================

/**
 * Setup listener for Agent Buddy widget messages
 */
function setupAgentBuddyListener() {
    window.addEventListener('message', function(event) {
        console.log('📨 Bericht ontvangen van Agent Buddy:', event.data);
        
        // Verify it's from Agent Buddy widget
        if (event.data && event.data.source === 'agent-buddy') {
            handleAgentBuddyMessage(event.data);
        }
    });
    
    console.log('🔌 Agent Buddy listener geïnitialiseerd in SAP Service Cloud');
}

/**
 * Handle messages from Agent Buddy widget
 */
function handleAgentBuddyMessage(message) {
    console.log('📨 Agent Buddy bericht verwerken:', message);
    
    switch (message.Action) {
        case 'NOTIFY':
            handleIncomingCallNotification(message);
            break;
            
        case 'ACCEPT':
            handleCallAccepted(message);
            break;
            
        case 'DECLINE':
            handleCallDeclined(message);
            break;
            
        case 'LOAD':
            handleCustomerIdentification(message);
            break;
            
        case 'READY':
            handleWidgetReady(message);
            break;
            
        default:
            console.log('📨 Onbekend Agent Buddy bericht type:', message.Action);
    }
}

/**
 * Handle incoming call notification from Agent Buddy
 */
function handleIncomingCallNotification(message) {
    console.log('📞 Incoming call van Agent Buddy:', message);
    
    // 1. Update SAP Service Cloud UI
    updateSAPServiceCloudUI('incoming_call', {
        phoneNumber: message.ANI,
        callId: message.ExternalReferenceID,
        timestamp: message.Timestamp
    });
    
    // 2. Show call notification in SAP Service Cloud
    showSAPCallNotification(message.ANI);
    
    // 3. Update agent status
    updateAgentStatus('on_call');
    
    // 4. Log call event
    logCallEvent('INCOMING_CALL', message);
    
    console.log('✅ Incoming call verwerkt in SAP Service Cloud');
}

/**
 * Handle call accepted from Agent Buddy
 */
function handleCallAccepted(message) {
    console.log('✅ Call accepted van Agent Buddy:', message);
    
    // 1. Update SAP Service Cloud UI
    updateSAPServiceCloudUI('call_accepted', {
        phoneNumber: message.ANI,
        callId: message.ExternalReferenceID,
        timestamp: message.Timestamp
    });
    
    // 2. Load customer information
    loadCustomerByPhone(message.ANI);
    
    // 3. Update agent status
    updateAgentStatus('in_call');
    
    // 4. Log call event
    logCallEvent('CALL_ACCEPTED', message);
    
    // 5. Show success notification
    showSAPSuccessNotification('Call geaccepteerd voor ' + message.ANI);
    
    console.log('✅ Call accepted verwerkt in SAP Service Cloud');
}

/**
 * Handle call declined from Agent Buddy
 */
function handleCallDeclined(message) {
    console.log('❌ Call declined van Agent Buddy:', message);
    
    // 1. Update SAP Service Cloud UI
    updateSAPServiceCloudUI('call_declined', {
        phoneNumber: message.ANI,
        callId: message.ExternalReferenceID,
        timestamp: message.Timestamp,
        reason: message.Reason
    });
    
    // 2. Update agent status
    updateAgentStatus('available');
    
    // 3. Log call event
    logCallEvent('CALL_DECLINED', message);
    
    // 4. Show decline notification
    showSAPDeclineNotification(message.ANI, message.Reason);
    
    console.log('✅ Call declined verwerkt in SAP Service Cloud');
}

/**
 * Handle customer identification from Agent Buddy
 */
function handleCustomerIdentification(message) {
    console.log('👤 Customer identification van Agent Buddy:', message);
    
    if (message.CustomerData) {
        // 1. Update customer screen in SAP Service Cloud
        updateCustomerScreen(message.CustomerData);
        
        // 2. Load customer history
        loadCustomerHistory(message.ANI);
        
        // 3. Show customer info
        showCustomerInfo(message.CustomerData);
        
        console.log('✅ Customer identification verwerkt in SAP Service Cloud');
    }
}

/**
 * Handle widget ready notification from Agent Buddy
 */
function handleWidgetReady(message) {
    console.log('🚀 Agent Buddy widget ready:', message);
    
    // 1. Update widget status
    updateWidgetStatus('ready');
    
    // 2. Send configuration to Agent Buddy
    sendConfigurationToAgentBuddy();
    
    // 3. Log widget ready
    logWidgetEvent('WIDGET_READY', message);
    
    console.log('✅ Agent Buddy widget ready verwerkt in SAP Service Cloud');
}

// ============================================================================
// SAP SERVICE CLOUD UI UPDATE FUNCTIONS
// ============================================================================

/**
 * Update SAP Service Cloud UI based on call events
 */
function updateSAPServiceCloudUI(eventType, data) {
    // This would update the actual SAP Service Cloud UI
    console.log('🎨 SAP Service Cloud UI update:', eventType, data);
    
    switch (eventType) {
        case 'incoming_call':
            // Update call status indicator
            updateCallStatusIndicator('incoming', data.phoneNumber);
            break;
            
        case 'call_accepted':
            // Update call status indicator
            updateCallStatusIndicator('active', data.phoneNumber);
            // Show customer screen
            showCustomerScreen();
            break;
            
        case 'call_declined':
            // Update call status indicator
            updateCallStatusIndicator('ended', data.phoneNumber);
            // Hide customer screen
            hideCustomerScreen();
            break;
    }
}

/**
 * Show call notification in SAP Service Cloud
 */
function showSAPCallNotification(phoneNumber) {
    // This would show a notification in SAP Service Cloud
    console.log('🔔 SAP Service Cloud call notification voor:', phoneNumber);
    
    // Example: Show toast notification
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "showCallNotification", {phoneNumber: phoneNumber});
}

/**
 * Show success notification in SAP Service Cloud
 */
function showSAPSuccessNotification(message) {
    // This would show a success notification in SAP Service Cloud
    console.log('✅ SAP Service Cloud success notification:', message);
    
    // Example: Show success toast
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "showSuccessNotification", {message: message});
}

/**
 * Show decline notification in SAP Service Cloud
 */
function showSAPDeclineNotification(phoneNumber, reason) {
    // This would show a decline notification in SAP Service Cloud
    console.log('❌ SAP Service Cloud decline notification voor:', phoneNumber, 'Reden:', reason);
    
    // Example: Show decline toast
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "showDeclineNotification", {phoneNumber: phoneNumber, reason: reason});
}

/**
 * Update call status indicator in SAP Service Cloud
 */
function updateCallStatusIndicator(status, phoneNumber) {
    // This would update the call status indicator in SAP Service Cloud
    console.log('📞 Call status indicator update:', status, phoneNumber);
    
    // Example: Update status indicator
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateCallStatus", {status: status, phoneNumber: phoneNumber});
}

/**
 * Show customer screen in SAP Service Cloud
 */
function showCustomerScreen() {
    // This would show the customer screen in SAP Service Cloud
    console.log('👤 Customer screen tonen in SAP Service Cloud');
    
    // Example: Show customer screen
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "showCustomerScreen", {});
}

/**
 * Hide customer screen in SAP Service Cloud
 */
function hideCustomerScreen() {
    // This would hide the customer screen in SAP Service Cloud
    console.log('👤 Customer screen verbergen in SAP Service Cloud');
    
    // Example: Hide customer screen
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "hideCustomerScreen", {});
}

/**
 * Update customer screen with customer data
 */
function updateCustomerScreen(customerData) {
    // This would update the customer screen with customer data
    console.log('👤 Customer screen update met data:', customerData);
    
    // Example: Update customer screen
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateCustomerScreen", {customerData: customerData});
}

/**
 * Show customer info in SAP Service Cloud
 */
function showCustomerInfo(customerData) {
    // This would show customer information in SAP Service Cloud
    console.log('👤 Customer info tonen:', customerData);
    
    // Example: Show customer info
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "showCustomerInfo", {customerData: customerData});
}

/**
 * Update agent status in SAP Service Cloud
 */
function updateAgentStatus(status) {
    // This would update the agent status in SAP Service Cloud
    console.log('👤 Agent status update:', status);
    
    // Example: Update agent status
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateAgentStatus", {status: status});
}

/**
 * Update widget status in SAP Service Cloud
 */
function updateWidgetStatus(status) {
    // This would update the widget status in SAP Service Cloud
    console.log('🔧 Widget status update:', status);
    
    // Example: Update widget status
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateWidgetStatus", {status: status});
}

// ============================================================================
// SAP SERVICE CLOUD DATA FUNCTIONS
// ============================================================================

/**
 * Load customer by phone number
 */
function loadCustomerByPhone(phoneNumber) {
    // This would load customer data from SAP Service Cloud
    console.log('👤 Customer laden voor telefoonnummer:', phoneNumber);
    
    // Example: Load customer data
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "loadCustomer", {phoneNumber: phoneNumber});
}

/**
 * Load customer history
 */
function loadCustomerHistory(phoneNumber) {
    // This would load customer history from SAP Service Cloud
    console.log('📋 Customer history laden voor telefoonnummer:', phoneNumber);
    
    // Example: Load customer history
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "loadCustomerHistory", {phoneNumber: phoneNumber});
}

/**
 * Send configuration to Agent Buddy
 */
function sendConfigurationToAgentBuddy() {
    // This would send configuration to the Agent Buddy widget
    console.log('⚙️ Configuratie verzenden naar Agent Buddy');
    
    const config = {
        socketUrl: 'https://agent-buddy-socketio.onrender.com',
        sapEndpoint: 'https://my1000354.de1.test.crm.cloud.sap/api/calls',
        agentId: 'AGENT-12345',
        sessionId: 'SESSION-' + Date.now()
    };
    
    // Send configuration to Agent Buddy widget
    const agentBuddyFrame = document.getElementById('agent-buddy-frame');
    if (agentBuddyFrame && agentBuddyFrame.contentWindow) {
        agentBuddyFrame.contentWindow.postMessage({
            type: 'WIDGET_CONFIG',
            config: config,
            source: 'sap-service-cloud'
        }, "*");
    }
}

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

/**
 * Log call events in SAP Service Cloud
 */
function logCallEvent(eventType, data) {
    // This would log call events in SAP Service Cloud
    console.log('📝 Call event gelogd:', eventType, data);
    
    // Example: Log call event
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "logCallEvent", {eventType: eventType, data: data});
}

/**
 * Log widget events in SAP Service Cloud
 */
function logWidgetEvent(eventType, data) {
    // This would log widget events in SAP Service Cloud
    console.log('📝 Widget event gelogd:', eventType, data);
    
    // Example: Log widget event
    // sap.ui.getCore().getEventBus().publish("AgentBuddy", "logWidgetEvent", {eventType: eventType, data: data});
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize SAP Service Cloud Agent Buddy integration
 */
function initializeSAPServiceCloudAgentBuddyIntegration() {
    console.log('🚀 SAP Service Cloud Agent Buddy integratie initialiseren...');
    
    // Setup listener for Agent Buddy messages
    setupAgentBuddyListener();
    
    // Initialize other SAP Service Cloud components
    // This would initialize the actual SAP Service Cloud components
    
    console.log('✅ SAP Service Cloud Agent Buddy integratie geïnitialiseerd');
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSAPServiceCloudAgentBuddyIntegration);
} else {
    initializeSAPServiceCloudAgentBuddyIntegration();
} 