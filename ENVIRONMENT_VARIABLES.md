# Environment Variables Guide

## 🔧 Environment Variables Configuratie

De Agent Buddy applicatie gebruikt environment variabelen voor configuratie. Deze kunnen worden ingesteld in Netlify of via de config.js file.

### 📋 Beschikbare Environment Variables

#### SAP Service Cloud (Basic Auth)
```bash
SAP_ENDPOINT=https://my1000354.de1.test.crm.cloud.sap/
SAP_USERNAME=LEEMREIA
SAP_PASSWORD=qwewero2u3i4oyfug2E!S_3groufgo2rgur32
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
# SAP Configuration (Basic Auth)
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap/api/calls
SAP_USERNAME=your-sap-username
SAP_PASSWORD=your-sap-password

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
SAP_USERNAME=your-sap-username
SAP_PASSWORD=your-sap-password
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