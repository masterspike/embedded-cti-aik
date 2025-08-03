// App.js - Agent Buddy Main Application
// Orchestrates CTI and WebSocket modules

// Global application variables
let isInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

// Initialize the complete application
function initializeApplication() {
    if (isInitialized) return;
    
    console.log('🚀 Agent Buddy applicatie initialiseren...');
    
    // Initialize WebSocket connection
    initializeWebSocket();
    
    // Initialize CTI module
    initializeCTI();
    
    // Add test button
    addTestButton();
    
    isInitialized = true;
    addLog('🚀 Agent Buddy geïnitialiseerd');
}

// Add log entry
function addLog(message) {
    const logArea = document.getElementById('activityLog');
    if (logArea) {
        const timestamp = new Date().toLocaleTimeString();
        logArea.innerHTML += `\n[${timestamp}] ${message}`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Add test button to page
function addTestButton() {
    setTimeout(() => {
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Simuleer Incoming Call';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000;
        `;
        testButton.onclick = simulateIncomingCall;
        document.body.appendChild(testButton);
    }, 1000);
}

// Simulate incoming call for testing
function simulateIncomingCall() {
    const testCall = {
        phoneNumber: '+31 6 51616126',
        callId: 'CALL-' + Math.floor(Math.random() * 10000),
        timestamp: new Date().toISOString()
    };
    
    handleIncomingCall(testCall);
}

// Export functions for global access
window.initializeApplication = initializeApplication;
window.addLog = addLog;
window.showToast = showToast;
window.simulateIncomingCall = simulateIncomingCall; 