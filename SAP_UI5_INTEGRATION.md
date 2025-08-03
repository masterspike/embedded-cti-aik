# SAP UI5 Integration voor Agent Buddy

## Overview
Dit document beschrijft de integratie van Agent Buddy met SAP Service Cloud via SAP UI5/OpenUI5.

## Bestaande Implementatie

### 1. PostMessage Integration
- `postmessage-integration.js` - Voor iframe communicatie
- `window.parent.postMessage()` - Voor directe communicatie met SAP parent window

### 2. Direct HTTP Integration
- `sendSAPPayloadToSAP()` - Directe HTTP calls naar SAP API
- Basic Authentication support
- Configuratie via environment variables

### 3. SAP UI5 Controller
- `SocketView.controller.js` - Native SAP UI5 controller
- `SocketView.view.xml` - SAP UI5 view definitie
- `manifest.json` - SAP UI5 app descriptor

## SAP UI5 Call Handling Pattern

### Voorbeeld van SAP UI5 Call Handler:
```javascript
onNewPhone: function (oEvent) {
    // Set Incoming Call Model Data
    this.incomingCall = oEvent.incomingCallData;
    this.oIncomingCallModel.setData(this.incomingCall);

    this.phoneIconTabFilter = sap.ui
        .getCore()
        .byId("AgentView--idIconTabBarStretchContent")
        .getItems()[1];
    
    if (!this.phoneIconTabFilter.getVisible()) {
        this.phoneAudio.addEventListener(
            "ended",
            function () {
                this.currentTime = 0;
                this.play();
            },
            false
        );
        this.phoneAudio.play();
        
        // Fire notification to C4C
        var param = {};
        param.ANI = oEvent.phoneNumber || "+1 123 456 7890";
        this._SAPIntegration.sendIncomingCalltoC4C(param);

        this.phoneIconTabFilter.setVisible(true);
        this.phoneIconTabFilter.setIconColor("Critical");
    }
}
```

### Belangrijke Elementen:
1. **Model Data Binding**: `this.oIncomingCallModel.setData(this.incomingCall)`
2. **UI State Management**: Icon tab visibility en color changes
3. **Audio Integration**: Phone ringtone met loop
4. **SAP C4C Integration**: `this._SAPIntegration.sendIncomingCalltoC4C(param)`
5. **Event-driven Architecture**: `onNewPhone` event handler

## Agent Buddy Integration

### 1. SAP UI5 Event Handler
```javascript
// In SocketView.controller.js
onIncomingCall: function(oEvent) {
    var callData = oEvent.getParameter("callData");
    
    // Update model
    this.getView().getModel("incomingCall").setData(callData);
    
    // Show call notification
    this._showCallNotification(callData);
    
    // Play ringtone
    this._playRingtone();
    
    // Send to SAP C4C
    this._sendToSAPC4C(callData);
},

onCallAccepted: function(oEvent) {
    var callData = oEvent.getParameter("callData");
    
    // Update UI
    this._updateCallStatus("accepted");
    
    // Stop ringtone
    this._stopRingtone();
    
    // Send accept to SAP C4C
    this._sendAcceptToSAPC4C(callData);
},

onCallDeclined: function(oEvent) {
    var callData = oEvent.getParameter("callData");
    
    // Update UI
    this._updateCallStatus("declined");
    
    // Stop ringtone
    this._stopRingtone();
    
    // Send decline to SAP C4C
    this._sendDeclineToSAPC4C(callData);
}
```

### 2. Model Integration
```javascript
// In manifest.json
"models": {
    "incomingCall": {
        "type": "sap.ui.model.json.JSONModel",
        "settings": {}
    },
    "callStatus": {
        "type": "sap.ui.model.json.JSONModel",
        "settings": {
            "status": "idle"
        }
    }
}
```

### 3. View Integration
```xml
<!-- In SocketView.view.xml -->
<IconTabBar id="idIconTabBarStretchContent">
    <items>
        <IconTabFilter icon="sap-icon://message" text="Messages"/>
        <IconTabFilter icon="sap-icon://phone" text="Calls" visible="false"/>
    </items>
</IconTabBar>

<Panel visible="{= ${callStatus>/status} !== 'idle'}">
    <content>
        <VBox>
            <Text text="Incoming Call: {incomingCall>/phoneNumber}"/>
            <HBox>
                <Button text="Accept" press="onCallAccepted" type="Accept"/>
                <Button text="Decline" press="onCallDeclined" type="Reject"/>
            </HBox>
        </VBox>
    </content>
</Panel>
```

