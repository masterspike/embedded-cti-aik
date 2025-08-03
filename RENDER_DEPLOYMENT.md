# Render.com Deployment Guide

## 🚀 Deployment naar Render.com

### Stap 1: Render.com Account
1. Ga naar [render.com](https://render.com)
2. Maak een gratis account aan
3. Verbind je GitHub account

### Stap 2: Nieuwe Web Service
1. Klik op "New +" → "Web Service"
2. Selecteer je GitHub repository: `embedded-cti-aik`
3. Geef de service een naam: `agent-buddy-socketio`

### Stap 3: Configuratie
- **Name**: `agent-buddy-socketio`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Stap 4: Environment Variables
Voeg deze environment variables toe:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render gebruikt vaak poort 10000)

### Stap 5: Deploy
1. Klik op "Create Web Service"
2. Wacht tot de deployment klaar is
3. Kopieer de URL (bijv. `https://agent-buddy-socketio.onrender.com`)

### Stap 6: Update Frontend
Update `socket-new.js` met de nieuwe Render URL:

```javascript
// Vervang deze regel:
socketUrl = window.SOCKET_URL || 'https://your-render-app.onrender.com';

// Met je echte Render URL:
socketUrl = window.SOCKET_URL || 'https://agent-buddy-socketio.onrender.com';
```

### Stap 7: Test
1. Deploy de frontend naar Netlify
2. Test de Agent Buddy applicatie
3. Controleer of Socket.io verbinding werkt

## ✅ Voordelen van Render.com
- **Betere WebSocket support** dan Railway
- **Gratis tier** beschikbaar
- **Automatische deployments** van GitHub
- **Betere proxy handling** voor Socket.io
- **SSL certificaten** automatisch

## 🔧 Troubleshooting
- Als de health check faalt, controleer de logs in Render dashboard
- Zorg dat de `PORT` environment variable correct is ingesteld
- Socket.io werkt beter op Render dan Railway voor WebSocket upgrades 