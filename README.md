# Interactive World Map 🗺️

An interactive 2D world map built with Leaflet.js and OpenStreetMap that allows users to explore 228+ cities worldwide with an intuitive interface.

![Leaflet](https://img.shields.io/badge/Leaflet-v1.9.4-green)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Free-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Core Functionality
- **Interactive 2D World Map**: Built with Leaflet.js using OpenStreetMap tiles
- **No API Keys Required**: Completely free OpenStreetMap integration
- **Interactive Controls**:
  - 🖱️ **Pan**: Click and drag to move around the map
  - 🔍 **Zoom**: Mouse wheel or buttons to zoom in/out (supports pinch gestures on mobile)
  - 📍 **Navigate**: Click markers to see city information
- **Smooth Animations**: Fluid flyTo transitions when navigating to cities

### Map Features
- 🗺️ OpenStreetMap tiles with global coverage
- 🌍 Professional dark theme design
- 📱 Fully responsive for mobile and desktop
- ⚡ Fast loading with local library
- 🎨 Clean, modern UI with dark theme

### Advanced Marker System
- 📍 **228 Cities Worldwide**: Comprehensive global coverage
- 🎯 **Four-Level Hierarchy**:
  - 🔴 **Capitals** (64): Red markers, radius 8px
  - 🟠 **Major Cities** (84): Orange markers, radius 6px
  - 🟡 **Cities** (49): Yellow markers, radius 5px
  - 🟢 **Towns/Villages** (31): Green markers, radius 4px
- 💬 **Information Popups**: Click markers to see city details
- 🎨 **Color-Coded Legend**: Visual guide for marker types

### Interactive Features
- 🔍 **Location Search**: Search bar with autocomplete to find cities
- 📊 **Real-time Information**:
  - Current latitude and longitude display (cursor position)
  - Location popups with city details, type, and population
- 🎯 **Clickable Markers**: Click on city markers to view detailed information
- ⚡ **Instant Loading**: No texture downloads required

### User Interface
- Clean, modern dark-themed UI
- Intuitive zoom controls (+/- buttons)
- Reset view button to return to default position
- Color-coded marker legend
- Enhanced location popups with comprehensive city information
- Responsive design for desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- A modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading Three.js library and textures)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tabwwwq/3d-globus-news-cite.git
   cd 3d-globus-news-cite
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local web server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Then navigate to `http://localhost:8000` in your browser

### No Build Required
This project uses vanilla JavaScript and loads Three.js from a CDN, so no build process or dependencies installation is required!

## 📖 Usage Guide

### Basic Controls

#### Desktop
- **Pan Map**: Click and drag
- **Zoom In/Out**: Scroll mouse wheel or use +/- buttons
- **Reset View**: Click the ⟲ button

#### Mobile
- **Pan Map**: Single finger drag
- **Zoom**: Pinch gesture (two fingers) or use +/- buttons
- **Tap**: Click on markers to see information

### Searching for Locations

1. Click on the search bar at the top of the control panel
2. Type the name of a city or country
3. Select from the dropdown results or press Enter
4. The map will automatically pan and zoom to the selected location
5. Click the marker to see detailed information

### Exploring Cities

- City markers appear as colored circles on the map
- Click on any marker to view city information in a popup
- The popup shows:
  - City name
  - Country
  - City type (Capital, Major City, City, or Town)
  - Population (if available)
  - Exact coordinates (latitude/longitude)

## 🏗️ Project Structure

```
/
├── index.html          # Main HTML file with structure
├── css/
│   └── style.css       # Styling and responsive design
├── js/
│   ├── main.js         # Application initialization and UI logic
│   ├── globe.js        # Leaflet map creation and marker rendering
│   ├── controls.js     # User interaction controls
│   └── locations.js    # Location data (228 cities) and search
├── libs/
│   └── leaflet/        # Leaflet.js library (local)
│       ├── leaflet.js
│       ├── leaflet.css
│       └── images/     # Leaflet icons
├── package.json        # NPM dependencies
└── README.md           # This file
```

## 💻 Technologies Used

