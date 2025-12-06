/**
 * Main application logic
 * Initializes the globe, controls, and UI interactions
 */

// Global variables
let globe;
let controls;
let animationId;
let fps = 0;
let lastTime = Date.now();
let frameCount = 0;

/**
 * Initialize the application
 */
function init() {
    // Create container
    const container = document.getElementById('container');
    
    // Initialize globe
    globe = new Globe(container);
    
    // Initialize controls
    controls = new GlobeControls(globe.camera, container, globe);
    
    // Add markers for all major cities
    addCityMarkers();
    
    // Setup UI event listeners
    setupUIListeners();
    
    // Start animation loop
    animate();
    
    // Hide loading screen after a short delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
}

/**
 * Add city markers to the globe
 */
function addCityMarkers() {
    LOCATIONS.forEach(location => {
        globe.addMarker(
            location.lat, 
            location.lon, 
            location.name, 
            location.country, 
            location.type || 'city',
            location.population
        );
    });
    
    // Initialize instanced meshes after all markers are added
    globe.initializeInstancedMarkers();
}

/**
 * Setup UI event listeners
 */
function setupUIListeners() {
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        controls.zoomIn();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        controls.zoomOut();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
        controls.reset();
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.trim().length > 0) {
            displaySearchResults(searchLocations(query));
        } else {
            searchResults.classList.remove('visible');
        }
    });
    
    searchBtn.addEventListener('click', () => {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Click outside to close search results
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('visible');
        }
    });
    
    // Marker click detection
    const container = document.getElementById('container');
    container.addEventListener('click', (e) => {
        const markerData = globe.getIntersectedMarker(e.clientX, e.clientY);
        if (markerData) {
            showLocationPopup(markerData);
        }
    });
    
    // Close popup
    document.getElementById('close-popup').addEventListener('click', () => {
        hideLocationPopup();
    });
    
    // Update coordinates display
    setInterval(() => {
        updateCoordinatesDisplay();
    }, 100);
}

/**
 * Perform search and navigate to first result
 */
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query.length > 0) {
        const results = searchLocations(query);
        if (results.length > 0) {
            const location = results[0];
            navigateToLocation(location);
            document.getElementById('search-results').classList.remove('visible');
            searchInput.value = '';
        }
    }
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.classList.remove('visible');
        return;
    }
    
    searchResults.innerHTML = '';
    results.forEach(location => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <div class="city-name">${location.name}</div>
            <div class="country-name">${location.country}</div>
        `;
        item.addEventListener('click', () => {
            navigateToLocation(location);
            searchResults.classList.remove('visible');
            document.getElementById('search-input').value = '';
        });
        searchResults.appendChild(item);
    });
    
    searchResults.classList.add('visible');
}

/**
 * Navigate to a specific location
 */
function navigateToLocation(location) {
    controls.animateToLocation(location.lat, location.lon);
    showLocationPopup(location);
}

/**
 * Show location popup
 */
function showLocationPopup(location) {
    const popup = document.getElementById('location-popup');
    const title = document.getElementById('popup-title');
    const country = document.getElementById('popup-country');
    const coords = document.getElementById('popup-coords');
    
    title.textContent = location.name;
    
    // Add type and population info
    let countryText = location.country;
    if (location.type) {
        const typeLabels = {
            capital: 'Capital',
            major: 'Major City',
            city: 'City',
            village: 'Town/Village'
        };
        countryText += ` • ${typeLabels[location.type]}`;
    }
    if (location.population) {
        const popFormatted = (location.population / 1000000).toFixed(1);
        if (location.population >= 1000000) {
            countryText += ` • ${popFormatted}M people`;
        } else {
            countryText += ` • ${Math.round(location.population / 1000)}K people`;
        }
    }
    
    country.textContent = countryText;
    coords.textContent = `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°`;
    
    popup.classList.add('visible');
}

/**
 * Hide location popup
 */
function hideLocationPopup() {
    const popup = document.getElementById('location-popup');
    popup.classList.remove('visible');
}

/**
 * Update coordinates display based on camera view
 */
function updateCoordinatesDisplay() {
    // Calculate the center point of the globe based on camera rotation
    const lat = -(controls.currentRotation.x * 180 / Math.PI);
    const lon = -(controls.currentRotation.y * 180 / Math.PI);
    
    // Normalize longitude to -180 to 180
    let normalizedLon = ((lon + 180) % 360) - 180;
    if (normalizedLon < -180) normalizedLon += 360;
    
    // Update display
    document.getElementById('lat-display').textContent = lat.toFixed(2) + '°';
    document.getElementById('lon-display').textContent = normalizedLon.toFixed(2) + '°';
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

/**
 * Calculate FPS
 */
function calculateFPS() {
    frameCount++;
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
        fps = Math.round((frameCount * 1000) / elapsed);
        document.getElementById('fps-display').textContent = fps;
        frameCount = 0;
        lastTime = currentTime;
    }
}

/**
 * Animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate globe rotation
    globe.animate();
    
    // Update marker LOD based on camera distance
    const cameraDistance = globe.camera.position.z;
    globe.updateMarkerLOD(cameraDistance);
    
    // Render scene
    globe.render();
    
    // Calculate FPS
    calculateFPS();
}

/**
 * Handle errors
 */
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    } else {
        if (animationId === null) {
            animate();
        }
    }
});
