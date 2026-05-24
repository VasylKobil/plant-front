# Plant Monitor - Setup Guide

## 🌿 About

Plant Monitor is a responsive web app that displays real-time sensor data from your IoT plant monitoring devices. It works seamlessly on both desktop and mobile browsers.

## ✨ Features

- **Real-time Status**: Current temperature, soil moisture, battery level, and WiFi signal
- **Visual Metrics**: Color-coded indicators for quick health assessment
- **Historical Trends**: 24-hour history charts showing temperature and moisture trends
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Auto-refresh**: Data updates every 5 minutes automatically
- **Manual Refresh**: Refresh button for immediate data updates

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Backend API running and accessible

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. **Configure API URL** in `.env`:

   ```
   REACT_APP_API_BASE=http://localhost:8000
   ```

   Replace with your actual API server URL.

4. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

### Production Build

Build the app for production:

```bash
npm run build
```

Serve the `build` folder using any static web server.

## 📡 API Endpoints Expected

The app expects the following API endpoints:

- `GET /api/device/:device_id/latest` - Latest sensor reading
- `GET /api/device/:device_id?limit=24` - Last N readings (default device is "balcony")

### Expected Response Format

```json
{
  "id": 105,
  "device_id": "balcony",
  "soil_raw": 46481,
  "temperature": 23.69,
  "created_at": "2026-05-24T12:31:42.563366+00:00",
  "battery_idle": 3.73,
  "battery_load": 3.68,
  "wifi_ms": 9977,
  "cycle_ms": 11196,
  "sleep_minutes": 60
}
```

## 📱 Mobile Optimization

The app is fully responsive with optimized layouts for:

- **Mobile (< 480px)**: Single column, touch-friendly buttons
- **Tablet (480px - 768px)**: 2-column grid
- **Desktop (> 768px)**: Full responsive grid layout

### Mobile Features

- Touch-friendly spacing
- Optimized font sizes
- Safe area support for notched devices
- Portrait & landscape support

## 🎨 Customization

### Colors & Theme

Edit the color palette in `App.css`:

- Primary Green: `#2ecc71`
- Accent colors for temperature ranges and moisture levels
- Background gradients

### Units & Calculations

The app includes converters for:

- **Soil Moisture**: Normalized from raw sensor values (30000-50000 → 0-100%)
- **Battery Level**: Calculated from idle/load voltages (3V-4.2V range)

Adjust the min/max values in `App.js` if your sensors have different ranges.

## 🔧 Environment Variables

```
REACT_APP_API_BASE  - Backend API base URL (default: http://localhost:8000)
```

## 📊 Data Interpretation

- **Temperature**: In Celsius
- **Soil Moisture**: 0-100% (calculated from raw sensor value)
  - < 30%: Too dry (red)
  - 30-70%: Optimal (cyan)
  - > 70%: Too wet (blue)
- **Battery**: 0-100% (calculated from voltage)
- **WiFi/Cycle**: Time in milliseconds

## 🐛 Troubleshooting

### "Error: Failed to fetch data"

- Check if the API URL is correct in `.env`
- Ensure your backend server is running
- Check CORS settings if API is on a different domain

### Data not updating

- Check browser console for errors
- Verify the device_id matches your backend data
- Ensure your API returns data in the expected format

### Mobile styling issues

- Clear browser cache
- Check viewport meta tag in `public/index.html`
- Try different browser zoom levels

## 📦 Build Information

- **Framework**: React 19
- **Build Tool**: Create React App
- **Responsive**: CSS Grid & Flexbox
- **No External Dependencies**: Pure CSS for styling

## 🎯 Future Enhancements

Potential features to add:

- Multiple device support with tabs/selection
- Alerts/notifications for out-of-range values
- Historical data export
- Dark mode toggle
- Device configuration UI
- Real-time WebSocket updates

## 📝 License

MIT
