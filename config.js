// Config.js - Environment Variables Configuration
// Centralized configuration for the Agent Buddy application

// Initialize CONFIG immediately to prevent "Cannot access before initialization" error
window.CONFIG = {
    // SAP Service Cloud Configuration
    SAP_ENDPOINT: process.env.SAP_ENDPOINT || 'https://my1000354.de1.test.crm.cloud.sap' ,
    SAP_USERNAME: process.env.SAP_USERNAME || 'LEEMREIA',

    SAP_API_VERSION: process.env.SAP_API_VERSION || 'v1',
    
    // Socket.io Configuration
    SOCKET_URL: process.env.SOCKET_URL || 'https://agent-buddy-socketio.onrender.com',
    SOCKET_TIMEOUT: process.env.SOCKET_TIMEOUT || 30000,
    
    // Application Configuration
    APP_NAME: process.env.APP_NAME || 'Agent Buddy',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    DEBUG_MODE: process.env.DEBUG_MODE === 'true' || false,
    
    // Default Phone Number
    DEFAULT_PHONE: process.env.DEFAULT_PHONE || '+31651616126',
    
    // Logging Configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Ensure CONFIG is always available
if (!window.CONFIG) {
    console.log('⚠️ CONFIG was not initialized, creating default config');
    window.CONFIG = {
        SAP_ENDPOINT: 'https://my1000354.de1.test.crm.cloud.sap',
        SAP_USERNAME: ' ',

        SAP_API_VERSION: 'v1',
        SOCKET_URL: 'https://agent-buddy-socketio.onrender.com',
        SOCKET_TIMEOUT: 30000,
        APP_NAME: 'Agent Buddy',
        APP_VERSION: '1.0.0',
        DEBUG_MODE: false,
        DEFAULT_PHONE: '+31651616126',
        LOG_LEVEL: 'info'
    };
}

// Helper function to get config value
function getConfig(key, defaultValue = '') {
    if (!window.CONFIG) {
        console.log('⚠️ CONFIG not available, returning default value for:', key);
        return defaultValue;
    }
    return window.CONFIG[key] || defaultValue;
}

// Helper function to set config value
function setConfig(key, value) {
    if (!window.CONFIG) {
        console.log('⚠️ CONFIG not available, cannot set:', key);
        return false;
    }
    window.CONFIG[key] = value;
    console.log(`🔧 Config updated: ${key} = ${value}`);
    return true;
}

// Export for global access
window.getConfig = getConfig;
window.setConfig = setConfig;

console.log('📋 Configuration loaded:', window.CONFIG); 