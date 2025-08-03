# 🤖 Agent Buddy - Netlify Deployment Guide

## 🚀 Deployment naar Netlify

### Stap 1: Bestanden Voorbereiden

Zorg ervoor dat je deze bestanden hebt in je repository:

```
embedded-cti-deploy/
├── agent-buddy.html      # Hoofdbestand voor Agent Buddy
├── app.js               # Main application logic
├── cti.js               # CTI module
├── socket.js            # WebSocket module
├── netlify.toml         # Netlify configuratie
└── README.md            # Project documentatie
```

### Stap 2: Netlify Configuratie Aanpassen

Update je `netlify.toml` om Agent Buddy als hoofdbestand te gebruiken:

```toml
[build]
  publish = "."
  command = "echo 'Agent Buddy - Static site - no build required'"

[[redirects]]
  from = "/"
  to = "/agent-buddy.html"
  status = 200

[[redirects]]
  from = "/agent-buddy"
  to = "/agent-buddy.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/agent-buddy.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "ALLOWALL"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.html"
  [headers.values]
    Content-Type = "text/html; charset=utf-8"

[[headers]]
  for = "*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"

[[headers]]
  for = "*.css"
  [headers.values]
    Content-Type = "text/css; charset=utf-8"
```

### Stap 3: WebSocket Server Configuratie

Voor productie moet je de WebSocket server ook deployen. Opties:

#### Optie A: Heroku (Aanbevolen)
```bash
# Maak Heroku app
heroku create your-agent-buddy-websocket

# Deploy WebSocket server
git subtree push --prefix websocket-server heroku main

# Update Agent Buddy met Heroku URL
```

#### Optie B: Railway
```bash
# Deploy naar Railway
railway login
railway init
railway up
```

#### Optie C: Render
```bash
# Deploy naar Render
# Maak nieuwe Web Service
# Upload websocket-server.js
```

### Stap 4: Agent Buddy WebSocket URL Aanpassen

Update `socket.js` met je productie WebSocket URL:

```javascript
// Voor lokale ontwikkeling
socket = new WebSocket('ws://localhost:3001');

// Voor productie (vervang met je URL)
socket = new WebSocket('wss://your-websocket-server.herokuapp.com');
```

### Stap 5: Netlify Deployment

#### Via Git (Aanbevolen)
```bash
# Commit alle bestanden
git add .
git commit -m "Add Agent Buddy CTI component"
git push origin main

# Netlify detecteert automatisch de wijzigingen
```

#### Via Netlify Dashboard
1. Ga naar je Netlify dashboard
2. Selecteer je site
3. Ga naar "Deploys" tab
4. Klik "Trigger deploy" → "Deploy site"

### Stap 6: Environment Variables

Voeg deze environment variables toe in Netlify:

```
WEBSOCKET_URL=wss://your-websocket-server.herokuapp.com
SAP_ENDPOINT=https://your-sap-instance.service.cloud.sap
```

### Stap 7: Test Deployment

Na deployment:

1. **Ga naar je Netlify URL**: `https://your-site.netlify.app`
2. **Test WebSocket**: Check of verbinding werkt
3. **Test SAP integratie**: Simuleer incoming calls
4. **Test responsive design**: Op verschillende devices

## 🔧 Troubleshooting

### WebSocket Verbinding Fails
```javascript
// Check console voor errors
// Zorg dat WebSocket server draait
// Controleer CORS settings
```

### SAP Integratie Werkt Niet
```javascript
// Check of je in SAP Service Cloud environment bent
// Controleer postMessage communicatie
// Verify payload format
```

### Netlify Build Fails
```bash
# Check netlify.toml syntax
# Verify alle bestanden aanwezig zijn
# Check build logs in Netlify dashboard
```

## 📊 Monitoring

### Netlify Analytics
- Ga naar "Analytics" tab in Netlify dashboard
- Monitor page views en performance
- Check error rates

### WebSocket Monitoring
```javascript
// Voeg logging toe voor productie
console.log('WebSocket status:', socket.readyState);
console.log('SAP integration:', sapServiceCloud ? 'active' : 'inactive');
```

## 🚀 Production Checklist

- [ ] WebSocket server gedeployed
- [ ] Agent Buddy bestanden gecommit
- [ ] Netlify configuratie geupdate
- [ ] Environment variables ingesteld
- [ ] SAP payload format correct
- [ ] Responsive design getest
- [ ] Error handling geïmplementeerd
- [ ] Analytics geactiveerd

## 📞 Support

Voor vragen over deployment:
- Check Netlify logs
- Test lokaal eerst
- Verify WebSocket server status
- Controleer SAP integratie

---

**Agent Buddy is nu klaar voor productie! 🎉** 