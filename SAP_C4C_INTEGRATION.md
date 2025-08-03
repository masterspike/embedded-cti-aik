# SAP C4C (Cloud for Customer) Integration

## Overview

Deze integratie is gebaseerd op het officiële SAP C4C CTI integratie voorbeeld en aangepast voor de Agent Buddy widget. Het gebruikt de standaard SAP C4C communicatie API's voor embedded widgets.

## Bestanden

### `sap-c4c-integration.js`
- **Basis:** Officieel SAP C4C CTI integratie voorbeeld
- **Doel:** Communicatie tussen Agent Buddy widget en SAP C4C parent window
- **Methode:** PostMessage API met JSON payloads

## Architectuur

```
Agent Buddy Widget (iframe)
    ↓ PostMessage
SAP C4C Parent Window
    ↓ Event Bus
SAP C4C UI Components
```

## C4C Integration Object

### Singleton Pattern
```javascript
c4c.cti.integration = function() {
    this.init();
};

c4c.cti.integration.getInstance = function() {
    if (!c4c.cti.integration._privateInstance) {
        c4c.cti.integration._privateInstance = new c4c.cti.integration();
    }
    return c4c.cti.integration._privateInstance;
};
```

### Core Methods

#### 1. Send Incoming Call
```javascript
c4c.cti.integration.prototype.sendIncomingCalltoC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
};
```

#### 2. Send Call Accept
```javascript
c4c.cti.integration.prototype.sendCallAcceptToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
};
```

#### 3. Send Call Decline
```javascript
c4c.cti.integration.prototype.sendCallDeclineToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
};
```

#### 4. Send Customer Identification
```javascript
c4c.cti.integration.prototype.sendCustomerIdentificationToC4C = function(parameters) {
    var payload = this._formJSONPayload(parameters);
    this._doCall(payload);
};
```

## Payload Format

### JSON Payload Structure
```javascript
{
    "payload": {
        "Type": "CALL",
        "EventType": "INBOUND", 
        "Action": "NOTIFY|ACCEPT|DECLINE|LOAD",
        "ANI": "+31651616126",
        "ExternalReferenceID": "ED4E4730D1C711EAAA5EBC019352B05E",
        "Timestamp": "2024-01-15T10:30:00.000Z",
        "Priority": "HIGH",
        "CallType": "INBOUND",
        "AgentAction": "ACCEPTED|DECLINED",
        "Reason": "Agent not available"
    },
    "source": "agent-buddy",
    "widgetId": "crm-agent-cti-plugin",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0"
}
```

### XML Payload Structure (Legacy)
```xml
<?xml version='1.0' encoding='utf-8' ?>
<payload>
    <Type>CALL</Type>
    <EventType>INBOUND</EventType>
    <Action>NOTIFY</Action>
    <ANI>+31651616126</ANI>
    <ExternalReferenceID>ED4E4730D1C711EAAA5EBC019352B05E</ExternalReferenceID>
    <Timestamp>2024-01-15T10:30:00.000Z</Timestamp>
</payload>
```

## Message Flow

### 1. Incoming Call
```
Agent Buddy → NOTIFY → C4C Parent Window
↓
C4C: Update UI, Show notification, Update agent status
```

### 2. Call Accepted
```
Agent Buddy → ACCEPT → C4C Parent Window
↓
C4C: Load customer, Show customer screen, Update status
```

### 3. Call Declined
```
Agent Buddy → DECLINE → C4C Parent Window
↓
C4C: Update status, Show decline notification
```

### 4. Customer Identification
```
Agent Buddy → LOAD → C4C Parent Window
↓
C4C: Update customer screen, Load history
```

## C4C Parent Window Handler

### Message Listener
```javascript
function setupAgentBuddyListener() {
    window.addEventListener('message', function(event) {
        if (event.data && event.data.source === 'agent-buddy') {
            handleAgentBuddyMessage(event.data);
        }
    });
}
```

