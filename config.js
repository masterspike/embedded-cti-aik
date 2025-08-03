// Config.js - Environment Variables Configuration
// Centralized configuration for the Agent Buddy application

const CONFIG = {
    // SAP Service Cloud Configuration
    SAP_ENDPOINT: process.env.SAP_ENDPOINT || 'https://your-sap-instance.service.cloud.sap',
    SAP_USERNAME: process.env.SAP_USERNAME || '',
    SAP_PASSWORD: process.env.SAP_PASSWORD || '',
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

// Helper function to get config value
function getConfig(key, defaultValue = '') {
    return CONFIG[key] || defaultValue;
}

// Helper function to set config value
function setConfig(key, value) {
    CONFIG[key] = value;
    console.log(`🔧 Config updated: ${key} = ${value}`);
}

// Export for global access
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;

console.log('📋 Configuration loaded:', CONFIG); 