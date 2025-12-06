/**
 * Globe rendering and 3D scene setup
 * Handles creation of Earth, atmosphere, stars, and markers
 */

class Globe {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.clouds = null;
        this.atmosphere = null;
        this.stars = null;
        this.markers = [];
        this.markerInstances = {}; // Store instanced meshes for each marker type
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Globe settings
        this.radius = 5;
        this.segments = 64;
        
        // Marker type configurations
        this.markerConfig = {
            capital: {
                size: 0.09,
                color: 0xff3333,
                minDistance: 20,
                pulseSpeed: 0.004,
                glowIntensity: 1.5
            },
            major: {
                size: 0.065,
                color: 0xff8c42,
                minDistance: 15,
                pulseSpeed: 0.003,
                glowIntensity: 1.2
            },
            city: {
                size: 0.045,
                color: 0xffd700,
                minDistance: 12,
                pulseSpeed: 0.0025,
                glowIntensity: 1.0
            },
            village: {
                size: 0.025,
                color: 0x90ee90,
                minDistance: 0,
                pulseSpeed: 0.002,
                glowIntensity: 0.8
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the 3D scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Create Earth
        this.createEarth();
        
        // Create clouds layer
        this.createClouds();
        
        // Create atmosphere glow
        this.createAtmosphere();
        
        // Create stars background
        this.createStars();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Add lighting to the scene
     */
    addLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light to simulate the sun
        // Positioned at an angle to create realistic day/night lighting
        const SUN_LIGHT_POSITION = { x: 5, y: 3, z: 5 };
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(SUN_LIGHT_POSITION.x, SUN_LIGHT_POSITION.y, SUN_LIGHT_POSITION.z);
        this.scene.add(sunLight);
    }
    
    /**
     * Create the Earth sphere with texture
     */
    createEarth() {
        const geometry = new THREE.SphereGeometry(this.radius, this.segments, this.segments);
        
        // Use a high-quality Earth texture from a CDN
        const textureLoader = new THREE.TextureLoader();
        
        // Day texture
        const earthTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
            () => {
                this.updateLoadingProgress(25);
            }
        );
        
        // Normal/Bump map for relief
        const bumpTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
            () => {
                this.updateLoadingProgress(40);
            }
        );
        
