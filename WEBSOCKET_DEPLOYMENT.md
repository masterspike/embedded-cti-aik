# 🌐 WebSocket Server Deployment - Railway

## 🚀 Stap-voor-stap Railway Deployment

### Stap 1: Railway CLI Installeren

```bash
# Installeer Railway CLI
npm install -g @railway/cli

# Login met je GitHub account
railway login
```

### Stap 2: Project Voorbereiden

```bash
# Ga naar websocket-server directory
cd websocket-server

# Test lokaal
npm install
npm start
```

### Stap 3: Railway Project Aanmaken

```bash
# Initialiseer Railway project
railway init

# Kies "Create new project"
# Geef je project een naam: "agent-buddy-websocket"
```

### Stap 4: Deploy naar Railway

```bash
# Deploy je WebSocket server
railway up

# Railway geeft je een URL zoals:
# https://agent-buddy-websocket-production.up.railway.app
```

### Stap 5: Environment Variables Instellen

In Railway dashboard:

```
NODE_ENV=production
PORT=3001
```

### Stap 6: WebSocket URL Ophalen

```bash
# Krijg je Railway URL
railway status

# Of check in Railway dashboard
# URL: https://agent-buddy-websocket-production.up.railway.app
```

### Stap 7: Agent Buddy Updaten

Update `socket.js` met je Railway URL:

```javascript
// Voor productie
socket = new WebSocket('wss://agent-buddy-websocket-production.up.railway.app');

// Of gebruik environment variable
const wsUrl = process.env.WEBSOCKET_URL || 'wss://agent-buddy-websocket-production.up.railway.app';
socket = new WebSocket(wsUrl);
```

## 🔧 Railway Commands

```bash
# Status checken
railway status

# Logs bekijken
railway logs

# Environment variables
railway variables

# Redeploy
railway up

# Stop service
railway down
```

## 📊 Monitoring

### Railway Dashboard
- Ga naar [railway.app](https://railway.app)
- Selecteer je project
- Bekijk logs en metrics

### Health Check
```bash
# Test je WebSocket server
curl https://agent-buddy-websocket-production.up.railway.app
# Zou moeten returnen: "WebSocket Server Running"
```

## 🚨 Troubleshooting

### Deployment Fails
```bash
# Check logs
railway logs

# Verify package.json
cat package.json

# Test lokaal eerst
npm start
```

### WebSocket Verbinding Fails
```javascript
// Check of URL correct is
console.log('WebSocket URL:', wsUrl);

// Test verbinding
const testSocket = new WebSocket(wsUrl);
testSocket.onopen = () => console.log('✅ Connected');
testSocket.onerror = (err) => console.log('❌ Error:', err);
```

### CORS Issues
```javascript
// Railway heeft automatisch CORS support
// Geen extra configuratie nodig
```

## 💰 Kosten

- **Railway Free Tier**: $5 credit per maand
- **WebSocket Server**: ~$1-2 per maand
- **Agent Buddy**: Gratis (Netlify)

## 🔄 Auto-Deploy

Railway detecteert automatisch wijzigingen:

```bash
# Commit wijzigingen
git add .
git commit -m "Update WebSocket server"
git push origin main

# Railway deployt automatisch
```

## 📱 Test je Deployment

1. **Deploy WebSocket server** naar Railway
2. **Update Agent Buddy** met nieuwe URL
3. **Deploy Agent Buddy** naar Netlify
4. **Test volledige flow**:
   - Incoming call simulatie
   - Accept/decline functionaliteit
   - SAP integratie

## 🎯 Production Checklist

- [ ] Railway project aangemaakt
- [ ] WebSocket server gedeployed
- [ ] Environment variables ingesteld
- [ ] Agent Buddy geupdate met nieuwe URL
- [ ] Netlify deployment getest
- [ ] Volledige flow getest
- [ ] Monitoring geactiveerd

---

**Je WebSocket server is nu klaar voor productie! 🚀** 