# Interactive 3D Globe 🌍

A fully interactive 3D Earth globe built with Three.js that allows users to explore the world in a stunning 3D perspective, similar to Google Earth.

![Interactive 3D Globe](https://img.shields.io/badge/WebGL-Enabled-green)
![Three.js](https://img.shields.io/badge/Three.js-r128-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Core Functionality
- **Realistic 3D Earth Rendering**: High-quality Earth textures with continents, oceans, and topographical details
- **Enhanced Relief System**: Bump mapping and displacement for realistic terrain visualization
- **Specular Mapping**: Realistic ocean reflections and highlights
- **Interactive Controls**:
  - 🖱️ **Rotate**: Click and drag to rotate the globe in any direction
  - 🔍 **Zoom**: Mouse wheel or buttons to zoom in/out (supports pinch gestures on mobile)
  - ↔️ **Pan**: Right-click and drag to pan the view
- **Smooth Animations**: Fluid transitions and damped camera movements for a polished experience

### Visual Effects
- 🌍 High-resolution Earth texture maps (2K+)
- 🗺️ Detailed relief and bump mapping for realistic terrain
- 🌊 Specular maps for ocean reflections
- ☁️ Animated cloud layer overlay
- 🌌 Atmospheric glow effect around the globe
- ⭐ Starfield background for space immersion
- 💡 Realistic lighting and shadows

### Advanced Marker System
- 📍 **228+ Cities Worldwide**: Comprehensive global coverage
- 🎯 **Four-Level Hierarchy**:
  - 🔴 **Capitals** (64): Largest markers, visible from far distances
  - 🟠 **Major Cities** (84): Medium markers for cities over 1M population
  - 🟡 **Cities** (49): Smaller markers for cities 100K-1M population
  - 🟢 **Towns/Villages** (31): Smallest markers for smaller locations
- 🔄 **Dynamic LOD System**: Markers appear/disappear based on zoom level
- ✨ **Pulsing Animations**: Different animation speeds for each marker type
- 🎨 **Color-Coded Legend**: Visual guide for marker types

### Interactive Features
- 🔍 **Location Search**: Search bar to find and navigate to any city
- 📊 **Real-time Information**:
  - Current latitude and longitude display
  - FPS counter for performance monitoring
  - Location popups with city details, type, and population
- 🎯 **Clickable Markers**: Click on city markers to view detailed information
- ⚡ **Optimized Performance**: Smooth 60 FPS with 200+ markers using InstancedMesh

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
- **Rotate Globe**: Left-click and drag
- **Zoom In/Out**: Scroll mouse wheel or use +/- buttons
- **Pan View**: Right-click and drag
- **Reset View**: Click the ⟲ button

#### Mobile
- **Rotate Globe**: Single finger drag
- **Zoom**: Pinch gesture (two fingers)
- **Pan View**: Two finger drag

### Searching for Locations

1. Click on the search bar at the top of the control panel
2. Type the name of a city or country
3. Select from the dropdown results or press Enter
4. The globe will automatically rotate and zoom to the selected location
5. A popup will display information about the location

### Exploring Cities

- City markers appear as small red pulsing spheres on the globe
- Click on any marker to view city information
- The popup shows:
  - City name
  - Country
  - Exact coordinates (latitude/longitude)

### Monitoring Performance

- The FPS (Frames Per Second) counter shows real-time rendering performance
- Optimal performance is 60 FPS
- Lower FPS may indicate:
  - High GPU load
  - Browser limitations
  - Device performance constraints

## 🏗️ Project Structure

```
/
├── index.html          # Main HTML file with structure
├── css/
│   └── style.css       # Styling and responsive design
├── js/
│   ├── main.js         # Application initialization and UI logic
│   ├── globe.js        # 3D globe creation and rendering
│   ├── controls.js     # User interaction controls
│   └── locations.js    # Location data and utility functions
├── assets/
│   └── textures/       # (Optional) Local texture storage
└── README.md           # This file
```

## 💻 Technologies Used

- **[Three.js r128](https://threejs.org/)**: WebGL 3D library for rendering
- **WebGL**: Graphics API for GPU-accelerated 3D rendering
- **HTML5 Canvas**: Rendering surface
- **Vanilla JavaScript (ES6+)**: No frameworks required
- **CSS3**: Modern styling with animations and responsive design

## 🎨 Textures & Assets

This project uses high-quality Earth textures from the Three.js examples repository:
- **Earth Surface**: 2048x1024 texture with continents and oceans
- **Earth Bump Map**: Normal map for topographical detail and terrain relief
- **Earth Specular Map**: Specular highlights for realistic ocean reflections
- **Cloud Layer**: Transparent cloud overlay texture

All textures are loaded from CDN sources:
- [Three.js GitHub Repository](https://github.com/mrdoob/three.js/tree/master/examples/textures/planets)

### Marker System

The application uses a sophisticated four-level marker system:

| Type | Color | Size | Population | Visibility Distance | Count |
|------|-------|------|-----------|---------------------|-------|
| Capital | Red (#ff3333) | Large (0.09) | Varies | Always visible (20+ units) | 64 |
| Major City | Orange (#ff8c42) | Medium (0.065) | > 1M | Visible from 15+ units | 84 |
| City | Yellow (#ffd700) | Small (0.045) | 100K-1M | Visible from 12+ units | 49 |
| Village/Town | Green (#90ee90) | Tiny (0.025) | < 100K | Close zoom only (< 12 units) | 31 |

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
    size: 0.09,              // Marker size
    color: 0xff3333,         // Color (hex)
    minDistance: 20,         // Visibility distance threshold
    pulseSpeed: 0.004,       // Animation speed
    glowIntensity: 1.5       // Glow effect intensity
  },
  // ... other types
}
```

### Changing Globe Appearance

In `js/globe.js`, modify:
- `this.radius`: Globe size (default: 5)
- `this.segments`: Polygon detail (default: 64, higher = smoother but slower)
- `bumpScale`: Relief intensity (default: 0.1)
- Texture URLs: Use custom Earth textures
- Colors: Atmosphere and marker colors

### Adjusting Controls

In `js/controls.js`, customize:
- `rotateSpeed`: Rotation sensitivity
- `zoomSpeed`: Zoom speed factor
- `minDistance` / `maxDistance`: Zoom limits
- `dampingFactor`: Smoothness of movements

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari | ✅ Full Support |
| Edge | ✅ Full Support |
| Mobile Chrome | ✅ Full Support |
| Mobile Safari | ✅ Full Support |

**Note**: WebGL support is required. Very old browsers may not work.

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers (1920x1080 and above)
- Laptops (1366x768 and above)
- Tablets (768x1024)
- Mobile phones (375x667 and above)

Touch gestures are fully supported on mobile devices.

## ⚡ Performance Optimization

- **Efficient Rendering**: InstancedMesh for rendering 200+ markers
- **LOD System**: Distance-based marker visibility with smooth transitions
- **Texture Optimization**: Uses appropriately sized textures (2K)
- **Geometry Caching**: Meshes created once and reused
- **RAF (RequestAnimationFrame)**: Smooth 60 FPS rendering
- **Page Visibility API**: Pauses animation when tab is not visible
- **Disposal Management**: Proper cleanup of Three.js objects
- **Optimized Animations**: Efficient pulsing animations with minimal overhead

### Performance Metrics
- Maintains 60 FPS with 228 markers
- Smooth fade transitions for marker LOD
- Optimized raycasting for marker interaction
- Minimal CPU/GPU overhead with instanced rendering

## 🔜 Future Enhancements

Potential features for future versions:
- [ ] Night lights texture for shadow side of Earth
- [ ] Satellite view mode
- [ ] Real-time weather overlay
- [ ] Day/night cycle animation
- [ ] Flight path visualization between cities
- [ ] Distance measurement tool
- [ ] Multiple globe themes (political, terrain, etc.)
- [ ] User-added custom markers with persistence
- [ ] Export/share camera views
- [ ] VR mode support
- [ ] Quality settings (high/medium/low)
- [ ] Marker filtering by type

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

- **Three.js Team**: For the amazing 3D library
- **NASA**: For Earth texture references
- **Earth Textures**: Sourced from Three.js examples repository

## 📧 Contact

Project Link: [https://github.com/tabwwwq/3d-globus-news-cite](https://github.com/tabwwwq/3d-globus-news-cite)

---

Made with ❤️ and JavaScript