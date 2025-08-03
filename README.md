# Agent Buddy - SAP C4C CTI Integration

Een embedded widget voor SAP Cloud for Customer (C4C) die real-time call handling en customer identification ondersteunt.

## 🚀 Live Demo

**Agent Buddy Widget:** https://glowing-frangollo-44ac94.netlify.app

## 📁 Project Structuur

### Core Files
- `agent-buddy.html` - Main Agent Buddy widget interface
- `app-new.js` - Main application logic
- `cti-new.js` - CTI and SAP integration logic
- `socket-new.js` - Socket.io client implementation
- `config.js` - Environment configuration

### SAP Integration
- `sap-c4c-integration.js` - **Officiële SAP C4C integratie** (gebaseerd op SAP voorbeeld)
- `sap-service-cloud-integration.js` - SAP Service Cloud communicatie
- `postmessage-integration.js` - PostMessage API voor iframe communicatie

### SAP UI5 Integration
- `SocketView.controller.js` - SAP UI5 controller voor native integratie
- `SocketView.view.xml` - SAP UI5 view definitie
- `manifest.json` - SAP UI5 application descriptor

### Server
- `socketio-server.js` - Socket.io server voor Render.com deployment
- `package.json` - Node.js dependencies

### Documentation
- `SAP_C4C_INTEGRATION.md` - **Complete C4C integratie documentatie**
- `SAP_UI5_INTEGRATION.md` - SAP UI5 integratie guide
- `NETLIFY_ENVIRONMENT_SETUP.md` - Netlify deployment guide
- `ENVIRONMENT_VARIABLES.md` - Environment variables guide
- `RENDER_DEPLOYMENT.md` - Render.com server deployment

### Configuration
- `netlify.toml` - Netlify deployment configuratie
- `index.html` - Redirect naar agent-buddy.html

## 🏗️ Architectuur

```
Agent Buddy Widget (Netlify)
    ↓ Socket.io
Socket.io Server (Render.com)
    ↓ PostMessage
SAP C4C Parent Window
    ↓ Event Bus
SAP C4C UI Components
```

## 🔧 Features

### ✅ **Real-time Call Handling**
- Incoming call notifications
- Call accept/decline functionality
- Call status management
- Button reset functionality

### ✅ **SAP C4C Integration**
- **Officiële SAP C4C integratie** gebaseerd op SAP voorbeeld
- PostMessage API voor iframe communicatie
- JSON payload format
- Bidirectional messaging

### ✅ **Customer Identification**
- Phone number lookup
- Customer data display
- SAP Service Cloud integration
- Customer history loading

### ✅ **SAP UI5 Integration**
- Native SAP UI5 controller
- SAP Fiori 3 styling
- Event Bus integration
- Customer screen updates

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

### 3. SAP C4C Integration
```html
<!-- Add to SAP C4C application -->
<iframe id="agent-buddy-frame" 
        src="https://glowing-frangollo-44ac94.netlify.app/agent-buddy.html"
        width="100%" height="600px">
</iframe>
```

## 📋 Call Flow

### 1. Incoming Call
```
WebSocket → Agent Buddy → NOTIFY → SAP C4C
↓
SAP C4C: Update UI, Show notification
```

### 2. Call Accepted
```
Agent Buddy → ACCEPT → SAP C4C
↓
SAP C4C: Load customer, Show customer screen
```

### 3. Call Declined
```
Agent Buddy → DECLINE → SAP C4C
↓
SAP C4C: Update status, Show decline notification
```

## 🔗 Integrations

### **SAP C4C (Cloud for Customer)**
- Officiële SAP C4C CTI integratie
- PostMessage API communicatie
- JSON payload format
- Event-driven architecture

### **SAP Service Cloud**
- Direct HTTP API calls
- Basic Authentication
- Customer data integration
- Call logging

### **SAP UI5**
- Native SAP UI5 controller
- SAP Fiori 3 design system
- Event Bus integration
- Customer screen management

## 📚 Documentation

- **[SAP C4C Integration](SAP_C4C_INTEGRATION.md)** - Complete C4C integratie guide
- **[SAP UI5 Integration](SAP_UI5_INTEGRATION.md)** - UI5 integratie documentatie
- **[Environment Setup](ENVIRONMENT_VARIABLES.md)** - Environment variables configuratie
- **[Netlify Deployment](NETLIFY_ENVIRONMENT_SETUP.md)** - Frontend deployment guide
- **[Render Deployment](RENDER_DEPLOYMENT.md)** - Backend deployment guide

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

# Open http://localhost:3000/agent-buddy.html
```

## 🎯 Key Features

### **Agent Buddy Widget**
- Real-time call notifications
- Accept/decline functionality
- Customer identification
- SAP Fiori 3 styling
- Socket.io integration

### **SAP C4C Integration**
- Officiële SAP integratie patterns
- Singleton pattern implementation
- JSON/XML payload support
- Error handling en validation

### **Production Deployment**
- Netlify frontend hosting
- Render.com backend hosting
- Environment variable management
- Comprehensive logging

## 📞 Support

Voor vragen over de SAP C4C integratie, zie de [SAP C4C Integration Guide](SAP_C4C_INTEGRATION.md).

---

**Agent Buddy** - SAP C4C CTI Integration Widget 🚀


