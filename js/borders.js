/**
 * Country Borders Module
 * Handles loading and rendering of country borders on the 3D globe with LOD support
 */

class BorderManager {
    constructor(globe) {
        this.globe = globe;
        this.bordersLow = null;      // Low detail borders for far view
        this.bordersMedium = null;   // Medium detail borders for close view
        this.currentBorderLevel = null;
        this.bordersVisible = true;
        
        // Border styling configuration
        this.borderStyle = {
            color: 0xffffff,        // White borders
            opacity: 0.4,           // Semi-transparent
            linewidth: 1,           // Base line width
            far: {
                color: 0xcccccc,    // Light gray for far view
                opacity: 0.25,      // More transparent at distance
                linewidth: 1
            },
            medium: {
                color: 0xffffff,    // White for close view
                opacity: 0.35,      // Moderate transparency
                linewidth: 1.5
            }
        };
        
        // LOD thresholds (same as texture thresholds for consistency)
        this.lodThresholds = {
            medium: 4.0  // Below 4.0: use detailed borders, above: use simplified
        };
        
        this.isLoading = false;
        this.dataLoaded = {
            low: false,
            medium: false
        };
    }
    
    /**
     * Initialize and load border data
     */
    async init() {
        console.log('Initializing border system...');
        
        // Load low-detail borders first (for far view)
        await this.loadBorders('low');
        
        // Start loading medium-detail borders in background
        this.loadBorders('medium');
    }
    
    /**
     * Load border data from GeoJSON file
     * @param {string} level - 'low' or 'medium'
     */
    async loadBorders(level) {
        if (this.dataLoaded[level]) return;
        
        const filename = level === 'low' ? 'countries-110m.geojson' : 'countries-50m.geojson';
        const url = `data/${filename}`;
        
        try {
            console.log(`Loading ${level} detail borders from ${url}...`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
            }
            
            const geojson = await response.json();
            this.dataLoaded[level] = true;
            
            // Create Three.js geometry from GeoJSON
            const borderGroup = this.createBorderGeometry(geojson, level);
            
            if (level === 'low') {
                this.bordersLow = borderGroup;
                this.globe.globeGroup.add(borderGroup);
                this.currentBorderLevel = 'low';
                console.log(`Low detail borders loaded and added to scene`);
            } else {
                this.bordersMedium = borderGroup;
                console.log(`Medium detail borders loaded and ready`);
            }
            
        } catch (error) {
            console.warn(`Failed to load ${level} borders:`, error);
        }
    }
    
    /**
     * Convert GeoJSON to Three.js line geometry
     * @param {Object} geojson - GeoJSON feature collection
     * @param {string} level - Detail level ('low' or 'medium')
     * @returns {THREE.Group} Group containing all border lines
     */
    createBorderGeometry(geojson, level) {
        const borderGroup = new THREE.Group();
        borderGroup.name = `borders-${level}`;
        
        // Get style for this level
        const style = level === 'low' ? this.borderStyle.far : this.borderStyle.medium;
        
        // Process each country feature
        geojson.features.forEach(feature => {
            const geometry = feature.geometry;
            
            if (geometry.type === 'Polygon') {
                this.addPolygonBorders(borderGroup, geometry.coordinates, style);
            } else if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach(polygon => {
                    this.addPolygonBorders(borderGroup, polygon, style);
                });
            }
        });
        
        return borderGroup;
    }
    
    /**
     * Add borders for a single polygon to the group
     * @param {THREE.Group} group - Group to add borders to
     * @param {Array} coordinates - Polygon coordinates [lon, lat]
     * @param {Object} style - Border styling
     */
    addPolygonBorders(group, coordinates, style) {
        // Only process the outer ring (first array)
        const outerRing = coordinates[0];
        
        if (!outerRing || outerRing.length < 2) return;
        
        const points = [];
        
        // Convert lat/lon coordinates to 3D positions on sphere
        outerRing.forEach(coord => {
            const lon = coord[0];
            const lat = coord[1];
            
            // Convert to 3D position on sphere surface
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            
            const x = -(Math.sin(phi) * Math.cos(theta)) * 1.001; // Slightly above surface
            const z = (Math.sin(phi) * Math.sin(theta)) * 1.001;
            const y = (Math.cos(phi)) * 1.001;
            
            points.push(new THREE.Vector3(x, y, z));
        });
        
        if (points.length < 2) return;
        
        // Create line geometry from points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Use LineBasicMaterial for better performance
        const material = new THREE.LineBasicMaterial({
            color: style.color,
            opacity: style.opacity,
            transparent: true,
            linewidth: style.linewidth,
            depthWrite: false  // Prevent z-fighting
        });
        
        const line = new THREE.Line(geometry, material);
        group.add(line);
    }
    
    /**
     * Update border detail level based on camera distance
     * @param {number} cameraDistance - Current camera distance from globe
     */
    updateBorderLOD(cameraDistance) {
        if (!this.bordersVisible) return;
        
        let targetLevel;
        
        if (cameraDistance <= this.lodThresholds.medium) {
            targetLevel = 'medium';
        } else {
            targetLevel = 'low';
        }
        
        // Only switch if level changed and target is loaded
        if (targetLevel === this.currentBorderLevel) {
            return;
        }
        
        if (targetLevel === 'medium' && this.bordersMedium) {
            // Switch to medium detail
            if (this.bordersLow) {
                this.globe.globeGroup.remove(this.bordersLow);
            }
            this.globe.globeGroup.add(this.bordersMedium);
            this.currentBorderLevel = 'medium';
            console.log('Switched to medium detail borders');
        } else if (targetLevel === 'low' && this.bordersLow) {
            // Switch to low detail
            if (this.bordersMedium) {
                this.globe.globeGroup.remove(this.bordersMedium);
            }
            this.globe.globeGroup.add(this.bordersLow);
            this.currentBorderLevel = 'low';
            console.log('Switched to low detail borders');
        }
    }
    
    /**
     * Toggle border visibility
     * @param {boolean} visible - Whether borders should be visible
     */
    setVisible(visible) {
        this.bordersVisible = visible;
        
        if (visible) {
            // Show current level borders
            if (this.currentBorderLevel === 'low' && this.bordersLow) {
                this.globe.globeGroup.add(this.bordersLow);
            } else if (this.currentBorderLevel === 'medium' && this.bordersMedium) {
                this.globe.globeGroup.add(this.bordersMedium);
            }
        } else {
            // Hide all borders
            if (this.bordersLow) {
                this.globe.globeGroup.remove(this.bordersLow);
            }
            if (this.bordersMedium) {
                this.globe.globeGroup.remove(this.bordersMedium);
            }
        }
    }
    
    /**
     * Dispose of all border resources
     */
    dispose() {
        const disposeBorderGroup = (group) => {
            if (!group) return;
            
            group.traverse(obj => {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                if (obj.material) {
                    obj.material.dispose();
                }
            });
            
            this.globe.globeGroup.remove(group);
        };
        
        disposeBorderGroup(this.bordersLow);
        disposeBorderGroup(this.bordersMedium);
        
        this.bordersLow = null;
        this.bordersMedium = null;
    }
}
