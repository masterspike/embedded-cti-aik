# Netlify Environment Variables Setup

## 🔧 Environment Variables Configuratie in Netlify

### 📋 Stap 1: Ga naar Netlify Dashboard

1. **Open**: [Netlify Dashboard](https://app.netlify.com)
2. **Selecteer je project**: `glowing-frangollo-44ac94`
3. **Ga naar**: `Site settings` → `Environment variables`

### 📋 Stap 2: Voeg Environment Variables Toe

Klik op `Add a variable` en voeg de volgende variabelen toe:

#### SAP Service Cloud (Basic Auth)
```bash
SAP_ENDPOINT=https://my1000354.de1.test.crm.cloud.sap/api/calls
SAP_USERNAME=LEEMREIA

```

#### Socket.io Configuration
```bash
SOCKET_URL=https://agent-buddy-socketio.onrender.com
```

#### Application Settings
```bash
DEFAULT_PHONE=+31651616126
DEBUG_MODE=true
```

### 📋 Stap 3: Save en Deploy

1. **Klik op**: `Save`
2. **Trigger een nieuwe deploy**: Ga naar `Deploys` tab
3. **Klik op**: `Trigger deploy` → `Deploy site`

### 🔍 Verificatie

Na de deploy, open de applicatie en controleer:

1. **Browser Console**: Geen "SAP endpoint niet geconfigureerd" errors
2. **Test SAP Connection**: Klik op "Test Verbinding" knop
3. **Simulate Call**: Test een call simulatie

### 📊 Environment Variables Overzicht

| Variable | Value | Purpose |
|----------|-------|---------|
| `SAP_ENDPOINT` | `https://my1000354.de1.test.crm.cloud.sap/api/calls` | SAP Service Cloud API endpoint |
| `SAP_USERNAME` | `LEEMREIA` | SAP Basic Auth username |

| `SOCKET_URL` | `https://agent-buddy-socketio.onrender.com` | Socket.io server URL |
| `DEFAULT_PHONE` | `+31651616126` | Default phone number for testing |
| `DEBUG_MODE` | `true` | Enable debug logging |

### ✅ Voordelen van Environment Variables

- **Veiligheid**: Credentials niet in code
- **Flexibiliteit**: Makkelijk te wijzigen zonder code changes
- **Best Practices**: Volgt security guidelines
- **Schaalbaarheid**: Verschillende configuraties per environment 