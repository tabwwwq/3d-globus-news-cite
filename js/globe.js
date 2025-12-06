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
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Globe settings
        this.radius = 5;
        this.segments = 64;
        
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
        const earthTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
            () => {
                // Texture loaded successfully
                this.updateLoadingProgress(40);
            }
        );
        
        const bumpTexture = textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
            () => {
                this.updateLoadingProgress(60);
            }
        );
        
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.05,
            shininess: 10,
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
                this.updateLoadingProgress(80);
            }
        );
        
        const material = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
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
    addMarker(lat, lon, name, country) {
        const position = latLonToVector3(lat, lon, this.radius);
        
        // Create marker geometry (small sphere)
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.9,
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(position.x, position.y, position.z);
        
        // Store location data with marker
        marker.userData = { name, country, lat, lon };
        
        this.scene.add(marker);
        this.markers.push(marker);
        
        return marker;
    }
    
    /**
     * Remove all markers from the scene
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            this.scene.remove(marker);
            marker.geometry.dispose();
            marker.material.dispose();
        });
        this.markers = [];
    }
    
    /**
     * Rotate Earth and clouds slowly
     */
    animate() {
        if (this.earth) {
            this.earth.rotation.y += 0.001;
        }
        if (this.clouds) {
            this.clouds.rotation.y += 0.0012;
        }
        
        // Make markers pulse
        this.markers.forEach((marker, index) => {
            const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.3;
            marker.scale.set(scale, scale, scale);
        });
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
        const intersects = this.raycaster.intersectObjects(this.markers);
        
        return intersects.length > 0 ? intersects[0].object : null;
    }
}
