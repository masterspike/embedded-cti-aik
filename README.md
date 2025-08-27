# Agent Buddy - SAP Service Cloud Integration

Een embedded widget voor SAP Service Cloud (SSCV2) die real-time call handling en customer identification ondersteunt.

## 🚀 Live Demo

**Agent Buddy Widget:** https://glowing-frangollo-44ac94.netlify.app

## 📁 Project Structuur

```
embedded-cti-deploy/
├── src/
│   ├── core/                          # Core application files
│   │   ├── agent-buddy.html          # Main Agent Buddy widget interface
│   │   ├── app-new.js                # Main application logic
│   │   ├── cti-new.js                # CTI and SAP integration logic
│   │   ├── socket-new.js             # Socket.io client implementation
│   │   └── config.js                 # Environment configuration
│   ├── sap-integration/              # SAP integration modules
│   │   ├── sap-service-cloud-integration.js  # SAP Service Cloud communicatie
│   │   ├── sap-aik-integration.js    # SAP AIK integratie
│   │   └── postmessage-integration.js # PostMessage API voor iframe communicatie
│   ├── server/                       # Server-side code
│   │   └── socketio-server.js        # Socket.io server voor Render.com deployment
│   ├── assets/                       # Static assets
│   │   └── style.css                 # Styling
│   └── docs/                         # Documentation
│       ├── AGENT_BUDDY_SSCV2_INTEGRATION_DOCUMENTATION.md  # Complete Agent Buddy documentatie
│       └── Agent_Buddy_SSCV2_Documentation.html           # Agent Buddy HTML documentatie
├── package.json                      # Node.js dependencies
├── netlify.toml                      # Netlify deployment configuratie
├── index.html                        # Redirect naar agent-buddy.html
└── README.md                         # Project documentatie
```

## 🏗️ Architectuur

```
Agent Buddy Widget (Netlify)
    ↓ Socket.io
Socket.io Server (Render.com)
    ↓ PostMessage
SAP Service Cloud Parent Window
    ↓ Event Bus
SAP Service Cloud UI Components
```

## 🔧 Features

### ✅ **Real-time Call Handling**
- Incoming call notifications
- Call accept/decline functionality
- Call status management
- Button reset functionality

### ✅ **SAP Service Cloud Integration**
- SAP Service Cloud (SSCV2) integratie
- PostMessage API voor iframe communicatie
- JSON payload format
- Bidirectional messaging

### ✅ **Customer Identification**
- Phone number lookup
- Customer data display
- SAP Service Cloud integration
- Customer history loading

### ✅ **Production Ready**
- Netlify frontend deployment
- Render.com backend deployment
- Environment variable configuration
- Error handling en logging

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/masterspike/embedded-cti-aik.git
cd embedded-cti-deploy
```

### 2. Local Development
```bash
# Start Socket.io server
node socketio-server.js

# Open agent-buddy.html in browser
# Or use live demo: https://glowing-frangollo-44ac94.netlify.app
```

### 3. SAP Service Cloud Integration
```html
<!-- Add to SAP Service Cloud application -->
<iframe id="agent-buddy-frame" 
        src="https://glowing-frangollo-44ac94.netlify.app/src/core/agent-buddy.html"
        width="100%" height="600px">
</iframe>
```

## 📋 Call Flow

### 1. Incoming Call
```
WebSocket → Agent Buddy → NOTIFY → SAP Service Cloud
↓
SAP Service Cloud: Update UI, Show notification
```

### 2. Call Accepted
```
Agent Buddy → ACCEPT → SAP Service Cloud
↓
SAP Service Cloud: Load customer, Show customer screen
```

### 3. Call Declined
```
Agent Buddy → DECLINE → SAP Service Cloud
↓
SAP Service Cloud: Update status, Show decline notification
```

## 🔗 Integrations

### **SAP Service Cloud (SSCV2)**
- SAP Service Cloud CTI integratie
- PostMessage API communicatie
- JSON payload format
- Event-driven architecture

## 📚 Documentation

- **[Agent Buddy SSCV2 Integration](AGENT_BUDDY_SSCV2_INTEGRATION_DOCUMENTATION.md)** - Complete Agent Buddy documentatie
- **[Agent Buddy HTML Documentation](Agent_Buddy_SSCV2_Documentation.html)** - Agent Buddy HTML documentatie

## 🛠️ Development

### Environment Variables
```bash
# Netlify Environment Variables
SOCKET_URL=https://agent-buddy-socketio.onrender.com
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap/api/calls
SAP_USERNAME=your-sap-username
SAP_PASSWORD=your-sap-password
DEFAULT_PHONE=+31651616126
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
node socketio-server.js

# Open http://localhost:3000/src/core/agent-buddy.html
```

## 🎯 Key Features

### **Agent Buddy Widget**
- Real-time call notifications
- Accept/decline functionality
- Customer identification
- SAP Fiori 3 styling
- Socket.io integration

### **SAP Service Cloud Integration**
- SAP Service Cloud integratie patterns
- Singleton pattern implementation
- JSON/XML payload support
- Error handling en validation

### **Production Deployment**
- Netlify frontend hosting
- Render.com backend hosting
- Environment variable management
- Comprehensive logging

## 📞 Support

Voor vragen over de Agent Buddy integratie, zie de [Agent Buddy SSCV2 Integration Documentation](AGENT_BUDDY_SSCV2_INTEGRATION_DOCUMENTATION.md).

---

**Agent Buddy** - SAP Service Cloud CTI Integration Widget 🚀


