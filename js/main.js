/**
 * Main application logic
 * Initializes the map, controls, and UI interactions
 */

// Global variables
let globe;
let controls;

/**
 * Initialize the application
 */
function init() {
    // Create container
    const container = document.getElementById('container');
    
    // Initialize map
    globe = new Globe(container);
    
    // Initialize controls (simplified for Leaflet)
    controls = new GlobeControls(null, container, globe);
    
    // Add markers for all major cities
    addCityMarkers();
    
    // Setup UI event listeners
    setupUIListeners();
    
    // Hide loading screen after a short delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);
}

/**
 * Add city markers to the map
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
    
    // Initialize markers (compatibility)
    globe.initializeInstancedMarkers();
}

/**
 * Global function to update mouse coordinates
 */
window.updateMouseCoordinates = function(lat, lng) {
    document.getElementById('lat-display').textContent = lat.toFixed(2) + '°';
    document.getElementById('lon-display').textContent = lng.toFixed(2) + '°';
};

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
    
    // Marker click is handled by Leaflet popups now
    // No need for manual click detection
    
    // Close popup (legacy - Leaflet handles this)
    const closePopupBtn = document.getElementById('close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            hideLocationPopup();
        });
    }
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
 * Navigate to a specific location
 */
function navigateToLocation(location) {
    controls.animateToLocation(location.lat, location.lon);
    // Leaflet popups are handled by the marker itself
}

/**
 * Show location popup (legacy - Leaflet handles popups)
 */
function showLocationPopup(location) {
    // Not used with Leaflet - markers have built-in popups
}

/**
 * Hide location popup (legacy)
 */
function hideLocationPopup() {
    // Not used with Leaflet
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
