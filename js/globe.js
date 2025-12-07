/**
 * 3D Globe rendering using Three.js
 */

class Globe {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globeGroup = null;  // Group for globe, atmosphere, and markers
        this.globe = null;
        this.atmosphere = null;
        this.markers = [];
        this.markerMeshes = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.markerConfig = {
            capital: { color: 0xff3333, size: 0.015 },
            major: { color: 0xff8c42, size: 0.012 },
            city: { color: 0xffd700, size: 0.010 },
            village: { color: 0x90ee90, size: 0.008 }
        };
        
        this.init();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 3;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Create a group to hold globe and all markers
        this.globeGroup = new THREE.Group();
        this.scene.add(this.globeGroup);
        
        this.addLights();
        this.createGlobe();
        this.createAtmosphere();
        
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onMouseClick(e));
        
        this.updateLoadingProgress(100);
        this.animate();
    }
    
    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(5, 3, 5);
        this.scene.add(sunLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -3, -5);
        this.scene.add(fillLight);
    }
    
    createGlobe() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Use a simple material with color instead of texture for now
        // This ensures the globe works without external dependencies
        const material = new THREE.MeshPhongMaterial({
            color: 0x2233aa,
            emissive: 0x112244,
            shininess: 5,
            specular: new THREE.Color(0x333333)
        });
        
        this.globe = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.globe);  // Add to group instead of scene
        
        // Skip clouds for simpler implementation
        this.updateLoadingProgress(75);
    }
    
    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(1.15, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        
        this.atmosphere = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.atmosphere);  // Add to group instead of scene
    }
    
    latLonToVector3(lat, lon, radius = 1) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        
        return new THREE.Vector3(x, y, z);
    }
    
    addMarker(lat, lon, name, country, type = 'city', population = null) {
        const config = this.markerConfig[type] || this.markerConfig.city;
        
        const geometry = new THREE.SphereGeometry(config.size, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: config.color,
            transparent: true,
            opacity: 0.9
        });
        
        const marker = new THREE.Mesh(geometry, material);
        const position = this.latLonToVector3(lat, lon, 1.005);
        marker.position.copy(position);
        
        marker.userData = { lat, lon, name, country, type, population };
        
        this.globeGroup.add(marker);  // Add to group instead of scene
        this.markerMeshes.push(marker);
        
        const markerData = { marker, lat, lon, name, country, type, population };
        this.markers.push(markerData);
        
        return markerData;
    }
    
    initializeInstancedMarkers() {
        console.log(`Initialized ${this.markers.length} markers on the globe`);
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.globe);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            const lat = Math.asin(point.y) * (180 / Math.PI);
            const lon = Math.atan2(point.z, -point.x) * (180 / Math.PI);
            
            if (window.updateMouseCoordinates) {
                window.updateMouseCoordinates(lat, lon);
            }
        }
    }
    
    onMouseClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.markerMeshes);
        
        if (intersects.length > 0) {
            const marker = intersects[0].object;
            this.showMarkerPopup(marker.userData);
        }
    }
    
    showMarkerPopup(data) {
        const popup = document.getElementById('location-popup');
        const title = document.getElementById('popup-title');
        const country = document.getElementById('popup-country');
        const coords = document.getElementById('popup-coords');
        
        const typeLabels = {
            capital: 'Capital',
            major: 'Major City',
            city: 'City',
            village: 'Town/Village'
        };
        
        title.textContent = data.name;
        country.textContent = `${data.country} • ${typeLabels[data.type]}`;
        
        let coordsText = `${data.lat.toFixed(4)}°, ${data.lon.toFixed(4)}°`;
        if (data.population) {
            const popMillions = data.population / 1000000;
            const popThousands = data.population / 1000;
            
            if (data.population >= 1000000) {
                coordsText = `Population: ${popMillions.toFixed(1)}M\n${coordsText}`;
            } else {
                coordsText = `Population: ${Math.round(popThousands)}K\n${coordsText}`;
            }
        }
        
        coords.textContent = coordsText;
        coords.style.whiteSpace = 'pre-line';
        popup.classList.add('visible');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.render();
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    updateLoadingProgress(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
    }
    
    flyToLocation(lat, lon, zoom = 10) {
        if (window.globeControls) {
            window.globeControls.animateToLocation(lat, lon);
        }
    }
    
    getCenter() {
        const vector = new THREE.Vector3(0, 0, -1);
        vector.applyQuaternion(this.camera.quaternion);
        
        const lat = Math.asin(vector.y) * (180 / Math.PI);
        const lon = Math.atan2(vector.z, -vector.x) * (180 / Math.PI);
        
        return { lat: lat, lng: lon };
    }
    
    getZoom() {
        return this.camera.position.length();
    }
}
