/**
 * SocketView.controller.js
 * SAP Service Cloud Controller for Agent Buddy Integration
 * Handles Socket.io events and SAP Service Cloud API calls
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.sap.agentbuddy.controller.SocketView", {
        
        onInit: function () {
            console.log("🎯 Agent Buddy SAP UI5 Controller initialized");
            
            // Initialize models
            this._initializeModels();
            
            // Initialize audio
            this._initializeAudio();
            
            // Initialize Socket.io connection
            this._initializeSocketConnection();
            
            // Setup SAP C4C integration
            this._setupSAPC4CIntegration();
            
            // Setup postMessage listener
            this._setupPostMessageListener();
        },
        
        _initializeModels: function() {
            // Incoming call model
            this.oIncomingCallModel = new JSONModel({
                phoneNumber: "",
                callId: "",
                timestamp: "",
                status: "idle"
            });
            this.getView().setModel(this.oIncomingCallModel, "incomingCall");
            
            // Call status model
            this.oCallStatusModel = new JSONModel({
                status: "idle", // idle, ringing, connected, ended
                lastAction: "",
                agentId: ""
            });
            this.getView().setModel(this.oCallStatusModel, "callStatus");
            
            // Activity log model
            this.oActivityModel = new JSONModel({
                activities: []
            });
            this.getView().setModel(this.oActivityModel, "activity");
        },
        
        _initializeAudio: function() {
            // Initialize phone ringtone
            this.phoneAudio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT");
            this.phoneAudio.loop = true;
            
            // Initialize call end tone
            this.callEndAudio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT");
        },
        
        _initializeSocketConnection: function() {
            try {
                const socketUrl = this._getSocketUrl();
                this.socket = io(socketUrl, {
                    withCredentials: false,
                    connectTimeout: 45000
                });
                
                this._setupSocketEventHandlers();
                this._addActivity("🔌 Socket.io verbinding geïnitialiseerd");
                
            } catch (error) {
                console.error("❌ Socket.io initialization failed:", error);
                this._addActivity("❌ Socket.io initialisatie mislukt: " + error.message);
            }
        },
        
        _setupSocketEventHandlers: function() {
            if (!this.socket) return;
            
            this.socket.on('connect', () => {
                console.log("✅ Socket.io connected");
                this._addActivity("✅ Socket.io verbonden");
                this._updateConnectionStatus("connected");
            });
            
            this.socket.on('disconnect', () => {
                console.log("❌ Socket.io disconnected");
                this._addActivity("❌ Socket.io verbroken");
                this._updateConnectionStatus("disconnected");
            });
            
            this.socket.on('CALL_SIMULATED_BROADCAST', (data) => {
                console.log("📢 Call simulation received:", data);
                this.onNewPhone({
                    incomingCallData: data.callData,
                    phoneNumber: data.callData.phoneNumber
                });
            });
            
            this.socket.on('CALL_ACCEPTED', (data) => {
                console.log("✅ Call accepted event:", data);
                this.onCallAccepted({
                    callData: data
                });
            });
            
            this.socket.on('CALL_DECLINED', (data) => {
                console.log("❌ Call declined event:", data);
                this.onCallDeclined({
                    callData: data
                });
            });
            
            this.socket.on('CALL_ENDED', (data) => {
                console.log("📞 Call ended event:", data);
                this.onCallEnded({
                    callData: data
                });
            });
        },
        
        _setupSAPC4CIntegration: function() {
            this._SAPIntegration = {
                sendIncomingCalltoC4C: (param) => {
                    const payload = {
                        "Type": "CALL",
                        "EventType": "INBOUND",
                        "Action": "NOTIFY",
                        "ANI": param.ANI || "+31651616126",
                        "ExternalReferenceID": this._generateCallId(),
                        "Timestamp": new Date().toISOString()
                    };
                    
                    this._sendToC4C(payload);
                    this._addActivity("📤 SAP C4C NOTIFY verzonden: " + payload.ANI);
                },
                
                sendAcceptToC4C: (callData) => {
                    const payload = {
                        "Type": "CALL",
                        "EventType": "INBOUND",
                        "Action": "ACCEPT",
                        "ANI": callData.phoneNumber,
                        "ExternalReferenceID": callData.callId,
                        "Timestamp": new Date().toISOString()
                    };
                    
                    this._sendToC4C(payload);
                    this._addActivity("✅ SAP C4C ACCEPT verzonden: " + payload.ANI);
                },
                
                sendDeclineToC4C: (callData) => {
                    const payload = {
                        "Type": "CALL",
                        "EventType": "INBOUND",
                        "Action": "DECLINE",
                        "ANI": callData.phoneNumber,
                        "ExternalReferenceID": callData.callId,
                        "Timestamp": new Date().toISOString()
                    };
                    
                    this._sendToC4C(payload);
                    this._addActivity("❌ SAP C4C DECLINE verzonden: " + payload.ANI);
                },
                
                _sendToC4C: (payload) => {
                    const endpoint = this._getC4CEndpoint();
                    const credentials = this._getC4CCredentials();
                    
                    if (!endpoint || !credentials) {
                        console.warn("⚠️ C4C endpoint or credentials not configured");
                        this._addActivity("⚠️ C4C configuratie ontbreekt");
                        return;
                    }
                    
                    // Simulate C4C call (replace with actual HTTP call)
                    console.log("🏢 Sending to SAP C4C:", payload);
                    this._addActivity("🏢 C4C payload: " + JSON.stringify(payload));
                    
                    // In production, use actual HTTP call:
                    /*
                    $.ajax({
                        url: endpoint,
                        method: "POST",
                        data: JSON.stringify(payload),
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Basic " + btoa(credentials)
                        },
                        success: (response) => {
                            console.log("C4C call successful:", response);
                            this._addActivity("✅ C4C call successful");
                        },
                        error: (xhr, status, error) => {
                            console.error("C4C call failed:", error);
                            this._addActivity("❌ C4C call failed: " + error);
                        }
                    });
                    */
                }
            };
        },
        
        _setupPostMessageListener: function() {
            window.addEventListener('message', (event) => {
                if (event.data && event.data.source === 'agent-buddy') {
                    this._handleAgentBuddyMessage(event.data);
                }
            });
        },
        
        _handleAgentBuddyMessage: function(message) {
            console.log("📨 Agent Buddy message received:", message);
            
            switch (message.eventType) {
                case 'INCOMING_CALL':
                    this.onNewPhone({
                        incomingCallData: message.callData,
                        phoneNumber: message.callData.phoneNumber
                    });
                    break;
                    
                case 'CALL_ACCEPTED':
                    this.onCallAccepted({
                        callData: message.callData
                    });
                    break;
                    
                case 'CALL_DECLINED':
                    this.onCallDeclined({
                        callData: message.callData
                    });
                    break;
                    
                default:
                    console.log("📨 Unknown message type:", message.eventType);
            }
        },
        
        // Main call handler following the SAP UI5 pattern
        onNewPhone: function (oEvent) {
            console.log("📞 New phone call received:", oEvent);
            
            // Set Incoming Call Model Data
            this.incomingCall = oEvent.incomingCallData;
            this.oIncomingCallModel.setData(this.incomingCall);
            
            // Update call status
            this.oCallStatusModel.setProperty("/status", "ringing");
            this.oCallStatusModel.setProperty("/lastAction", "Incoming call");
            
            // Get phone icon tab filter
            this.phoneIconTabFilter = sap.ui
                .getCore()
                .byId("AgentView--idIconTabBarStretchContent")
                .getItems()[1];
            
            if (!this.phoneIconTabFilter.getVisible()) {
                // Setup audio loop
                this.phoneAudio.addEventListener(
                    "ended",
                    function () {
                        this.currentTime = 0;
                        this.play();
                    },
                    false
                );
                
                // Play ringtone
                this.phoneAudio.play();
                
                // Fire notification to C4C
                var param = {};
                param.ANI = oEvent.phoneNumber || "+31651616126";
                this._SAPIntegration.sendIncomingCalltoC4C(param);
                
                // Show phone icon tab
                this.phoneIconTabFilter.setVisible(true);
                this.phoneIconTabFilter.setIconColor("Critical");
                
                this._addActivity("📞 Incoming call: " + param.ANI);
            }
        },
        
        onCallAccepted: function(oEvent) {
            console.log("✅ Call accepted:", oEvent);
            
            var callData = oEvent.callData;
            
            // Update UI
            this._updateCallStatus("accepted");
            
            // Stop ringtone
            this._stopRingtone();
            
            // Send accept to SAP C4C
            this._SAPIntegration.sendAcceptToC4C(callData);
            
            // Update phone icon
            if (this.phoneIconTabFilter) {
                this.phoneIconTabFilter.setIconColor("Positive");
            }
            
            this._addActivity("✅ Call accepted: " + callData.phoneNumber);
        },
        
        onCallDeclined: function(oEvent) {
            console.log("❌ Call declined:", oEvent);
            
            var callData = oEvent.callData;
            
            // Update UI
            this._updateCallStatus("declined");
            
            // Stop ringtone
            this._stopRingtone();
            
            // Send decline to SAP C4C
            this._SAPIntegration.sendDeclineToC4C(callData);
            
            // Update phone icon
            if (this.phoneIconTabFilter) {
                this.phoneIconTabFilter.setIconColor("Negative");
            }
            
            this._addActivity("❌ Call declined: " + callData.phoneNumber);
        },
        
        onCallEnded: function(oEvent) {
            console.log("📞 Call ended:", oEvent);
            
            var callData = oEvent.callData;
            
            // Update UI
            this._updateCallStatus("ended");
            
            // Stop ringtone
            this._stopRingtone();
            
            // Play call end tone
            this.callEndAudio.play();
            
            // Hide phone icon tab after delay
            setTimeout(() => {
                if (this.phoneIconTabFilter) {
                    this.phoneIconTabFilter.setVisible(false);
                }
            }, 3000);
            
            this._addActivity("📞 Call ended: " + callData.phoneNumber);
        },
        
        // UI Event Handlers
        onAcceptCall: function() {
            if (this.incomingCall) {
                this.onCallAccepted({
                    callData: this.incomingCall
                });
            }
        },
        
        onDeclineCall: function() {
            if (this.incomingCall) {
                this.onCallDeclined({
                    callData: this.incomingCall
                });
            }
        },
        
        onSimulateCall: function() {
            const testCallData = {
                phoneNumber: "+31651616126",
                callId: "TEST-" + Date.now(),
                timestamp: new Date().toISOString()
            };
            
            this.onNewPhone({
                incomingCallData: testCallData,
                phoneNumber: testCallData.phoneNumber
            });
        },
        
        // Helper methods
        _updateCallStatus: function(status) {
            this.oCallStatusModel.setProperty("/status", status);
            
            switch(status) {
                case "accepted":
                    this.oCallStatusModel.setProperty("/lastAction", "Call accepted");
                    break;
                case "declined":
                    this.oCallStatusModel.setProperty("/lastAction", "Call declined");
                    break;
                case "ended":
                    this.oCallStatusModel.setProperty("/lastAction", "Call ended");
                    break;
            }
        },
        
        _playRingtone: function() {
            if (this.phoneAudio) {
                this.phoneAudio.play();
            }
        },
        
        _stopRingtone: function() {
            if (this.phoneAudio) {
                this.phoneAudio.pause();
                this.phoneAudio.currentTime = 0;
            }
        },
        
        _updateConnectionStatus: function(status) {
            this.oCallStatusModel.setProperty("/connectionStatus", status);
        },
        
        _addActivity: function(message) {
            const activities = this.oActivityModel.getProperty("/activities");
            activities.unshift({
                message: message,
                timestamp: new Date().toLocaleTimeString()
            });
            
            // Keep only last 50 activities
            if (activities.length > 50) {
                activities.splice(50);
            }
            
            this.oActivityModel.setProperty("/activities", activities);
        },
        
        _generateCallId: function() {
            return "CALL-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
        },
        
        _getSocketUrl: function() {
            // Get from environment or use default
            return window.CONFIG && window.CONFIG.SOCKET_URL || 
                   "https://agent-buddy-socketio.onrender.com";
        },
        
        _getC4CEndpoint: function() {
            // Get from environment or use default
            return window.CONFIG && window.CONFIG.SAP_ENDPOINT || 
                   "https://my1000354.de1.test.crm.cloud.sap/api/calls";
        },
        
        _getC4CCredentials: function() {
            const username = window.CONFIG && window.CONFIG.SAP_USERNAME || "LEEMREIA";
            const password = window.CONFIG && window.CONFIG.SAP_PASSWORD || "";
            return username + ":" + password;
        }
        
    });
}); 