/**
 * User interaction controls for the map
 * Handles zoom and pan controls
 */

class GlobeControls {
    constructor(camera, domElement, globe) {
        this.globe = globe;
        this.map = globe.map;
        
        // Control settings
        this.enabled = true;
        
        // Initial view
        this.initialView = {
            center: [20, 0],
            zoom: 2
        };
    }
    
    /**
     * Update method (compatibility with old API)
     */
    update() {
        // Leaflet handles updates automatically
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        if (this.map) {
            this.map.zoomIn();
        }
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        if (this.map) {
            this.map.zoomOut();
        }
    }
    
    /**
     * Reset map to initial position
     */
    reset() {
        if (this.map) {
            this.map.setView(this.initialView.center, this.initialView.zoom);
        }
    }
    
    /**
     * Animate to look at a specific location
     */
    animateToLocation(lat, lon, duration = 2000) {
        if (this.map) {
            this.map.flyTo([lat, lon], 10, {
                duration: duration / 1000  // Leaflet uses seconds
            });
        }
    }
    
    /**
     * Get current rotation (compatibility - returns center for Leaflet)
     */
    get currentRotation() {
        if (this.map) {
            const center = this.map.getCenter();
            return {
                x: -(center.lat * Math.PI / 180),
                y: -(center.lng * Math.PI / 180)
            };
        }
        return { x: 0, y: 0 };
    }
}
