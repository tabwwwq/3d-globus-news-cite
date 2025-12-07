/**
 * Main application logic
 * Initializes the 3D globe, controls, and UI interactions
 */

let globe;
let controls;

function init() {
    const container = document.getElementById('container');
    
    globe = new Globe(container);
    controls = new GlobeControls(globe.camera, globe.renderer.domElement, globe);
    
    addCityMarkers();
    setupUIListeners();
    
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
}

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
    
    globe.initializeInstancedMarkers();
}

window.updateMouseCoordinates = function(lat, lng) {
    document.getElementById('lat-display').textContent = lat.toFixed(2) + '°';
    document.getElementById('lon-display').textContent = lng.toFixed(2) + '°';
};

function setupUIListeners() {
    document.getElementById('zoom-in').addEventListener('click', () => {
        controls.zoomIn();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        controls.zoomOut();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
        controls.reset();
    });
    
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
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('visible');
        }
    });
    
    const closePopupBtn = document.getElementById('close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            hideLocationPopup();
        });
    }
}

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

function navigateToLocation(location) {
    controls.animateToLocation(location.lat, location.lon);
}

function hideLocationPopup() {
    const popup = document.getElementById('location-popup');
    popup.classList.remove('visible');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
