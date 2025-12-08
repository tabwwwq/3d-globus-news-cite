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
        
        // Debug mode (set to false in production)
        this.DEBUG = false;
        
        // News storage: { cityName: [news items] }
        this.cityNews = {};
        
        // Cache settings
        this.lastFetchTime = null;
        this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
        this.AUTO_REFRESH_INTERVAL = 60 * 1000; // Check every minute
        
        // Loading state
        this.isLoading = false;
        this.fetchError = null;
        
        // Auto-refresh interval ID for cleanup
        this.refreshIntervalId = null;
        
        // Page visibility tracking
        this.isPageVisible = true;
        this.setupVisibilityTracking();
        
        // City names from LOCATIONS for matching
        this.cityNames = [];
        this.cityRegexMap = new Map(); // Pre-compiled regex patterns
        this.initializeCityNames();
    }
    
    /**
     * Extract city names from LOCATIONS array for matching
     * Pre-compiles regex patterns for performance
     */
    initializeCityNames() {
        if (typeof LOCATIONS !== 'undefined') {
            this.cityNames = LOCATIONS.map(loc => ({
                name: loc.name,
                country: loc.country,
                lat: loc.lat,
                lon: loc.lon
            }));
            
            // Pre-compile regex patterns for all cities
            this.cityNames.forEach(city => {
                const cityNameLower = city.name.toLowerCase();
                const regex = new RegExp(`\\b${this.escapeRegex(cityNameLower)}\\b`, 'i');
                this.cityRegexMap.set(city.name, regex);
            });
        }
    }
    
    /**
     * Setup page visibility tracking to pause auto-refresh when tab is hidden
     */
    setupVisibilityTracking() {
        if (typeof document.hidden !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                this.isPageVisible = !document.hidden;
                if (this.DEBUG) {
                    console.log(`Page visibility changed: ${this.isPageVisible ? 'visible' : 'hidden'}`);
                }
            });
        }
    }
    
    /**
     * Fetch news from BBC RSS feed
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    async fetchNews() {
        // Check if cache is still valid
        if (this.lastFetchTime && (Date.now() - this.lastFetchTime) < this.CACHE_DURATION) {
            if (this.DEBUG) console.log('Using cached news data');
            return true;
        }
        
        if (this.isLoading) {
            if (this.DEBUG) console.log('News fetch already in progress');
            return false;
        }
        
        this.isLoading = true;
        this.fetchError = null;
        
        try {
            if (this.DEBUG) console.log('Fetching BBC news...');
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(this.RSS_PROXY_URL, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Validate content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response content type');
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error('RSS feed returned error status');
            }
            
            // Process news items
            this.processNewsItems(data.items);
            
            this.lastFetchTime = Date.now();
            this.isLoading = false;
            
            if (this.DEBUG) {
                console.log(`Successfully fetched ${data.items.length} news items`);
                console.log(`Matched news to ${Object.keys(this.cityNews).length} cities`);
            }
            
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
            
            // Check each city name using pre-compiled regex
            this.cityNames.forEach(city => {
                const regex = this.cityRegexMap.get(city.name);
                
                if (regex && regex.test(searchText)) {
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
        
        // Validate no script elements present
        if (doc.querySelector('script')) {
            console.warn('Script tag detected in HTML content, sanitizing');
            return '';
        }
        
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
            // Only refresh if page is visible and cache needs refresh
            if (this.isPageVisible && this.needsRefresh()) {
                if (this.DEBUG) console.log('Auto-refreshing news...');
                this.fetchNews();
            }
        }, this.AUTO_REFRESH_INTERVAL);
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