        // Specular map for ocean reflections
        const specularTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
            () => {
                this.updateLoadingProgress(55);
            }
        );
        
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.1,
            specularMap: specularTexture,
            specular: new THREE.Color(0x333333),
            shininess: 15,
        });
        
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
    }
    
    /**
     * Create cloud layer around Earth
     */
    createClouds() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.05, this.segments, this.segments);
        
        const textureLoader = new THREE.TextureLoader();
        const cloudTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
            () => {
                this.updateLoadingProgress(70);
            }
        );
        
        const material = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        
        this.clouds = new THREE.Mesh(geometry, material);
        this.scene.add(this.clouds);
    }
    
    /**
     * Create atmospheric glow effect
     */
    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.3, this.segments, this.segments);
        
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
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
        
        this.atmosphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.atmosphere);
    }
    
    /**
     * Create stars background
     */
    createStars() {
        const STAR_COUNT = 10000;
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            sizeAttenuation: true,
        });
        
        const starsVertices = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );
        
        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
        
        this.updateLoadingProgress(100);
    }
    
    /**
     * Add a marker at a specific location
     */
    addMarker(lat, lon, name, country, type = 'city', population = null) {
        const position = latLonToVector3(lat, lon, this.radius);
        
        // Create marker data object
        const markerData = {
            position: new THREE.Vector3(position.x, position.y, position.z),
            userData: { name, country, lat, lon, type, population },
            type: type,
            visible: true,
            opacity: 1.0
        };
        
        this.markers.push(markerData);
        return markerData;
    }
    
    /**
     * Initialize instanced meshes for all marker types
     */
    initializeInstancedMarkers() {
        // Group markers by type
        const markersByType = {
            capital: [],
            major: [],
            city: [],
            village: []
        };
        
        this.markers.forEach(marker => {
            if (markersByType[marker.type]) {
                markersByType[marker.type].push(marker);
            }
        });
        
        // Create instanced mesh for each type
        Object.keys(markersByType).forEach(type => {
            const markers = markersByType[type];
            if (markers.length === 0) return;
            
            const config = this.markerConfig[type];
            const geometry = new THREE.SphereGeometry(config.size, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.9,
            });
            
            const instancedMesh = new THREE.InstancedMesh(
                geometry,
                material,
                markers.length
            );
            
            // Set initial positions
            const matrix = new THREE.Matrix4();
            markers.forEach((marker, i) => {
                matrix.setPosition(marker.position);
                instancedMesh.setMatrixAt(i, matrix);
                instancedMesh.setColorAt(i, new THREE.Color(config.color));
            });
            
            instancedMesh.instanceMatrix.needsUpdate = true;
            if (instancedMesh.instanceColor) {
                instancedMesh.instanceColor.needsUpdate = true;
            }
            
            this.scene.add(instancedMesh);
            this.markerInstances[type] = {
                mesh: instancedMesh,
                markers: markers,
                geometry: geometry,
                material: material
            };
        });
    }
    
    /**
     * Update marker visibility based on camera distance (LOD system)
     */
    updateMarkerLOD(cameraDistance) {
        Object.keys(this.markerInstances).forEach(type => {
            const instance = this.markerInstances[type];
            const config = this.markerConfig[type];
            const markers = instance.markers;
            const mesh = instance.mesh;
            
            const matrix = new THREE.Matrix4();
            const scale = new THREE.Vector3();
            
            markers.forEach((marker, i) => {
                // Determine if marker should be visible based on distance
                let shouldBeVisible = cameraDistance <= config.minDistance || config.minDistance === 0;
                
                // For villages, only show when very close
                if (type === 'village') {
                    shouldBeVisible = cameraDistance < 12;
                }
                
                // Calculate target opacity with smooth fade
                const targetOpacity = shouldBeVisible ? 1.0 : 0.0;
                marker.opacity += (targetOpacity - marker.opacity) * 0.1;
                
                // Get current matrix
                mesh.getMatrixAt(i, matrix);
                matrix.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);
                
                // Calculate pulsing scale
                const pulseScale = 1 + Math.sin(Date.now() * config.pulseSpeed + i) * 0.2;
                const finalScale = marker.opacity * pulseScale;
                
                // Update scale based on opacity
                scale.set(finalScale, finalScale, finalScale);
                matrix.setPosition(marker.position);
                matrix.scale(scale);
                
                mesh.setMatrixAt(i, matrix);
            });
            
            mesh.instanceMatrix.needsUpdate = true;
            
            // Update overall visibility
            mesh.visible = markers.some(m => m.opacity > 0.01);
        });
    }
    
    /**
     * Remove all markers from the scene
     */
    clearMarkers() {
        // Dispose instanced meshes
        Object.keys(this.markerInstances).forEach(type => {
            const instance = this.markerInstances[type];
            this.scene.remove(instance.mesh);
            instance.geometry.dispose();
            instance.material.dispose();
        });
        
        this.markerInstances = {};
        this.markers = [];
    }
    
    /**
     * Rotate Earth and clouds slowly
     */
    animate() {
        if (this.earth) {
            this.earth.rotation.y += 0.0005;
        }
        if (this.clouds) {
            this.clouds.rotation.y += 0.0007;
        }
    }
    
    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
     * Get intersected markers from mouse position
     */
    getIntersectedMarker(mouseX, mouseY) {
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersections with all instanced meshes
        const allInstancedMeshes = Object.values(this.markerInstances).map(inst => inst.mesh);
        const intersects = this.raycaster.intersectObjects(allInstancedMeshes);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const instanceId = intersect.instanceId;
            
            // Find which type and get marker data
            for (const type in this.markerInstances) {
                const instance = this.markerInstances[type];
                if (instance.mesh === intersect.object) {
                    const marker = instance.markers[instanceId];
                    if (marker && marker.opacity > 0.5) {
                        return marker.userData;
                    }
                }
            }
        }
        
        return null;
    }
}
