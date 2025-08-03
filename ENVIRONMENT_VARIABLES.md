# Environment Variables Guide

## 🔧 Environment Variables Configuratie

De Agent Buddy applicatie gebruikt environment variabelen voor configuratie. Deze kunnen worden ingesteld in Netlify of via de config.js file.

### 📋 Beschikbare Environment Variables

#### SAP Service Cloud
```bash
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap/api/calls
SAP_API_KEY=your-sap-api-key-here
SAP_API_VERSION=v1
```

#### Socket.io Configuration
```bash
SOCKET_URL=https://agent-buddy-socketio.onrender.com
SOCKET_TIMEOUT=30000
```

#### Application Settings
```bash
APP_NAME=Agent Buddy
APP_VERSION=1.0.0
DEBUG_MODE=true
DEFAULT_PHONE=+31651616126
LOG_LEVEL=info
```

### 🚀 Netlify Environment Variables

1. **Ga naar Netlify Dashboard**
2. **Selecteer je project**
3. **Ga naar Settings → Environment Variables**
4. **Voeg de variabelen toe**:

```bash
# SAP Configuration
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap/api/calls
SAP_API_KEY=your-sap-api-key-here

# Socket.io Configuration  
SOCKET_URL=https://agent-buddy-socketio.onrender.com

# Application Configuration
DEFAULT_PHONE=+31651616126
DEBUG_MODE=true
```

### 🔧 Lokale Development

Voor lokale development, voeg toe aan je `.env` file:

```bash
# .env file
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap/api/calls
SAP_API_KEY=your-sap-api-key-here
SOCKET_URL=http://localhost:3001
DEFAULT_PHONE=+31651616126
DEBUG_MODE=true
```

### 📊 Environment Variables Prioriteit

1. **Environment Variables** (hoogste prioriteit)
2. **UI Input Fields** (fallback)
3. **Default Values** (laagste prioriteit)

### 🔍 Debug Environment Variables

Open browser console en type:
```javascript
console.log('Config:', CONFIG);
console.log('SAP Endpoint:', getConfig('SAP_ENDPOINT'));
console.log('Socket URL:', getConfig('SOCKET_URL'));
```

### ✅ Voordelen van Environment Variables

- **Veiligheid**: API keys niet in code
- **Flexibiliteit**: Verschillende configuraties per environment
- **Schaalbaarheid**: Makkelijk te beheren
- **Best Practices**: Volgt security guidelines 