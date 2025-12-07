/**
 * User interaction controls for the 3D globe
 * Implements OrbitControls-like functionality
 */

class GlobeControls {
    constructor(camera, domElement, globe) {
        this.globe = globe;
        this.camera = camera;
        this.domElement = domElement;
        this.enabled = true;
        
        this.isRotating = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        
        this.minDistance = 1.5;
        this.maxDistance = 5;
        this.rotationSpeed = 0.005;
        this.zoomSpeed = 0.1;
        this.dampingFactor = 0.1;
        
        this.setupEventListeners();
        window.globeControls = this;
    }
    
    setupEventListeners() {
        this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.domElement.addEventListener('wheel', (e) => this.onWheel(e));
        
        this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }
    
    onMouseDown(event) {
        this.isRotating = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this.domElement.style.cursor = 'grabbing';
    }
    
    onMouseMove(event) {
        if (!this.isRotating) return;
        
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        this.targetRotation.y += deltaX * this.rotationSpeed;
        this.targetRotation.x += deltaY * this.rotationSpeed;
        
        this.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotation.x));
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    onMouseUp(event) {
        this.isRotating = false;
        this.domElement.style.cursor = 'grab';
    }
    
    onWheel(event) {
        event.preventDefault();
        
        const delta = event.deltaY * 0.001;
        const newZ = this.camera.position.length() + delta * this.zoomSpeed;
        
        const clampedZ = Math.max(this.minDistance, Math.min(this.maxDistance, newZ));
        const scale = clampedZ / this.camera.position.length();
        
        this.camera.position.multiplyScalar(scale);
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isRotating = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }
    
    onTouchMove(event) {
        if (event.touches.length === 1 && this.isRotating) {
            event.preventDefault();
            
            const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
            const deltaY = event.touches[0].clientY - this.previousMousePosition.y;
            
            this.targetRotation.y += deltaX * this.rotationSpeed;
            this.targetRotation.x += deltaY * this.rotationSpeed;
            
            this.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotation.x));
            
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }
    
    onTouchEnd(event) {
        this.isRotating = false;
    }
    
    update() {
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * this.dampingFactor;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * this.dampingFactor;
        
        if (this.globe.globe) {
            this.globe.globe.rotation.y = this.rotation.y;
            this.globe.globe.rotation.x = this.rotation.x;
        }
        
        if (this.globe.atmosphere) {
            this.globe.atmosphere.rotation.y = this.rotation.y;
            this.globe.atmosphere.rotation.x = this.rotation.x;
        }
        
        // Rotate all markers with the globe
        this.globe.markerMeshes.forEach(marker => {
            marker.rotation.y = this.rotation.y;
            marker.rotation.x = this.rotation.x;
        });
    }
    
    zoomIn() {
        const newZ = this.camera.position.length() - 0.3;
        const clampedZ = Math.max(this.minDistance, newZ);
        const scale = clampedZ / this.camera.position.length();
        this.camera.position.multiplyScalar(scale);
    }
    
    zoomOut() {
        const newZ = this.camera.position.length() + 0.3;
        const clampedZ = Math.min(this.maxDistance, newZ);
        const scale = clampedZ / this.camera.position.length();
        this.camera.position.multiplyScalar(scale);
    }
    
    reset() {
        this.targetRotation = { x: 0, y: 0 };
        this.camera.position.set(0, 0, 3);
    }
    
    animateToLocation(lat, lon, duration = 2000) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        this.targetRotation.y = -theta + Math.PI;
        this.targetRotation.x = -(phi - Math.PI / 2);
        
        const targetZ = 1.8;
        const currentZ = this.camera.position.length();
        const steps = 60;
        let step = 0;
        
        const animate = () => {
            if (step < steps) {
                step++;
                const progress = step / steps;
                const eased = 1 - Math.pow(1 - progress, 3);
                
                const newZ = currentZ + (targetZ - currentZ) * eased;
                const scale = newZ / this.camera.position.length();
                this.camera.position.multiplyScalar(scale);
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    get currentRotation() {
        return {
            x: this.rotation.x,
            y: this.rotation.y
        };
    }
}
