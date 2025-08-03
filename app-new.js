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
    try {
        let phoneNumber = '+31 651616126'; // Default fallback
        
        // Try to get from config
        if (window.getConfig && typeof window.getConfig === 'function') {
            try {
                const configPhone = getConfig('DEFAULT_PHONE');
                if (configPhone) {
                    phoneNumber = configPhone;
                }
            } catch (error) {
                console.log('⚠️ Error getting DEFAULT_PHONE from config:', error.message);
            }
        }
        
        const testCall = {
            phoneNumber: phoneNumber,
            callId: 'CALL-' + Math.floor(Math.random() * 10000),
            timestamp: new Date().toISOString()
        };
        
        handleIncomingCall(testCall);
    } catch (error) {
        console.error('❌ Error in simulateIncomingCall:', error);
        addLog('❌ Fout bij call simulatie: ' + error.message);
    }
}

// Export functions for global access
window.initializeApplication = initializeApplication;
window.addLog = addLog;
window.showToast = showToast;
window.simulateIncomingCall = simulateIncomingCall; 