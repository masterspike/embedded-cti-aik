/**
 * SocketView.controller.js
 * SAP Service Cloud Controller for Agent Buddy Integration
 * Handles Socket.io events and SAP Service Cloud API calls
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, History, UIComponent, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("com.sap.agentbuddy.SocketView", {
        
        /**
         * Called when the controller is instantiated
         */
        onInit: function () {
            this._initializeSocketConnection();
            this._setupSAPIntegration();
            this._logControllerInitialized();
        },

        /**
         * Initialize Socket.io connection
         */
        _initializeSocketConnection: function () {
            try {
                // Load Socket.io library
                const script = document.createElement('script');
                script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
                script.onload = () => {
                    this._connectToSocketServer();
                };
                script.onerror = (error) => {
                    this._logError('Socket.io library failed to load', error);
                };
                document.head.appendChild(script);
            } catch (error) {
                this._logError('Failed to initialize socket connection', error);
            }
        },

        /**
         * Connect to Socket.io server
         */
        _connectToSocketServer: function () {
            try {
                const socketUrl = this._getSocketUrl();
                this.socket = io(socketUrl, {
                    transports: ['polling'],
                    timeout: 30000,
                    forceNew: true,
                    reconnection: true,
                    reconnectionAttempts: 10,
                    reconnectionDelay: 1000,
                    withCredentials: true
                });

                this._setupSocketEventHandlers();
                this._logInfo('Socket.io connection initialized', { url: socketUrl });
            } catch (error) {
                this._logError('Failed to connect to socket server', error);
            }
        },

        /**
         * Setup Socket.io event handlers
         */
        _setupSocketEventHandlers: function () {
            if (!this.socket) return;

            // Connection events
            this.socket.on('connect', () => {
                this._logInfo('Socket.io connected', { socketId: this.socket.id });
                this._updateConnectionStatus('Connected');
            });

            this.socket.on('disconnect', () => {
                this._logInfo('Socket.io disconnected');
                this._updateConnectionStatus('Disconnected');
            });

            this.socket.on('connect_error', (error) => {
                this._logError('Socket.io connection error', error);
                this._updateConnectionStatus('Error');
            });

            // Call events
            this.socket.on('CALL_SIMULATED_BROADCAST', (data) => {
                this._handleIncomingCall(data.callData);
            });

            this.socket.on('SAP_INTEGRATION_BROADCAST', (data) => {
                this._handleSAPIntegration(data.sapData);
            });

            // Message events
            this.socket.on('MESSAGE_RECEIVED', (data) => {
                this._logInfo('Message received', data);
            });

            this.socket.on('CONNECTION_ESTABLISHED', (data) => {
                this._logInfo('Connection established', data);
            });
        },

        /**
         * Setup SAP Service Cloud integration
         */
        _setupSAPIntegration: function () {
            this.sapEndpoint = this._getSAPEndpoint();
            this.sapCredentials = this._getSAPCredentials();
            
            this._logInfo('SAP integration initialized', {
                endpoint: this.sapEndpoint,
                hasCredentials: !!this.sapCredentials
            });
        },

        /**
         * Handle incoming call
         */
        _handleIncomingCall: function (callData) {
            try {
                this._logInfo('Incoming call received', callData);
                
                // Create SAP notification
                const sapNotification = {
                    "Type": "CALL",
                    "EventType": "INBOUND",
                    "Action": "NOTIFY",
                    "ANI": callData.phoneNumber,
                    "ExternalReferenceID": callData.callId,
                    "Timestamp": new Date().toISOString()
                };

                // Send to SAP Service Cloud
                this._sendToSAPServiceCloud(sapNotification);
                
                // Update UI
                this._updateCallDisplay(callData);
                
                // Show notification
                this._showCallNotification(callData);
                
            } catch (error) {
                this._logError('Failed to handle incoming call', error);
            }
        },

        /**
         * Handle SAP integration events
         */
        _handleSAPIntegration: function (sapData) {
            try {
                this._logInfo('SAP integration event', sapData);
                
                switch (sapData.Action) {
                    case 'ACCEPT':
                        this._handleCallAccepted(sapData);
                        break;
                    case 'DECLINE':
                        this._handleCallDeclined(sapData);
                        break;
                    case 'NOTIFY':
                        this._handleCallNotification(sapData);
                        break;
                    default:
                        this._logWarning('Unknown SAP action', sapData.Action);
                }
            } catch (error) {
                this._logError('Failed to handle SAP integration', error);
            }
        },

        /**
         * Send data to SAP Service Cloud
         */
        _sendToSAPServiceCloud: function (sapPayload) {
            try {
                if (!this.sapEndpoint || !this.sapCredentials) {
                    this._logWarning('SAP credentials not configured');
                    return;
                }

                // Create Basic Auth header
                const credentials = btoa(`${this.sapCredentials.username}:${this.sapCredentials.password}`);
                
                fetch(this.sapEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(sapPayload)
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                })
                .then(data => {
                    this._logInfo('SAP Service Cloud response', data);
                    this._showSuccessMessage('SAP integration successful');
                })
                .catch(error => {
                    this._logError('SAP Service Cloud request failed', error);
                    this._showErrorMessage('SAP integration failed: ' + error.message);
                });

            } catch (error) {
                this._logError('Failed to send to SAP Service Cloud', error);
            }
        },

        /**
         * Handle call accepted
         */
        _handleCallAccepted: function (sapData) {
            this._logInfo('Call accepted', sapData);
            this._showSuccessMessage('Call accepted successfully');
            this._updateCallStatus('Accepted');
        },

        /**
         * Handle call declined
         */
        _handleCallDeclined: function (sapData) {
            this._logInfo('Call declined', sapData);
            this._showInfoMessage('Call declined');
            this._updateCallStatus('Declined');
        },

        /**
         * Handle call notification
         */
        _handleCallNotification: function (sapData) {
            this._logInfo('Call notification', sapData);
            this._updateCallStatus('Notified');
        },

        /**
         * Accept call
         */
        acceptCall: function () {
            try {
                const sapPayload = {
                    "Type": "CALL",
                    "EventType": "INBOUND",
                    "Action": "ACCEPT",
                    "ANI": this.currentCall?.phoneNumber,
                    "ExternalReferenceID": this.currentCall?.callId,
                    "Timestamp": new Date().toISOString()
                };

                this._sendToSAPServiceCloud(sapPayload);
                this._emitSocketEvent('CALL_ACCEPTED', sapPayload);
                
            } catch (error) {
                this._logError('Failed to accept call', error);
            }
        },

        /**
         * Decline call
         */
        declineCall: function () {
            try {
                const sapPayload = {
                    "Type": "CALL",
                    "EventType": "INBOUND",
                    "Action": "DECLINE",
                    "ANI": this.currentCall?.phoneNumber,
                    "ExternalReferenceID": this.currentCall?.callId,
                    "Timestamp": new Date().toISOString()
                };

                this._sendToSAPServiceCloud(sapPayload);
                this._emitSocketEvent('CALL_DECLINED', sapPayload);
                
            } catch (error) {
                this._logError('Failed to decline call', error);
            }
        },

        /**
         * Simulate incoming call
         */
        simulateIncomingCall: function () {
            try {
                const testCall = {
                    phoneNumber: '+31651616126',
                    callId: 'CALL-' + Math.floor(Math.random() * 10000),
                    timestamp: new Date().toISOString()
                };

                this._emitSocketEvent('CALL_SIMULATED', testCall);
                this._logInfo('Call simulation sent', testCall);
                
            } catch (error) {
                this._logError('Failed to simulate call', error);
            }
        },

        /**
         * Emit socket event
         */
        _emitSocketEvent: function (event, data) {
            if (this.socket && this.socket.connected) {
                this.socket.emit('message', {
                    type: event,
                    data: data
                });
                this._logInfo('Socket event emitted', { event, data });
            } else {
                this._logWarning('Socket not connected, cannot emit event', event);
            }
        },

        /**
         * Get Socket.io URL
         */
        _getSocketUrl: function () {
            // Try environment variable first
            if (window.CONFIG && window.getConfig) {
                const configUrl = getConfig('SOCKET_URL');
                if (configUrl) return configUrl;
            }
            
            // Fallback to Render.com URL
            return 'https://agent-buddy-socketio.onrender.com';
        },

        /**
         * Get SAP endpoint
         */
        _getSAPEndpoint: function () {
            if (window.CONFIG && window.getConfig) {
                return getConfig('SAP_ENDPOINT');
            }
            return 'https://my1000354.de1.test.crm.cloud.sap/api/calls';
        },

        /**
         * Get SAP credentials
         */
        _getSAPCredentials: function () {
            if (window.CONFIG && window.getConfig) {
                const username = getConfig('SAP_USERNAME');
                const password = getConfig('SAP_PASSWORD');
                if (username && password) {
                    return { username, password };
                }
            }
            return null;
        },

        /**
         * Update connection status
         */
        _updateConnectionStatus: function (status) {
            const statusElement = this.byId('connectionStatus');
            if (statusElement) {
                statusElement.setText(status);
            }
        },

        /**
         * Update call display
         */
        _updateCallDisplay: function (callData) {
            this.currentCall = callData;
            // Update UI elements with call data
            this._logInfo('Call display updated', callData);
        },

        /**
         * Update call status
         */
        _updateCallStatus: function (status) {
            this._logInfo('Call status updated', status);
        },

        /**
         * Show call notification
         */
        _showCallNotification: function (callData) {
            MessageBox.show(
                `Incoming call from ${callData.phoneNumber}`,
                {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "Incoming Call",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: (action) => {
                        if (action === MessageBox.Action.OK) {
                            this.acceptCall();
                        } else {
                            this.declineCall();
                        }
                    }
                }
            );
        },

        /**
         * Show success message
         */
        _showSuccessMessage: function (message) {
            MessageToast.show(message);
        },

        /**
         * Show error message
         */
        _showErrorMessage: function (message) {
            MessageBox.error(message);
        },

        /**
         * Show info message
         */
        _showInfoMessage: function (message) {
            MessageToast.show(message);
        },

        /**
         * Log info message
         */
        _logInfo: function (message, data) {
            console.log(`ℹ️ [SocketView] ${message}`, data || '');
        },

        /**
         * Log warning message
         */
        _logWarning: function (message, data) {
            console.warn(`⚠️ [SocketView] ${message}`, data || '');
        },

        /**
         * Log error message
         */
        _logError: function (message, error) {
            console.error(`❌ [SocketView] ${message}`, error);
        },

        /**
         * Log controller initialized
         */
        _logControllerInitialized: function () {
            this._logInfo('SocketView controller initialized');
        },

        /**
         * Called when the view is destroyed
         */
        onExit: function () {
            if (this.socket) {
                this.socket.disconnect();
                this._logInfo('Socket connection closed');
            }
        }
    });
}); 