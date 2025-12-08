/**
 * BBC News Integration Module
 * Fetches BBC news via RSS feed proxy and matches articles to cities
 */

class NewsManager {
    constructor() {
        // BBC World News RSS feed via rss2json.com proxy (to bypass CORS)
        // Note: Using third-party proxy service. For production, consider:
        // - Implementing own CORS proxy on backend
        // - Using official BBC News API with proper authentication
        // - Caching news on server-side to reduce API dependency
        this.RSS_PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/world/rss.xml';
        
        // News storage: { cityName: [news items] }
        this.cityNews = {};
        
        // Cache settings
        this.lastFetchTime = null;
        this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
        
        // Loading state
        this.isLoading = false;
        this.fetchError = null;
        
        // Auto-refresh interval ID for cleanup
        this.refreshIntervalId = null;
        
        // City names from LOCATIONS for matching
        this.cityNames = [];
        this.initializeCityNames();
    }
    
    /**
     * Extract city names from LOCATIONS array for matching
     */
    initializeCityNames() {
        if (typeof LOCATIONS !== 'undefined') {
            this.cityNames = LOCATIONS.map(loc => ({
                name: loc.name,
                country: loc.country,
                lat: loc.lat,
                lon: loc.lon
            }));
        }
    }
    
    /**
     * Fetch news from BBC RSS feed
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    async fetchNews() {
        // Check if cache is still valid
        if (this.lastFetchTime && (Date.now() - this.lastFetchTime) < this.CACHE_DURATION) {
            console.log('Using cached news data');
            return true;
        }
        
        if (this.isLoading) {
            console.log('News fetch already in progress');
            return false;
        }
        
        this.isLoading = true;
        this.fetchError = null;
        
        try {
            console.log('Fetching BBC news...');
            const response = await fetch(this.RSS_PROXY_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error('RSS feed returned error status');
            }
            
            // Process news items
            this.processNewsItems(data.items);
            
            this.lastFetchTime = Date.now();
            this.isLoading = false;
            
            console.log(`Successfully fetched ${data.items.length} news items`);
            console.log(`Matched news to ${Object.keys(this.cityNews).length} cities`);
            
            return true;
            
        } catch (error) {
            console.error('Error fetching news:', error);
            this.fetchError = error.message;
            this.isLoading = false;
            return false;
        }
    }
    
    /**
     * Process news items and match them to cities
     * @param {Array} items - News items from RSS feed
     */
    processNewsItems(items) {
        // Clear previous news
        this.cityNews = {};
        
        items.forEach(item => {
            // Combine title and description for better city matching
            const searchText = `${item.title} ${item.description}`.toLowerCase();
            
            // Check each city name
            this.cityNames.forEach(city => {
                // Match city name (case-insensitive, whole word)
                const cityNameLower = city.name.toLowerCase();
                
                // Create regex for whole word matching
                // This prevents partial matches like "york" matching "New York"
                const regex = new RegExp(`\\b${this.escapeRegex(cityNameLower)}\\b`, 'i');
                
                if (regex.test(searchText)) {
                    // Initialize array if first news for this city
                    if (!this.cityNews[city.name]) {
                        this.cityNews[city.name] = [];
                    }
                    
                    // Add news item (if not duplicate)
                    const newsExists = this.cityNews[city.name].some(
                        n => n.link === item.link
                    );
                    
                    if (!newsExists) {
                        this.cityNews[city.name].push({
                            title: item.title,
                            link: item.link,
                            pubDate: item.pubDate,
                            description: this.stripHtmlTags(item.description)
                        });
                    }
                }
            });
        });
        
        // Sort news by date (newest first) and limit to 5 per city
        Object.keys(this.cityNews).forEach(cityName => {
            this.cityNews[cityName].sort((a, b) => 
                new Date(b.pubDate) - new Date(a.pubDate)
            );
            this.cityNews[cityName] = this.cityNews[cityName].slice(0, 5);
        });
    }
    
    /**
     * Escape special regex characters in string
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Strip HTML tags from text (XSS-safe)
     * @param {string} html - HTML string
     * @returns {string} Plain text
     */
    stripHtmlTags(html) {
        // Use DOMParser for safe HTML parsing
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
    
    /**
     * Get news for a specific city
     * @param {string} cityName - Name of the city
     * @returns {Array} Array of news items for the city
     */
    getNewsForCity(cityName) {
        return this.cityNews[cityName] || [];
    }
    
    /**
     * Check if news data needs refresh
     * @returns {boolean} True if refresh needed
     */
    needsRefresh() {
        if (!this.lastFetchTime) return true;
        return (Date.now() - this.lastFetchTime) >= this.CACHE_DURATION;
    }
    
    /**
     * Start automatic news refresh timer
     */
    startAutoRefresh() {
        // Fetch immediately
        this.fetchNews();
        
        // Set up interval for automatic refresh and store ID for cleanup
        this.refreshIntervalId = setInterval(() => {
            if (this.needsRefresh()) {
                console.log('Auto-refreshing news...');
                this.fetchNews();
            }
        }, 60000); // Check every minute
    }
    
    /**
     * Stop automatic news refresh and cleanup
     */
    stopAutoRefresh() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }
    
    /**
     * Get loading state
     * @returns {boolean} True if currently loading
     */
    isLoadingNews() {
        return this.isLoading;
    }
    
    /**
     * Get last fetch error
     * @returns {string|null} Error message or null
     */
    getError() {
        return this.fetchError;
    }
    
    /**
     * Get total number of cities with news
     * @returns {number} Number of cities with news
     */
    getCitiesWithNewsCount() {
        return Object.keys(this.cityNews).length;
    }
}

// Create global instance
const newsManager = new NewsManager();
