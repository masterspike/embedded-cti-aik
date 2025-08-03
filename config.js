// Config.js - Environment Variables Configuration
// Centralized configuration for the Agent Buddy application

// Initialize CONFIG immediately to prevent "Cannot access before initialization" error
window.CONFIG = {
    // SAP Service Cloud Configuration
    SAP_ENDPOINT: 'https://my1000354.de1.test.crm.cloud.sap',
    SAP_USERNAME: 'LEEMREIA',

    SAP_API_VERSION: 'v1',
    
    // Socket.io Configuration
    SOCKET_URL: 'https://agent-buddy-socketio.onrender.com',
    SOCKET_TIMEOUT: 30000,
    
    // Application Configuration
    APP_NAME: 'Agent Buddy',
    APP_VERSION: '1.0.0',
    DEBUG_MODE: false,
    
    // Default Phone Number
    DEFAULT_PHONE: '+31651616126',
    
    // Logging Configuration
    LOG_LEVEL: 'info'
};

// Ensure CONFIG is always available
if (!window.CONFIG) {
    console.log('⚠️ CONFIG was not initialized, creating default config');
    window.CONFIG = {
        SAP_ENDPOINT: 'https://my1000354.de1.test.crm.cloud.sap',
        SAP_USERNAME: 'LEEMREIA',

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

// Helper function to read environment variables from Netlify
function getEnvironmentVariable(key, defaultValue = '') {
    // Try to get from Netlify environment variables
    // This works if the variables are injected during build
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
        return window.__ENV__[key];
    }
    
    // Try to get from meta tags (alternative method)
    const metaTag = document.querySelector(`meta[name="env-${key}"]`);
    if (metaTag) {
        return metaTag.getAttribute('content');
    }
    
    return defaultValue;
}

// Export for global access
window.getConfig = getConfig;
window.setConfig = setConfig;
window.getEnvironmentVariable = getEnvironmentVariable;

console.log('📋 Configuration loaded:', window.CONFIG); 