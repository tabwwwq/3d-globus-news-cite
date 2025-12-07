/**
 * Map rendering and setup using Leaflet
 * Handles creation of map, markers, and interactions
 */

class Globe {
    constructor(container) {
        this.container = container;
        this.map = null;
        this.markers = [];
        this.markerLayers = {};
        
        // Marker type configurations
        this.markerConfig = {
            capital: {
                radius: 8,
                fillColor: '#ff3333',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            },
            major: {
                radius: 6,
                fillColor: '#ff8c42',
                color: '#fff',
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.8
            },
            city: {
                radius: 5,
                fillColor: '#ffd700',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            },
            village: {
                radius: 4,
                fillColor: '#90ee90',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the Leaflet map
     */
    init() {
        // Create map centered on the world
        this.map = L.map('container', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: false,  // We'll use custom zoom controls
            worldCopyJump: true
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Update loading progress
        this.updateLoadingProgress(100);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Track mouse position for coordinate display
        this.map.on('mousemove', (e) => {
            if (window.updateMouseCoordinates) {
                window.updateMouseCoordinates(e.latlng.lat, e.latlng.lng);
            }
        });
    }
    
    /**
     * Add a marker at a specific location
     */
    addMarker(lat, lon, name, country, type = 'city', population = null) {
        const config = this.markerConfig[type] || this.markerConfig.city;
        
        // Create circle marker
        const marker = L.circleMarker([lat, lon], config);
        
        // Create popup content
        let popupContent = `<b>${name}</b><br>${country}`;
        
        // Add type info
        const typeLabels = {
            capital: 'Capital',
            major: 'Major City',
            city: 'City',
            village: 'Town/Village'
        };
        popupContent += `<br><i>${typeLabels[type]}</i>`;
        
        // Add population if available
        if (population) {
            const popMillions = population / 1000000;
            const popThousands = population / 1000;
            
            if (population >= 1000000) {
                popupContent += `<br>Pop: ${popMillions.toFixed(1)}M`;
            } else {
                popupContent += `<br>Pop: ${Math.round(popThousands)}K`;
            }
        }
        
        popupContent += `<br>${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
        
        // Bind popup
        marker.bindPopup(popupContent);
        
        // Add to map
        marker.addTo(this.map);
        
        // Store marker data
        const markerData = {
            marker: marker,
            lat: lat,
            lon: lon,
            name: name,
            country: country,
            type: type,
            population: population
        };
        
        this.markers.push(markerData);
        
        // Group by type for easier management
        if (!this.markerLayers[type]) {
            this.markerLayers[type] = [];
        }
        this.markerLayers[type].push(markerData);
        
        return markerData;
    }
    
    /**
     * Initialize instanced markers (compatibility with old API)
     */
    initializeInstancedMarkers() {
        // Not needed for Leaflet, but keep for compatibility
        console.log(`Initialized ${this.markers.length} markers on the map`);
    }
    
    /**
     * Update marker visibility based on zoom (LOD system)
     */
    updateMarkerLOD(zoom) {
        // Leaflet handles marker rendering automatically
        // This method kept for compatibility
    }
    
    /**
     * Animate function (compatibility with old API)
     */
    animate() {
        // No animation needed for Leaflet map
    }
    
    /**
     * Render function (compatibility with old API)
     */
    render() {
        // Leaflet handles rendering automatically
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }
    
    /**
     * Update loading progress
     */
    updateLoadingProgress(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
    }
    
    /**
     * Pan and zoom to a specific location
     */
    flyToLocation(lat, lon, zoom = 10) {
        if (this.map) {
            this.map.flyTo([lat, lon], zoom, {
                duration: 1.5
            });
        }
    }
    
    /**
     * Get marker at coordinates (compatibility)
     */
    getIntersectedMarker(mouseX, mouseY) {
        // Not needed for Leaflet as it handles click events internally
        return null;
    }
    
    /**
     * Get current map center
     */
    getCenter() {
        if (this.map) {
            return this.map.getCenter();
        }
        return { lat: 0, lng: 0 };
    }
    
    /**
     * Get current zoom level
     */
    getZoom() {
        if (this.map) {
            return this.map.getZoom();
        }
        return 2;
    }
}
