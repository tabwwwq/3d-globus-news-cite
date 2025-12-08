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
        
        // Store base sizes for scaling (derived from markerConfig)
        this.baseMarkerSizes = {
            capital: this.markerConfig.capital.size,
            major: this.markerConfig.major.size,
            city: this.markerConfig.city.size,
            village: this.markerConfig.village.size
        };
        
        // Multi-level texture quality management
        this.textures = {
            low: null,      // 2K texture for far view
            medium: null,   // 4K texture for medium distance
            high: null      // 8K texture for close view
        };
        this.currentTextureQuality = 'low';
        this.texturesLoaded = {
            low: false,
            medium: false,
            high: false
        };
        
        // Additional texture layers
        this.nightLightsTexture = null;
        this.specularMap = null;
        this.cloudsTexture = null;
        this.cloudsMesh = null;
        
        // Scaling and LOD configuration
        this.minDistance = 0.8;      // Minimum camera distance (closer zoom)
        this.maxDistance = 6;        // Maximum camera distance
        this.minScaleFactor = 0.4;   // Scale at closest zoom
        this.scaleRange = 0.6;       // Scale range (max - min)
        
        // Texture quality thresholds based on camera distance
        this.textureThresholds = {
            high: 2.0,    // Below 2.0 units: use 8K texture
            medium: 4.0   // Between 2.0-4.0: use 4K texture, above 4.0: use 2K
        };
        
        // Geometry LOD configuration
        this.geometryLOD = {
            far: { segments: 64 },      // > 4.0 units
            medium: { segments: 128 },  // 2.0 - 4.0 units
            near: { segments: 256 }     // < 2.0 units
        };
        this.currentGeometryLevel = 'far';
        
        // Pre-create geometry pool to avoid recreation during zoom
        this.geometryPool = {
            far: new THREE.SphereGeometry(1, 64, 64),
            medium: new THREE.SphereGeometry(1, 128, 128),
            near: new THREE.SphereGeometry(1, 256, 256)
        };
        
        // Border manager for country boundaries
        this.borderManager = null;
        
        this.init();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011); // Darker space background
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 3;
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
        
        // Enable HDR tone mapping for better colors
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Enable physically correct lighting (compatible with Three.js r150+)
        this.renderer.useLegacyLights = false;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Create a group to hold globe and all markers
        this.globeGroup = new THREE.Group();
        this.scene.add(this.globeGroup);
        
        this.addLights();
        this.createGlobe();
        this.createAtmosphere();
        this.initBorders();
        
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onMouseClick(e));
        
        this.updateLoadingProgress(100);
        this.animate();
    }
    
    addLights() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main sun light with enhanced intensity and shadows
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.sunLight.position.set(5, 3, 5);
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
        
        // Subtle fill light to soften shadows
        const fillLight = new THREE.DirectionalLight(0x8080ff, 0.2);
        fillLight.position.set(-5, -3, -5);
        this.scene.add(fillLight);
        
        // Hemisphere light for atmospheric effect
        const hemisphereLight = new THREE.HemisphereLight(0x8080ff, 0x080820, 0.4);
        this.scene.add(hemisphereLight);
    }
    
    createGlobe() {
        // Start with high detail geometry for better quality
        const geometry = new THREE.SphereGeometry(1, 128, 128);
        
        // Create advanced material with multiple texture layers
        const material = new THREE.MeshPhongMaterial({
            color: 0x2a5599,  // Ocean blue as fallback
            emissive: 0x0a1122,
            specular: new THREE.Color(0x4488aa),
            shininess: 25,
            transparent: false
        });
        
        // Load progressive textures with error handling
        const textureLoader = new THREE.TextureLoader();
        
        // Try to load low quality texture first (2K - quick load)
        // Using local path first, fallback to CDN
        const texturePaths = {
            low: ['textures/earth-blue-marble.jpg', 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'],
            medium: ['textures/earth-day.jpg', 'https://unpkg.com/three-globe/example/img/earth-day.jpg'],
            high: ['textures/earth-day.jpg', 'https://unpkg.com/three-globe/example/img/earth-day.jpg'],
            bump: ['textures/earth-topology.png', 'https://unpkg.com/three-globe/example/img/earth-topology.png'],
            specular: ['textures/earth-water.png', 'https://unpkg.com/three-globe/example/img/earth-water.png'],
            night: ['textures/earth-night.jpg', 'https://unpkg.com/three-globe/example/img/earth-night.jpg'],
            clouds: ['textures/earth-clouds.png', 'https://unpkg.com/three-globe/example/img/earth-clouds.png']
        };
        
        // Helper function to try loading from multiple paths
        const loadTextureWithFallback = (paths, onSuccess, onError) => {
            let currentIndex = 0;
            
            const tryLoad = () => {
                if (currentIndex >= paths.length) {
                    if (onError) onError();
                    return;
                }
                
                textureLoader.load(
                    paths[currentIndex],
                    onSuccess,
                    undefined,
                    () => {
                        currentIndex++;
                        tryLoad();
                    }
                );
            };
            
            tryLoad();
        };
        
        // Load low quality texture
        loadTextureWithFallback(
            texturePaths.low,
            (texture) => {
                texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                material.map = texture;
                material.color = new THREE.Color(0xffffff);
                material.emissive = new THREE.Color(0x000000);
                material.needsUpdate = true;
                this.textures.low = texture;
                this.texturesLoaded.low = true;
                console.log('Low quality texture loaded (2K)');
            },
            () => {
                console.warn('Low quality texture failed to load from all sources, using procedural colors');
                // Keep the nice blue/green procedural colors as fallback
            }
        );
        
        // Load bump map for terrain relief
        loadTextureWithFallback(
            texturePaths.bump,
            (texture) => {
                texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                material.bumpMap = texture;
                material.bumpScale = 0.08;
                material.needsUpdate = true;
                console.log('Bump map loaded');
            },
            () => {
                console.warn('Bump map failed to load from all sources');
            }
        );
        
        // Load specular map for water reflections
        loadTextureWithFallback(
            texturePaths.specular,
            (texture) => {
                texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                this.specularMap = texture;
                material.specularMap = texture;
                material.shininess = 15;
                material.needsUpdate = true;
                console.log('Specular map loaded');
            },
            () => {
                console.warn('Specular map failed to load from all sources');
            }
        );
        
        // Load night lights texture
        loadTextureWithFallback(
            texturePaths.night,
            (texture) => {
                texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                this.nightLightsTexture = texture;
                console.log('Night lights texture loaded');
            },
            () => {
                console.warn('Night lights texture failed to load from all sources');
            }
        );
        
        this.globe = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.globe);
        
        // Store texture paths for later use
        this.texturePaths = texturePaths;
        
        // Create clouds layer
        this.createCloudsLayer();
        
        this.updateLoadingProgress(75);
    }
    
    
    createCloudsLayer() {
        const geometry = new THREE.SphereGeometry(1.01, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const cloudPaths = this.texturePaths?.clouds || ['textures/earth-clouds.png', 'https://unpkg.com/three-globe/example/img/earth-clouds.png'];
        
        // Use the existing helper function
        const loadTextureWithFallback = (paths, onSuccess, onError) => {
            let currentIndex = 0;
            const textureLoader = new THREE.TextureLoader();
            
            const tryLoad = () => {
                if (currentIndex >= paths.length) {
                    if (onError) onError();
                    return;
                }
                
                textureLoader.load(
                    paths[currentIndex],
                    onSuccess,
                    undefined,
                    () => {
                        currentIndex++;
                        tryLoad();
                    }
                );
            };
            
            tryLoad();
        };
        
        loadTextureWithFallback(
            cloudPaths,
            (texture) => {
                texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                material.map = texture;
                material.needsUpdate = true;
                this.cloudsTexture = texture;
                console.log('Clouds texture loaded');
            },
            () => {
                console.warn('Clouds texture failed to load from all sources');
            }
        );
        
        this.cloudsMesh = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.cloudsMesh);
    }
    
    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(1.15, 128, 128);
        
        // Enhanced atmosphere shader with realistic scattering
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Calculate fresnel-like atmospheric glow
                    vec3 viewDirection = normalize(-vPosition);
                    float intensity = pow(0.7 - dot(vNormal, viewDirection), 3.0);
                    
                    // Gradient from blue to purple at edge
                    vec3 blueColor = vec3(0.3, 0.6, 1.0);
                    vec3 purpleColor = vec3(0.6, 0.3, 1.0);
                    vec3 atmosphereColor = mix(blueColor, purpleColor, intensity * 0.5);
                    
                    // Add atmospheric scattering effect
                    float scatter = pow(intensity, 0.5);
                    
                    gl_FragColor = vec4(atmosphereColor, 1.0) * (intensity + scatter * 0.3);
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        
        this.atmosphere = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.atmosphere);
    }
    
    /**
     * Initialize country borders system
     */
    initBorders() {
        // Create border manager and load border data
        this.borderManager = new BorderManager(this);
        this.borderManager.init();
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
        
        // Display news for this city
        this.displayCityNews(data.name);
        
        popup.classList.add('visible');
    }
    
    /**
     * Display news for a specific city in the popup
     * @param {string} cityName - Name of the city
     */
    displayCityNews(cityName) {
        const newsSection = document.getElementById('popup-news-section');
        const newsLoading = document.getElementById('news-loading');
        const newsList = document.getElementById('news-list');
        const newsEmpty = document.getElementById('news-empty');
        
        // Show news section
        if (newsSection) {
            newsSection.style.display = 'block';
        }
        
        // Check if newsManager is available
        if (typeof newsManager === 'undefined') {
            newsLoading.style.display = 'none';
            newsList.innerHTML = '';
            newsEmpty.style.display = 'block';
            return;
        }
        
        // Show loading state if news is being fetched
        if (newsManager.isLoadingNews()) {
            newsLoading.style.display = 'flex';
            newsList.innerHTML = '';
            newsEmpty.style.display = 'none';
            return;
        }
        
        // Get news for this city
        const cityNews = newsManager.getNewsForCity(cityName);
        
        // Hide loading
        newsLoading.style.display = 'none';
        
        // Display news or empty message
        if (cityNews.length === 0) {
            newsList.innerHTML = '';
            newsEmpty.style.display = 'block';
        } else {
            newsEmpty.style.display = 'none';
            
            // Build news list HTML
            const newsHTML = cityNews.map(news => `
                <div class="news-item">
                    <a href="${news.link}" target="_blank" rel="noopener noreferrer">
                        <div class="news-title">${news.title}</div>
                        <div class="news-date">${this.formatNewsDate(news.pubDate)}</div>
                    </a>
                </div>
            `).join('');
            
            newsList.innerHTML = newsHTML;
        }
    }
    
    /**
     * Format news date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatNewsDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffHours < 1) {
            return 'Just now';
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Slowly rotate clouds for realism
        if (this.cloudsMesh) {
            this.cloudsMesh.rotation.y += 0.0001;
        }
        
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
    
    /**
     * Update marker scales based on camera distance
     * @param {number} cameraDistance - Current camera distance from globe
     */
    updateMarkerScales(cameraDistance) {
        // Guard against division by zero
        if (this.minDistance === this.maxDistance) {
            console.warn('minDistance and maxDistance cannot be equal');
            return;
        }
        
        // Calculate scale factor: closer camera = smaller markers
        // At minDistance (1.2), scale should be minScaleFactor (0.4)
        // At maxDistance (6), scale should be 1.0
        const normalizedDistance = (cameraDistance - this.minDistance) / (this.maxDistance - this.minDistance);
        // Clamp normalizedDistance to [0, 1] to handle out-of-bounds camera distances
        const clampedDistance = Math.max(0, Math.min(1, normalizedDistance));
        const scaleFactor = this.minScaleFactor + (clampedDistance * this.scaleRange);
        
        // Update all marker meshes
        this.markerMeshes.forEach((markerMesh) => {
            // Update the geometry scale directly with scaleFactor
            markerMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        });
        
        // Update config for new markers
        Object.keys(this.markerConfig).forEach(type => {
            this.markerConfig[type].size = this.baseMarkerSizes[type] * scaleFactor;
        });
    }
    
    /**
     * Update texture quality based on camera distance with multi-level LOD
     * @param {number} cameraDistance - Current camera distance from globe
     */
    updateTextureQuality(cameraDistance) {
        let targetQuality;
        
        // Determine target quality level based on distance thresholds
        if (cameraDistance <= this.textureThresholds.high) {
            targetQuality = 'high';
        } else if (cameraDistance <= this.textureThresholds.medium) {
            targetQuality = 'medium';
        } else {
            targetQuality = 'low';
        }
        
        // Only switch if quality level changed
        if (targetQuality === this.currentTextureQuality) {
            return;
        }
        
        // Handle quality upgrade/downgrade
        if (targetQuality === 'high' && !this.texturesLoaded.high) {
            this.loadHighQualityTexture();
        } else if (targetQuality === 'medium' && !this.texturesLoaded.medium) {
            this.loadMediumQualityTexture();
        }
        
        // Switch texture if already loaded
        if (this.texturesLoaded[targetQuality] && this.textures[targetQuality]) {
            this.globe.material.map = this.textures[targetQuality];
            this.globe.material.needsUpdate = true;
            this.currentTextureQuality = targetQuality;
            console.log(`Switched to ${targetQuality} quality texture`);
        }
    }
    
    /**
     * Load medium quality texture (4K) on demand
     */
    loadMediumQualityTexture() {
        if (this.texturesLoaded.medium) return;
        
        this.texturesLoaded.medium = true; // Prevent multiple loads
        
        const textureLoader = new THREE.TextureLoader();
        const paths = this.texturePaths?.medium || ['textures/earth-day.jpg', 'https://unpkg.com/three-globe/example/img/earth-day.jpg'];
        
        const tryLoadMedium = (index = 0) => {
            if (index >= paths.length) {
                console.warn('Medium quality texture failed to load from all sources');
                return;
            }
            
            textureLoader.load(
                paths[index],
                (texture) => {
                    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    this.textures.medium = texture;
                    
                    // Apply if we're at medium distance
                    const currentDistance = this.camera.position.length();
                    if (currentDistance > this.textureThresholds.high && 
                        currentDistance <= this.textureThresholds.medium) {
                        this.globe.material.map = texture;
                        this.globe.material.needsUpdate = true;
                        this.currentTextureQuality = 'medium';
                    }
                    console.log('Medium quality texture loaded (4K)');
                },
                undefined,
                () => {
                    tryLoadMedium(index + 1);
                }
            );
        };
        
        tryLoadMedium();
    }
    
    /**
     * Load high quality texture (8K) on demand
     */
    loadHighQualityTexture() {
        if (this.texturesLoaded.high) return;
        
        this.texturesLoaded.high = true; // Prevent multiple loads
        
        const textureLoader = new THREE.TextureLoader();
        const paths = this.texturePaths?.high || ['textures/earth-day.jpg', 'https://unpkg.com/three-globe/example/img/earth-day.jpg'];
        
        const tryLoadHigh = (index = 0) => {
            if (index >= paths.length) {
                console.warn('High quality texture failed to load from all sources');
                return;
            }
            
            textureLoader.load(
                paths[index],
                (texture) => {
                    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    this.textures.high = texture;
                    
                    // Apply if we're zoomed in close
                    if (this.camera.position.length() <= this.textureThresholds.high) {
                        this.globe.material.map = texture;
                        this.globe.material.needsUpdate = true;
                        this.currentTextureQuality = 'high';
                    }
                    console.log('High quality texture loaded (8K equivalent)');
                },
                undefined,
                () => {
                    tryLoadHigh(index + 1);
                }
            );
        };
        
        tryLoadHigh();
    }
    
    /**
     * Update geometry detail based on camera distance (dynamic LOD)
     * Uses pre-created geometry pool to avoid recreation overhead
     * @param {number} cameraDistance - Current camera distance from globe
     */
    updateGeometryLOD(cameraDistance) {
        let targetLevel;
        
        if (cameraDistance <= this.textureThresholds.high) {
            targetLevel = 'near';
        } else if (cameraDistance <= this.textureThresholds.medium) {
            targetLevel = 'medium';
        } else {
            targetLevel = 'far';
        }
        
        // Only update if level changed
        if (targetLevel === this.currentGeometryLevel) {
            return;
        }
        
        // Use pre-created geometry from pool (no disposal needed)
        this.globe.geometry = this.geometryPool[targetLevel];
        this.currentGeometryLevel = targetLevel;
        
        const segments = this.geometryLOD[targetLevel].segments;
        console.log(`Updated geometry to ${targetLevel} detail (${segments}x${segments} segments)`);
        
        // Update border LOD to match geometry level
        if (this.borderManager) {
            this.borderManager.updateBorderLOD(cameraDistance);
        }
    }
}
