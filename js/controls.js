/**
 * User interaction controls for the globe
 * Handles mouse/touch controls for rotation, zoom, and pan
 */

class GlobeControls {
    constructor(camera, domElement, globe) {
        this.camera = camera;
        this.domElement = domElement;
        this.globe = globe;
        
        // Control settings
        this.enabled = true;
        this.rotateSpeed = 0.5;
        this.zoomSpeed = 1.2;
        this.panSpeed = 0.5;
        this.dampingFactor = 0.05;
        
        // Camera constraints
        this.minDistance = 8;
        this.maxDistance = 25;
        
        // State
        this.isRotating = false;
        this.isPanning = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.targetZoom = camera.position.z;
        
        // Initial camera position
        this.initialCameraPosition = camera.position.clone();
        this.cameraOffset = new THREE.Vector3(0, 0, 0);
        
        this.init();
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        // Mouse events
        this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.domElement.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });
        
        // Touch events for mobile
        this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // Prevent context menu on right click
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    /**
     * Handle mouse down event
     */
    onMouseDown(event) {
        if (!this.enabled) return;
        
        event.preventDefault();
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        if (event.button === 0) { // Left click - rotate
            this.isRotating = true;
            this.domElement.classList.add('grabbing');
        } else if (event.button === 2) { // Right click - pan
            this.isPanning = true;
        }
    }
    
    /**
     * Handle mouse move event
     */
    onMouseMove(event) {
        if (!this.enabled) return;
        
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        if (this.isRotating) {
            this.targetRotation.y += deltaX * this.rotateSpeed * 0.01;
            this.targetRotation.x += deltaY * this.rotateSpeed * 0.01;
            
            // Clamp vertical rotation
            this.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotation.x));
        }
        
        if (this.isPanning) {
            const panDeltaX = -deltaX * this.panSpeed * 0.01;
            const panDeltaY = deltaY * this.panSpeed * 0.01;
            
            this.cameraOffset.x += panDeltaX;
            this.cameraOffset.y += panDeltaY;
        }
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    /**
     * Handle mouse up event
     */
    onMouseUp(event) {
        if (!this.enabled) return;
        
        this.isRotating = false;
        this.isPanning = false;
        this.domElement.classList.remove('grabbing');
    }
    
    /**
     * Handle mouse wheel event for zooming
     */
    onMouseWheel(event) {
        if (!this.enabled) return;
        
        event.preventDefault();
        
        const delta = event.deltaY;
        
        if (delta < 0) {
            this.targetZoom /= this.zoomSpeed;
        } else {
            this.targetZoom *= this.zoomSpeed;
        }
        
        // Clamp zoom
        this.targetZoom = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetZoom));
    }
    
    /**
     * Handle touch start event
     */
    onTouchStart(event) {
        if (!this.enabled) return;
        
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // Single touch - rotate
            this.isRotating = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        } else if (event.touches.length === 2) {
            // Two touches - zoom
            this.isRotating = false;
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.touchDistance = Math.sqrt(dx * dx + dy * dy);
        }
    }
    
    /**
     * Handle touch move event
     */
    onTouchMove(event) {
        if (!this.enabled) return;
        
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isRotating) {
            // Single touch - rotate
            const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
            const deltaY = event.touches[0].clientY - this.previousMousePosition.y;
            
            this.targetRotation.y += deltaX * this.rotateSpeed * 0.01;
            this.targetRotation.x += deltaY * this.rotateSpeed * 0.01;
            
            this.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotation.x));
            
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        } else if (event.touches.length === 2) {
            // Two touches - zoom
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const delta = this.touchDistance - distance;
            this.touchDistance = distance;
            
            if (delta > 0) {
                this.targetZoom *= 1.01;
            } else {
                this.targetZoom /= 1.01;
            }
            
            this.targetZoom = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetZoom));
        }
    }
    
    /**
     * Handle touch end event
     */
    onTouchEnd(event) {
        if (!this.enabled) return;
        
        this.isRotating = false;
        this.isPanning = false;
    }
    
    /**
     * Update camera position and rotation with damping
     */
    update() {
        if (!this.enabled) return;
        
        // Smooth rotation with damping
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.dampingFactor;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.dampingFactor;
        
        // Apply rotation to globe
        if (this.globe.earth) {
            this.globe.earth.rotation.x = this.currentRotation.x;
            this.globe.earth.rotation.y = this.currentRotation.y;
        }
        if (this.globe.clouds) {
            this.globe.clouds.rotation.x = this.currentRotation.x;
            this.globe.clouds.rotation.y = this.currentRotation.y + 0.001;
        }
        if (this.globe.atmosphere) {
            this.globe.atmosphere.rotation.x = this.currentRotation.x;
            this.globe.atmosphere.rotation.y = this.currentRotation.y;
        }
        
        // Smooth zoom with damping
        this.camera.position.z += (this.targetZoom - this.camera.position.z) * this.dampingFactor;
        
        // Apply camera offset for panning
        this.camera.position.x = this.cameraOffset.x;
        this.camera.position.y = this.cameraOffset.y;
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        this.targetZoom /= this.zoomSpeed;
        this.targetZoom = Math.max(this.minDistance, this.targetZoom);
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        this.targetZoom *= this.zoomSpeed;
        this.targetZoom = Math.min(this.maxDistance, this.targetZoom);
    }
    
    /**
     * Reset camera to initial position
     */
    reset() {
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.targetZoom = this.initialCameraPosition.z;
        this.cameraOffset.set(0, 0, 0);
    }
    
    /**
     * Animate camera to look at a specific location
     */
    animateToLocation(lat, lon, duration = 2000) {
        // Convert lat/lon to rotation angles
        const targetRotX = -(lat * Math.PI / 180);
        const targetRotY = -(lon * Math.PI / 180);
        
        this.targetRotation.x = targetRotX;
        this.targetRotation.y = targetRotY;
        
        // Zoom in a bit
        this.targetZoom = 10;
    }
}
