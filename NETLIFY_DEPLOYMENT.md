# 🚀 Netlify Deployment Guide

## Quick Deployment Steps

### Option 1: Drag & Drop (Easiest)

1. **Go to [Netlify.com](https://netlify.com)**
2. **Sign up/Login** (you can use GitHub)
3. **Drag the `index-netlify.html` file** to the Netlify dashboard
4. **Rename it to `index.html`** in the Netlify file manager
5. **Your site will be live instantly!**

### Option 2: Git Repository

1. **Create a new GitHub repository**
2. **Upload these files:**
   - `index-netlify.html` → rename to `index.html`
   - `netlify.toml`
   - `README.md`
3. **Connect to Netlify:**
   - Go to Netlify → "New site from Git"
   - Choose your repository
   - Deploy!

## 🎯 What You Get

**✅ Production-Ready Features:**
- **HTTPS URL** - Compatible with SAP Service Cloud v2
- **Global CDN** - Fast loading worldwide
- **Automatic Deployments** - Updates when you push to Git
- **Custom Domain** - Optional (e.g., `your-widget.com`)

**✅ Widget Features:**
- **📞 Call Simulation** - Test incoming/outbound calls
- **💬 Real-time Chat** - Agent chat interface
- **📊 Data Export** - CSV export functionality
- **🔌 WebSocket Ready** - Production WebSocket support
- **📱 Mobile Responsive** - Works on all devices

## 🔧 Configuration

### SAP Service Cloud v2 Setup

**Widget Settings:**
- **Provider Type**: `External Provider`
- **Provider URL**: `https://your-netlify-app.netlify.app`
- **Widget Name**: `Embedded CTI - AIK`
- **Description**: `Modern Customer Service Integration Platform`
- **Enabled**: `Yes`

### WebSocket Server (Optional)

For full WebSocket functionality, deploy a WebSocket server to:
- **Heroku** (free tier available)
- **Railway** (free tier available)
- **Render** (free tier available)

Then update the WebSocket URLs in `index-netlify.html`:

```javascript
const wsUrls = [
    'wss://your-websocket-server.herokuapp.com',
    'wss://your-websocket-server.railway.app',
    'wss://your-websocket-server.render.com'
];
```

## 📱 Testing

1. **Visit your Netlify URL**
2. **Test Call Simulation** - Should work immediately
3. **Test WebSocket** - Will work in "Local Mode" without server
4. **Test SAP Integration** - Ready for SAP Service Cloud v2

## 🔒 Security

**✅ HTTPS Required** - Netlify provides SSL automatically
**✅ CORS Configured** - Cross-origin compatibility
**✅ SAP Integration** - Secure postMessage communication

## 🚀 Performance

**✅ Lightning Fast** - Static HTML, no server-side processing
**✅ Global CDN** - Served from edge locations worldwide
**✅ Mobile Optimized** - Responsive design for all devices

## 📞 Support

**For Technical Issues:**
1. Check browser console for errors
2. Verify HTTPS URL is accessible
3. Test with SAP Service Cloud integration
4. Review Netlify deployment logs

**Ready for Production!** 🎉 