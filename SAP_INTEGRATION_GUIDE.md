# SAP Service Cloud Integration Guide

## Overview

This guide explains how to integrate the **Embedded CTI - AIK** widget with SAP Service Cloud as a CTI embedded widget.

## Prerequisites

- SAP Service Cloud access with Live Activity Center permissions
- Node.js server running the widget
- HTTPS endpoint for production deployment

## Step 1: Deploy the Widget

### Development (Local)
```bash
# Start the widget server
npm start
# Widget will be available at http://localhost:3000
```

### Production (Recommended)
1. Deploy to a cloud service (AWS, Azure, Google Cloud)
2. Ensure HTTPS is enabled
3. Update the provider URL in SAP Service Cloud

## Step 2: Configure SAP Service Cloud

### Admin Configuration
1. Log into SAP Service Cloud as an administrator
2. Navigate to **Administration** → **Live Activity Center** → **Widget Configuration**
3. Create a new widget configuration:

**Widget Settings:**
- **Provider Type**: `External Provider`
- **Provider URL**: `https://your-domain.com` (production) or `http://localhost:3000` (development)
- **Widget Name**: `Embedded CTI - AIK`
- **Description**: `Modern Customer Service Integration Platform`
- **Enabled**: `Yes`

### User Assignment
1. Go to **Administration** → **User Management** → **Users**
2. Select the user who will use the widget
3. Assign the **Live Activity Center** work center
4. Ensure the widget is visible in their role

## Step 3: Widget Integration Features

### Automatic Integration
The widget automatically detects when it's running in SAP Service Cloud and enables:

- **Activity Data Sync**: Receives customer and activity information
- **Call Integration**: Handles incoming and outgoing calls
- **Chat Integration**: Manages real-time chat messages
- **Data Export**: Exports call data to SAP Service Cloud

### Message Types

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

## Step 4: Testing the Integration

### Test Call Simulation
1. Open the widget in SAP Service Cloud
2. Enter a phone number and customer name
3. Click "Simulate Call"
4. Check the Live Activity Center for the new activity

### Test Socket Connection
1. Copy the Socket ID from the widget
2. Use the external simulator to send test messages
3. Verify messages appear in the widget
4. Check SAP Service Cloud for activity updates

### Test Data Export
1. Fill out call information in the widget
2. Click "Export Details"
3. Verify CSV file contains correct data
4. Check SAP Service Cloud for exported data

## Step 5: Production Deployment

### Security Considerations
1. **HTTPS Required**: Use SSL/TLS in production
2. **CORS Configuration**: Allow SAP Service Cloud domains
3. **Authentication**: Implement proper authentication if needed
4. **Rate Limiting**: Prevent abuse of the API endpoints

### Performance Optimization
1. **CDN**: Use a content delivery network
2. **Caching**: Implement proper caching headers
3. **Compression**: Enable gzip compression
4. **Monitoring**: Set up application monitoring

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-sap-instance.com
```

## Step 6: Troubleshooting

### Common Issues

**Widget Not Loading:**
- Check provider URL is correct
- Verify HTTPS in production
- Check browser console for errors

**No Data Sync:**
- Ensure user has Live Activity Center permissions
- Check network connectivity
- Verify message format

**Socket Connection Issues:**
- Check firewall settings
- Verify Socket.io configuration
- Test with external simulator

### Debug Mode
Enable debug logging by adding to the widget:
```javascript
// Add to widget for debugging
window.debugMode = true;
console.log('Widget loaded in SAP Service Cloud');
```

## Step 7: Customization

### Branding
Update the widget appearance to match your organization:
1. Modify CSS in `public/stylesheets/style.css`
2. Update colors, fonts, and layout
3. Add your company logo

### Functionality
Extend the widget with additional features:
1. Add new API endpoints in `routes/cti.js`
2. Implement custom message handlers
3. Add new UI components

### Integration Points
The widget supports these integration points:
- **Call Management**: Incoming/outgoing calls
- **Chat Integration**: Real-time messaging
- **Data Export**: CSV and JSON formats
- **Activity Sync**: Real-time updates

## Support

For technical support:
1. Check the browser console for errors
2. Verify network connectivity
3. Test with the external simulator
4. Review the integration logs

## Version History

- **v1.0.0**: Initial release with SAP Service Cloud integration
- **v1.1.0**: Added real-time chat functionality
- **v1.2.0**: Enhanced data export capabilities 