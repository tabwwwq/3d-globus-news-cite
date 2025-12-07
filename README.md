# Interactive 3D Globe 🌍

An interactive 3D Earth globe built with Three.js that allows users to explore 539+ cities worldwide with an intuitive interface featuring rotation, zoom, and search capabilities.

![Three.js](https://img.shields.io/badge/Three.js-r128-blue)
![Cities](https://img.shields.io/badge/Cities-539-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Core Functionality
- **Interactive 3D Globe**: Built with Three.js - drag to rotate, mouse wheel to zoom
- **No External Dependencies**: Three.js library stored locally, no CDN required
- **Interactive Controls**:
  - 🖱️ **Rotate**: Click and drag to rotate the globe in any direction
  - 🔍 **Zoom**: Mouse wheel or buttons to zoom in/out
  - 📍 **Navigate**: Click markers to see city information
- **Smooth Animations**: Damped rotation and smooth transitions when navigating to cities

### 3D Globe Features
- 🌍 Beautiful blue Earth sphere with realistic lighting
- ✨ Atmospheric glow effect around the globe
- 💫 Smooth rotation with drag controls
- 📱 Fully responsive for mobile and desktop
- ⚡ Fast rendering with WebGL
- 🎨 Clean, modern UI with dark theme

### Advanced Marker System
- 📍 **539 Cities Worldwide**: Comprehensive global coverage (more than doubled!)
- 🎯 **Four-Level Hierarchy**:
  - 🔴 **Capitals** (95): Red markers
  - 🟠 **Major Cities** (200+): Orange markers
  - 🟡 **Cities** (180+): Yellow markers
  - 🟢 **Towns/Villages** (60+): Green markers
- 💬 **Information Popups**: Click markers to see city details
- 🎨 **Color-Coded Legend**: Visual guide for marker types
- 🌐 **3D Positioning**: Markers positioned accurately on globe surface

### Interactive Features
- 🔍 **Location Search**: Search bar with autocomplete to find cities from 539 locations
- 📊 **Real-time Information**:
  - Current latitude and longitude display (mouse position on globe)
  - Location popups with city details, type, and population
- 🎯 **Clickable 3D Markers**: Click on city markers to view detailed information
- ⚡ **Instant Loading**: Local Three.js library, no downloads required

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
- No internet connection required (Three.js bundled locally)

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
This project uses vanilla JavaScript and loads Three.js from a local file, so no build process or dependencies installation is required!

## 📖 Usage Guide

### Basic Controls

#### Desktop
- **Rotate Globe**: Click and drag anywhere on the globe
- **Zoom In/Out**: Scroll mouse wheel or use +/- buttons
- **Reset View**: Click the ⟲ button

#### Mobile
- **Rotate Globe**: Single finger drag
- **Zoom**: Pinch gesture (two fingers) or use +/- buttons
- **Tap**: Click on markers to see information

### Searching for Locations

1. Click on the search bar at the top of the control panel
2. Type the name of a city or country
3. Select from the dropdown results or press Enter
4. The globe will automatically rotate and zoom to the selected location
5. Click the marker to see detailed information

### Exploring Cities

- City markers appear as colored spheres on the globe surface
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
│   ├── globe.js        # Three.js 3D globe creation and rendering
│   ├── controls.js     # User interaction controls (rotation, zoom)
│   └── locations.js    # Location data (539 cities) and search
├── libs/
│   └── three/          # Three.js library (local r128)
│       ├── three.js
│       └── three.min.js
├── package.json        # NPM metadata
└── README.md           # This file
```

## 💻 Technologies Used

- **[Three.js r128](https://threejs.org/)**: Leading 3D graphics library for WebGL
- **HTML5**: Modern web structure
- **Vanilla JavaScript (ES6+)**: No frameworks required
- **CSS3**: Modern styling with animations and responsive design
- **WebGL**: Hardware-accelerated 3D rendering

## 🌐 Globe Implementation

This project uses Three.js for 3D rendering with:
- **Sphere Geometry**: High-resolution sphere (64 segments) for smooth globe
- **Phong Material**: Blue Earth with emissive lighting for depth
- **Shader Material**: Custom atmospheric glow effect
- **Group System**: Efficient rotation of globe + markers as single unit
- **Raycasting**: Precise mouse interaction detection

### Marker System

The application uses a four-level marker system with 3D spheres:

| Type | Color | Size | Population | Count |
|------|-------|------|-----------|-------|
| Capital | Red (#ff3333) | 0.015 | Varies | 95 |
| Major City | Orange (#ff8c42) | 0.012 | > 1M | 200+ |
| City | Yellow (#ffd700) | 0.010 | 100K-1M | 180+ |
| Village/Town | Green (#90ee90) | 0.008 | < 100K | 60+ |

**Total Locations: 539**

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
    color: 0xff3333,   // Hex color
    size: 0.015        // Sphere radius
  },
  // ... other types
}
```

### Changing Globe Appearance

In `js/globe.js`, modify:
- Globe color: Change `color` and `emissive` in `createGlobe()`
- Atmosphere color: Modify RGB values in shader `fragmentShader`
- Camera position: Adjust `this.camera.position.z` in `init()`

### Adjusting Controls

In `js/controls.js`, customize:
- `rotationSpeed`: How fast the globe rotates (default: 0.005)
- `zoomSpeed`: How fast zoom responds (default: 0.1)
- `dampingFactor`: Smoothness of rotation (default: 0.1)
- `minDistance` / `maxDistance`: Zoom limits

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

- **Fast Loading**: Local Three.js library, instant startup
- **Efficient Rendering**: WebGL hardware acceleration
- **Optimized Markers**: 539 markers rendered efficiently using THREE.Group
- **Smooth Rotation**: Damped controls for fluid user experience
- **Responsive**: Smooth performance on desktop and mobile
- **Lightweight**: No external API calls or texture downloads

### Performance Benefits
- Instant page load (all assets local)
- Low memory footprint with optimized rendering
- Hardware-accelerated 3D graphics
- Efficient group-based transformations

## 🔜 Future Enhancements

Potential features for future versions:
- [ ] Earth texture maps (NASA Blue Marble or similar)
- [ ] Day/night cycle visualization
- [ ] Cloud layer animation
- [ ] Country boundaries overlay
- [ ] Flight paths between cities
- [ ] City lights for night side
- [ ] More detailed city information
- [ ] Heatmap visualization options
- [ ] Time zone display
- [ ] Distance measurement tool
- [ ] Custom marker icons
- [ ] Export/share globe views
- [ ] Marker clustering at distance
- [ ] Satellite view mode

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

- **Three.js Team**: For the excellent 3D graphics library
- **WebGL**: For enabling hardware-accelerated 3D graphics in browsers
- **Community**: For continuous improvements and contributions

## 📧 Contact

Project Link: [https://github.com/tabwwwq/3d-globus-news-cite](https://github.com/tabwwwq/3d-globus-news-cite)

---

Made with ❤️ using Three.js and WebGL