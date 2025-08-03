# 📞 Embedded CTI - AIK

**Modern Customer Service Integration Platform for SAP Service Cloud v2**

A lightweight, responsive widget that integrates seamlessly with SAP Service Cloud as a CTI embedded widget. Built with pure HTML, CSS, and JavaScript for maximum compatibility and performance.

## 🚀 **Live Demo**

Visit the live widget: **[https://yourusername.github.io/embedded-cti-aik/](https://yourusername.github.io/embedded-cti-aik/)**

## ✨ **Features**

- **📞 Call Simulation** - Test incoming and outgoing calls
- **💬 Real-time Chat** - Agent chat interface with quick actions
- **📊 Data Export** - Export call data to CSV format
- **🔌 Socket Integration** - Real-time communication capabilities
- **📱 Mobile Responsive** - Works on all devices and screen sizes
- **🎨 Modern UI** - Clean, professional design
- **🔒 SAP Integration** - Full SAP Service Cloud v2 compatibility

## 🛠 **Technology Stack**

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: Lightweight and fast
- **HTTPS Ready**: Secure for production use
- **Cross-browser**: Works in all modern browsers

## 📋 **SAP Service Cloud v2 Integration**

### **Widget Configuration:**

1. **Log into SAP Service Cloud as Administrator**
2. **Navigate to**: Administration → Live Activity Center → Widget Configuration
3. **Create New Widget**:
   - **Provider Type**: `External Provider`
   - **Provider URL**: `https://yourusername.github.io/embedded-cti-aik/`
   - **Widget Name**: `Embedded CTI - AIK`
   - **Description**: `Modern Customer Service Integration Platform`
   - **Enabled**: `Yes`

### **User Assignment:**
1. **Go to**: Administration → User Management → Users
2. **Select user** who will use the widget
3. **Assign**: Live Activity Center work center
4. **Ensure widget is visible** in user role

## 🔧 **Installation & Deployment**

### **Option 1: GitHub Pages (Recommended)**

1. **Fork this repository** or create a new one
2. **Upload the `index.html` file** to your repository
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. **Your widget will be available at**: `https://yourusername.github.io/repository-name/`

### **Option 2: Any Web Server**

1. **Upload `index.html`** to any web server with HTTPS
2. **Use the HTTPS URL** in SAP Service Cloud configuration

## 🎯 **Usage**

### **Call Simulation**
- Enter phone number and customer name
- Select call type (inbound/outbound/missed)
- Click "Simulate Call" to test integration

### **Chat Interface**
- Real-time chat with customers
- Quick action buttons for common responses
- Export chat data to SAP Service Cloud

### **Data Export**
- Export call information to CSV
- View detailed activity data
- Refresh data from SAP Service Cloud

## 🔌 **SAP Integration Features**

### **Message Types Supported:**

**From SAP Service Cloud to Widget:**
```javascript
{
    type: 'ACTIVITY_LOADED',
    activity: {
        phoneNumber: '+1234567890',
        businessPartnerId: 'BP001',
        objectId: 'OBJ001',
        // ... other activity data
    }
}
```

**From Widget to SAP Service Cloud:**
```javascript
{
    type: 'CALL_SIMULATED',
    callData: {
        phoneNumber: '+1234567890',
        callType: 'inbound',
        customerName: 'John Doe',
        timestamp: '2024-01-01T12:00:00Z'
    }
}
```

## 📱 **Mobile Compatibility**

The widget is fully responsive and works on:
- ✅ **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile devices** (iOS Safari, Android Chrome)
- ✅ **Tablets** (iPad, Android tablets)
- ✅ **Embedded iframes** (SAP Service Cloud)

## 🔒 **Security**

- ✅ **HTTPS Required** - Secure communication
- ✅ **CORS Configured** - Cross-origin compatibility
- ✅ **No External Dependencies** - Self-contained
- ✅ **SAP Message Validation** - Secure message handling

## 🚀 **Performance**

- ⚡ **Lightning Fast** - No heavy frameworks
- 📦 **Tiny Size** - Single HTML file
- 🔄 **Instant Loading** - No external resources
- 🎯 **Optimized** - Minimal JavaScript

## 📞 **Support**

For technical support:
1. Check the browser console for errors
2. Verify HTTPS URL is accessible
3. Test with SAP Service Cloud integration
4. Review the deployment logs

## 📄 **License**

MIT License - Feel free to use and modify for your needs.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Ready for SAP Service Cloud v2 Integration!** 🎉