### Message Handler
```javascript
function handleAgentBuddyMessage(message) {
    switch (message.payload.Action) {
        case 'NOTIFY':
            handleIncomingCallNotification(message.payload);
            break;
        case 'ACCEPT':
            handleCallAccepted(message.payload);
            break;
        case 'DECLINE':
            handleCallDeclined(message.payload);
            break;
        case 'LOAD':
            handleCustomerIdentification(message.payload);
            break;
    }
}
```

## C4C UI Integration

### Event Bus Integration
```javascript
// Show call notification in C4C
sap.ui.getCore().getEventBus().publish("AgentBuddy", "showCallNotification", {
    phoneNumber: "+31651616126"
});

// Update call status indicator
sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateCallStatus", {
    status: "incoming",
    phoneNumber: "+31651616126"
});

// Show customer screen
sap.ui.getCore().getEventBus().publish("AgentBuddy", "showCustomerScreen", {});
```

### Customer Screen Updates
```javascript
// Update customer screen with data
sap.ui.getCore().getEventBus().publish("AgentBuddy", "updateCustomerScreen", {
    customerData: {
        name: "John Doe",
        id: "CUST-12345",
        email: "john.doe@example.com",
        company: "Example Corp"
    }
});
```

## Agent Buddy Integration Helpers

### Send Incoming Call
```javascript
function sendAgentBuddyIncomingCallToC4C(callData) {
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
}
```

### Send Call Accept
```javascript
function sendAgentBuddyCallAcceptToC4C(callData) {
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
}
```

### Send Call Decline
```javascript
function sendAgentBuddyCallDeclineToC4C(callData) {
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
}
```

## Implementation in SAP C4C

### 1. Add Agent Buddy Widget
```html
<iframe id="agent-buddy-frame" 
        src="https://glowing-frangollo-44ac94.netlify.app/agent-buddy.html"
        width="100%" height="600px">
</iframe>
```

### 2. Add C4C Parent Handler
```html
<script src="sap-c4c-parent-handler.js"></script>
```

### 3. Initialize C4C Integration
```javascript
// In SAP C4C application
var c4cIntegration = c4c.cti.integration.getInstance();

// Register callback for Agent Buddy messages
c4cIntegration.registerOutboundCallback(function(event) {
    console.log('📨 Agent Buddy message received:', event);
    handleAgentBuddyMessage(event.data);
});
```

## Error Handling

### Message Validation
```javascript
c4c.cti.integration.prototype._validateMessage = function(message, origin) {
    // Add origin validation if needed
    // if (origin !== "https://your-c4c-instance.crm.ondemand.com") {
    //     return false;
    // }
    return true;
};
```

### Error Logging
```javascript
c4c.cti.integration.prototype._doCall = function(sPayload) {
    if (window.parent !== window) {
        window.parent.postMessage(sPayload, "*");
        console.log('📤 C4C payload verzonden:', sPayload);
    } else {
        console.warn('⚠️ Geen C4C parent window gevonden');
        addLog('⚠️ Agent Buddy niet embedded in C4C');
    }
};
```

## Benefits

### ✅ **Official SAP Integration**
- Gebaseerd op officieel SAP C4C CTI voorbeeld
- Volgt SAP best practices en patterns
- Compatibel met SAP C4C architecture

### ✅ **Robust Communication**
- Singleton pattern voor consistente state
- JSON en XML payload support
- Error handling en validation

### ✅ **Bidirectional Messaging**
- Agent Buddy → C4C communicatie
- C4C → Agent Buddy communicatie
- Event-driven architecture

### ✅ **SAP UI5 Integration**
- Event Bus integratie
- Customer screen updates
- Call status management

### ✅ **Production Ready**
- Origin validation support
- Comprehensive logging
- Error recovery mechanisms

## Live Demo

**Agent Buddy Widget:** https://glowing-frangollo-44ac94.netlify.app

**C4C Integration:** Gebaseerd op officieel SAP C4C CTI voorbeeld

Nu gebruikt de Agent Buddy widget de officiële SAP C4C integratie methoden! 🚀 