- **[Leaflet.js v1.9.4](https://leafletjs.com/)**: Leading open-source library for interactive maps
- **[OpenStreetMap](https://www.openstreetmap.org/)**: Free, collaborative map tiles
- **HTML5**: Modern web structure
- **Vanilla JavaScript (ES6+)**: No frameworks required
- **CSS3**: Modern styling with animations and responsive design

## 🗺️ Map Tiles & Assets

This project uses OpenStreetMap tiles which are:
- **Completely Free**: No API keys or registration required
- **Community Maintained**: Updated by millions of contributors
- **Global Coverage**: Worldwide map data
- **Always Available**: No rate limits or quotas

### Marker System

The application uses a four-level marker system with Leaflet CircleMarkers:

| Type | Color | Radius (px) | Population | Count |
|------|-------|------------|-----------|-------|
| Capital | Red (#ff3333) | 8 | Varies | 64 |
| Major City | Orange (#ff8c42) | 6 | > 1M | 84 |
| City | Yellow (#ffd700) | 5 | 100K-1M | 49 |
| Village/Town | Green (#90ee90) | 4 | < 100K | 31 |

**Total Locations: 228**

## 🔧 Customization

### Adding Custom Locations

Edit `js/locations.js` and add new entries to the `LOCATIONS` array:

```javascript
{ 
  name: "Your City", 
  country: "Your Country", 
  lat: 40.7128, 
  lon: -74.0060,
  type: "city",  // Options: "capital", "major", "city", "village"
  population: 1000000  // Optional
}
```

### Marker Type Configuration

In `js/globe.js`, modify the `markerConfig` object to customize marker appearance:

```javascript
this.markerConfig = {
  capital: {
    radius: 8,              // Marker radius in pixels
    fillColor: '#ff3333',   // Fill color
    color: '#fff',          // Border color
    weight: 2,              // Border width
    opacity: 1,             // Border opacity
    fillOpacity: 0.8        // Fill opacity
  },
  // ... other types
}
```

### Changing Map Appearance

In `js/globe.js`, modify:
- Initial view center: `[20, 0]` (latitude, longitude)
- Initial zoom level: `2`
- Min/max zoom: `minZoom: 2, maxZoom: 18`
- Tile provider: Change the tile layer URL for different map styles

### Adjusting Controls

In `js/controls.js`, customize:
- `initialView`: Starting position and zoom
- Map interactions are handled by Leaflet automatically

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari | ✅ Full Support |
| Edge | ✅ Full Support |
| Mobile Chrome | ✅ Full Support |
| Mobile Safari | ✅ Full Support |

**Note**: Modern browsers with JavaScript enabled required.

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers (1920x1080 and above)
- Laptops (1366x768 and above)
- Tablets (768x1024)
- Mobile phones (375x667 and above)

Touch gestures are fully supported on mobile devices.

## ⚡ Performance

- **Fast Loading**: No texture downloads, instant map display
- **Efficient Rendering**: Leaflet handles 228 markers efficiently
- **Responsive**: Smooth panning and zooming
- **Lightweight**: Minimal dependencies with local Leaflet library
- **Mobile Optimized**: Touch gestures work seamlessly

### Performance Benefits
- Instant page load (no large texture files)
- Low memory footprint compared to 3D rendering
- Works smoothly on mobile devices
- No GPU requirements

## 🔜 Future Enhancements

Potential features for future versions:
- [ ] Marker clustering for better performance at low zoom levels
- [ ] Alternative tile providers (satellite view, terrain)
- [ ] Custom marker icons for different city types
- [ ] Heatmap visualization of population density
- [ ] Route/path drawing between cities
- [ ] Distance measurement tool
- [ ] User-added custom markers with persistence
- [ ] Export/share map views
- [ ] Dark mode map tiles
- [ ] Marker filtering by type or population
- [ ] GeoJSON data export

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- **Leaflet.js Team**: For the excellent open-source mapping library
- **OpenStreetMap Contributors**: For the free, collaborative map data
- **Community**: For continuous improvements and contributions

## 📧 Contact

Project Link: [https://github.com/tabwwwq/3d-globus-news-cite](https://github.com/tabwwwq/3d-globus-news-cite)

---

Made with ❤️ using Leaflet.js and OpenStreetMap