## Integration Points

### 1. Agent Buddy → SAP UI5
```javascript
// In Agent Buddy (cti-new.js)
function sendToSAPUI5(eventType, callData) {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            source: 'agent-buddy',
            eventType: eventType,
            callData: callData,
            timestamp: new Date().toISOString()
        }, "*");
    }
}
```

### 2. SAP UI5 → Agent Buddy
```javascript
// In SAP UI5 Controller
onMessageReceived: function(oEvent) {
    var message = oEvent.getParameter("message");
    
    if (message.source === 'agent-buddy') {
        switch (message.eventType) {
            case 'INCOMING_CALL':
                this.onIncomingCall(message.callData);
                break;
            case 'CALL_ACCEPTED':
                this.onCallAccepted(message.callData);
                break;
            case 'CALL_DECLINED':
                this.onCallDeclined(message.callData);
                break;
        }
    }
}
```

## Audio Integration

### 1. Ringtone Setup
```javascript
// In SAP UI5 Controller
onInit: function() {
    this.phoneAudio = new Audio("path/to/ringtone.mp3");
    this.phoneAudio.loop = true;
},

_playRingtone: function() {
    this.phoneAudio.play();
},

_stopRingtone: function() {
    this.phoneAudio.pause();
    this.phoneAudio.currentTime = 0;
}
```

### 2. Agent Buddy Audio
```javascript
// In Agent Buddy
let ringtone = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
ringtone.loop = true;

function playRingtone() {
    ringtone.play();
}

function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
}
```

## C4C Integration

### 1. SAP C4C Service
```javascript
// In SAP UI5 Controller
_SAPIntegration: {
    sendIncomingCalltoC4C: function(param) {
        var payload = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "NOTIFY",
            "ANI": param.ANI,
            "ExternalReferenceID": this._generateCallId(),
            "Timestamp": new Date().toISOString()
        };
        
        // Send to C4C via HTTP
        this._sendToC4C(payload);
    },
    
    sendAcceptToC4C: function(callData) {
        var payload = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "ACCEPT",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": new Date().toISOString()
        };
        
        this._sendToC4C(payload);
    },
    
    sendDeclineToC4C: function(callData) {
        var payload = {
            "Type": "CALL",
            "EventType": "INBOUND",
            "Action": "DECLINE",
            "ANI": callData.phoneNumber,
            "ExternalReferenceID": callData.callId,
            "Timestamp": new Date().toISOString()
        };
        
        this._sendToC4C(payload);
    },
    
    _sendToC4C: function(payload) {
        // HTTP call naar SAP C4C
        $.ajax({
            url: this._getC4CEndpoint(),
            method: "POST",
            data: JSON.stringify(payload),
            contentType: "application/json",
            headers: {
                "Authorization": "Basic " + btoa(this._getC4CCredentials())
            },
            success: function(response) {
                console.log("C4C call successful:", response);
            },
            error: function(xhr, status, error) {
                console.error("C4C call failed:", error);
            }
        });
    }
}
```

## Deployment

### 1. SAP UI5 App Deployment
- Deploy naar SAP Cloud Platform
- Configureer routing en dependencies
- Set environment variables voor endpoints

### 2. Agent Buddy Integration
- Embed Agent Buddy als iframe in SAP UI5 app
- Configureer postMessage handlers
- Test integratie flow

## Testing

### 1. Local Testing
```javascript
// Test SAP UI5 integration
function testSAPUI5Integration() {
    // Simulate incoming call
    var callData = {
        phoneNumber: "+31651616126",
        callId: "TEST-" + Date.now(),
        timestamp: new Date().toISOString()
    };
    
    // Send to SAP UI5
    sendToSAPUI5('INCOMING_CALL', callData);
}
```

### 2. Production Testing
- Test met echte SAP C4C instance
- Verify call flow end-to-end
- Monitor logs en errors

## Troubleshooting

### 1. Common Issues
- **CORS Errors**: Configure SAP C4C CORS settings
- **Authentication**: Verify Basic Auth credentials
- **PostMessage**: Check origin en target window
- **Audio**: Verify audio file paths en permissions

### 2. Debug Tools
- Browser Developer Tools
- SAP UI5 Inspector
- Network monitoring
- Console logging

## Best Practices

1. **Error Handling**: Implement robust error handling
2. **Logging**: Add comprehensive logging
3. **Security**: Validate all inputs en outputs
4. **Performance**: Optimize audio en UI updates
5. **Accessibility**: Ensure WCAG compliance
6. **Testing**: Comprehensive test coverage 