# Earth Textures

This directory can contain high-quality Earth textures for improved performance and quality.

## Optional Local Textures

The application will automatically try to load textures from this directory first, then fall back to CDN if not found.

To use local textures, download the following files:

### Required Textures

1. **earth-blue-marble.jpg** (2K) - Base Earth texture for distant view
2. **earth-day.jpg** (4K-8K) - High-resolution Earth texture for close view
3. **earth-topology.png** - Bump map for terrain relief
4. **earth-water.png** - Specular map for water reflections
5. **earth-night.jpg** - Night lights showing cities
6. **earth-clouds.png** - Cloud layer texture

## Download Sources

### NASA Visible Earth (Free, High Quality)
- https://visibleearth.nasa.gov/
- Look for "Blue Marble" collections

### Natural Earth Data (Free)
- https://www.naturalearthdata.com/

### Three.js Globe Examples (MIT License)
```bash
wget https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg
wget https://unpkg.com/three-globe/example/img/earth-day.jpg
wget https://unpkg.com/three-globe/example/img/earth-topology.png
wget https://unpkg.com/three-globe/example/img/earth-water.png
wget https://unpkg.com/three-globe/example/img/earth-night.jpg
wget https://unpkg.com/three-globe/example/img/earth-clouds.png
```

## Recommended Resolutions

- **Far view (> 4.0 units)**: 2K (2048x1024)
- **Medium view (2.0-4.0 units)**: 4K (4096x2048)
- **Close view (< 2.0 units)**: 8K (8192x4096)

## Performance Notes

- Higher resolution textures (8K) require more memory and may impact performance on lower-end devices
- The application uses progressive loading: starts with low-res, loads high-res on demand
- Anisotropic filtering is automatically enabled for sharper textures at oblique angles
- Textures are cached after first load for instant switching

## Fallback

If no textures are available, the globe will render with procedural colors (ocean blue/land green) and still function normally with all features.
