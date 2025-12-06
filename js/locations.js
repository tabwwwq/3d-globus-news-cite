/**
 * Location data for major cities around the world
 * Contains city names, coordinates, and country information
 */

const LOCATIONS = [
    // North America
    { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060 },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437 },
    { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298 },
    { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },
    
    // South America
    { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
    { name: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428 },
    { name: "Bogotá", country: "Colombia", lat: 4.7110, lon: -74.0721 },
    
    // Europe
    { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
    { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
    { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
    { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
    { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
    { name: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738 },
    { name: "Athens", country: "Greece", lat: 37.9838, lon: 23.7275 },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
    
    // Asia
    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
    { name: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
    { name: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694 },
    { name: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780 },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
    { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
    { name: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
    { name: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
    { name: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
    
    // Africa
    { name: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
    { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792 },
    { name: "Johannesburg", country: "South Africa", lat: -26.2041, lon: 28.0473 },
    { name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219 },
    { name: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898 },
    
    // Oceania
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
    { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
    { name: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633 },
];

/**
 * Search locations by name
 * @param {string} query - Search query string
 * @returns {Array} Array of matching locations
 */
function searchLocations(query) {
    if (!query || query.trim().length === 0) {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    return LOCATIONS.filter(location => 
        location.name.toLowerCase().includes(searchTerm) ||
        location.country.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
}

/**
 * Get a random location
 * @returns {Object} Random location object
 */
function getRandomLocation() {
    return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

/**
 * Convert latitude/longitude to 3D coordinates
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {number} radius - Sphere radius
 * @returns {Object} Object with x, y, z coordinates
 */
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return { x, y, z };
}

/**
 * Convert 3D coordinates to latitude/longitude
 * @param {Object} vector3 - Object with x, y, z coordinates
 * @param {number} radius - Sphere radius
 * @returns {Object} Object with lat and lon in degrees
 */
function vector3ToLatLon(vector3, radius) {
    const lat = 90 - (Math.acos(vector3.y / radius)) * 180 / Math.PI;
    const lon = ((270 + (Math.atan2(vector3.x, vector3.z)) * 180 / Math.PI) % 360) - 180;
    
    return { lat, lon };
}
