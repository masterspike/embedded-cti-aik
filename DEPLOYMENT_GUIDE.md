# 🚀 Deployment Guide for SAP Service Cloud v2

## ⚠️ **Important: SAP Service Cloud v2 Requirements**

SAP Service Cloud v2 **requires**:
- ✅ **HTTPS URL** (not HTTP)
- ✅ **Publicly accessible domain** (not localhost)
- ✅ **Valid SSL certificate**
- ✅ **CORS properly configured**

## 🎯 **Quick Solutions**

### **Option 1: ngrok (Development/Testing)**
```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm start

# In another terminal, create HTTPS tunnel
ngrok http 3000
```

**Result**: You'll get a URL like `https://abc123.ngrok.io`
**Use this URL in SAP Service Cloud configuration**

### **Option 2: Vercel (Recommended for Production)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and use the provided HTTPS URL
```

### **Option 3: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Follow prompts and use the provided HTTPS URL
```

## 📋 **SAP Service Cloud Configuration**

### **Widget Configuration in SAP Service Cloud v2:**

1. **Log into SAP Service Cloud as Administrator**
2. **Navigate to**: Administration → Live Activity Center → Widget Configuration
3. **Create New Widget**:
   - **Provider Type**: `External Provider`
   - **Provider URL**: `https://your-deployed-domain.com` (NOT localhost)
   - **Widget Name**: `Embedded CTI - AIK`
   - **Description**: `Modern Customer Service Integration Platform`
   - **Enabled**: `Yes`

### **User Assignment**:
1. **Go to**: Administration → User Management → Users
2. **Select user** who will use the widget
3. **Assign**: Live Activity Center work center
4. **Ensure widget is visible** in user role

## 🔧 **Deployment Options Comparison**

| Option | Cost | Setup Time | HTTPS | Production Ready |
|--------|------|------------|-------|------------------|
| **ngrok** | Free | 2 minutes | ✅ | ❌ (Development only) |
| **Vercel** | Free tier | 5 minutes | ✅ | ✅ |
| **Netlify** | Free tier | 5 minutes | ✅ | ✅ |
| **Heroku** | $7/month | 10 minutes | ✅ | ✅ |
| **AWS/Azure** | Pay per use | 30 minutes | ✅ | ✅ |

## 🚀 **Recommended Deployment Steps**

### **For Testing (ngrok)**:
```bash
# 1. Start your app
npm start

# 2. In new terminal, create HTTPS tunnel
ngrok http 3000

# 3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# 4. Use this URL in SAP Service Cloud configuration
```

### **For Production (Vercel)**:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow the prompts:
#    - Set up and deploy? Y
#    - Which scope? [your-account]
#    - Link to existing project? N
#    - What's your project's name? embedded-cti-aik
#    - In which directory is your code located? ./
#    - Want to override the settings? N

# 4. Copy the HTTPS URL (e.g., https://embedded-cti-aik.vercel.app)
# 5. Use this URL in SAP Service Cloud configuration
```

## 🔒 **Security Considerations**

### **CORS Configuration**:
The widget is already configured to accept requests from SAP Service Cloud domains.

### **HTTPS Requirements**:
- ✅ All production deployments include HTTPS
- ✅ SSL certificates are automatically managed
- ✅ Secure communication with SAP Service Cloud

### **Authentication** (Optional):
If you need additional security, you can add authentication:
```javascript
// In your widget
if (message.origin !== 'https://your-sap-instance.com') {
    return; // Reject unauthorized messages
}
```

## 🧪 **Testing Your Deployment**

### **1. Test the Widget**:
- Visit your deployed HTTPS URL
- Verify all functionality works
- Test SAP integration features

### **2. Test SAP Integration**:
- Configure the widget in SAP Service Cloud
- Test call simulation
- Verify data synchronization

### **3. Test with Real Data**:
- Create test activities in SAP Service Cloud
- Verify widget receives and displays data correctly
- Test export functionality

## 📞 **Troubleshooting**

### **Common Issues**:

**Widget Not Loading in SAP Service Cloud**:
- ✅ Verify HTTPS URL is correct
- ✅ Check CORS configuration
- ✅ Ensure widget is enabled for user role

**No Data Sync**:
- ✅ Verify user has Live Activity Center permissions
- ✅ Check browser console for errors
- ✅ Test with the test page (`/test-sap.html`)

**HTTPS Certificate Issues**:
- ✅ All recommended platforms provide valid SSL certificates
- ✅ No additional configuration needed

## 🎯 **Next Steps**

1. **Choose your deployment option** (Vercel recommended for production)
2. **Deploy using the provided commands**
3. **Copy the HTTPS URL**
4. **Configure in SAP Service Cloud v2**
5. **Test the integration**
6. **Go live with your customer service team**

## 📞 **Support**

If you encounter issues:
1. Check the browser console for errors
2. Verify the HTTPS URL is accessible
3. Test with the provided test page
4. Review the deployment logs

---

**Remember**: Never use `localhost:3000` in SAP Service Cloud v2 configuration. Always use a publicly accessible HTTPS URL. 