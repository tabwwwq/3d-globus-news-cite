/**
 * Location data for cities around the world
 * Contains city names, coordinates, country information, and classification
 */

const LOCATIONS = [
    // === CAPITALS (50+) ===
    // North America
    { name: "Washington D.C.", country: "USA", lat: 38.9072, lon: -77.0369, type: "capital", population: 700000 },
    { name: "Ottawa", country: "Canada", lat: 45.4215, lon: -75.6972, type: "capital", population: 1000000 },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332, type: "capital", population: 9200000 },
    { name: "Havana", country: "Cuba", lat: 23.1136, lon: -82.3666, type: "capital", population: 2100000 },
    { name: "Kingston", country: "Jamaica", lat: 17.9714, lon: -76.7931, type: "capital", population: 670000 },
    { name: "Panama City", country: "Panama", lat: 8.9824, lon: -79.5199, type: "capital", population: 880000 },
    
    // South America
    { name: "Brasília", country: "Brazil", lat: -15.7975, lon: -47.8919, type: "capital", population: 3000000 },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, type: "capital", population: 3000000 },
    { name: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428, type: "capital", population: 10000000 },
    { name: "Bogotá", country: "Colombia", lat: 4.7110, lon: -74.0721, type: "capital", population: 7400000 },
    { name: "Santiago", country: "Chile", lat: -33.4489, lon: -70.6693, type: "capital", population: 6300000 },
    { name: "Caracas", country: "Venezuela", lat: 10.4806, lon: -66.9036, type: "capital", population: 2900000 },
    { name: "Quito", country: "Ecuador", lat: -0.1807, lon: -78.4678, type: "capital", population: 1800000 },
    { name: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1645, type: "capital", population: 1300000 },
    
    // Europe
    { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, type: "capital", population: 9000000 },
    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, type: "capital", population: 2200000 },
    { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, type: "capital", population: 3700000 },
    { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964, type: "capital", population: 2800000 },
    { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038, type: "capital", population: 3200000 },
    { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173, type: "capital", population: 12500000 },
    { name: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738, type: "capital", population: 1900000 },
    { name: "Athens", country: "Greece", lat: 37.9838, lon: 23.7275, type: "capital", population: 3100000 },
    { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041, type: "capital", population: 870000 },
    { name: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517, type: "capital", population: 1200000 },
    { name: "Warsaw", country: "Poland", lat: 52.2297, lon: 21.0122, type: "capital", population: 1800000 },
    { name: "Prague", country: "Czech Republic", lat: 50.0755, lon: 14.4378, type: "capital", population: 1300000 },
    { name: "Budapest", country: "Hungary", lat: 47.4979, lon: 19.0402, type: "capital", population: 1800000 },
    { name: "Bucharest", country: "Romania", lat: 44.4268, lon: 26.1025, type: "capital", population: 1900000 },
    { name: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686, type: "capital", population: 980000 },
    { name: "Copenhagen", country: "Denmark", lat: 55.6761, lon: 12.5683, type: "capital", population: 630000 },
    { name: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522, type: "capital", population: 690000 },
    { name: "Helsinki", country: "Finland", lat: 60.1695, lon: 24.9354, type: "capital", population: 650000 },
    { name: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603, type: "capital", population: 1200000 },
    { name: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393, type: "capital", population: 500000 },
    { name: "Kiev", country: "Ukraine", lat: 50.4501, lon: 30.5234, type: "capital", population: 2900000 },
    
    // Asia
    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, type: "capital", population: 14000000 },
    { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074, type: "capital", population: 21500000 },
    { name: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780, type: "capital", population: 9700000 },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018, type: "capital", population: 10500000 },
    { name: "New Delhi", country: "India", lat: 28.7041, lon: 77.1025, type: "capital", population: 32900000 },
    { name: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456, type: "capital", population: 10600000 },
    { name: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842, type: "capital", population: 13900000 },
    { name: "Hanoi", country: "Vietnam", lat: 21.0285, lon: 105.8542, type: "capital", population: 8000000 },
    { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869, type: "capital", population: 1800000 },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, type: "capital", population: 5700000 },
    { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753, type: "capital", population: 7000000 },
    { name: "Tehran", country: "Iran", lat: 35.6892, lon: 51.3890, type: "capital", population: 8700000 },
    { name: "Baghdad", country: "Iraq", lat: 33.3152, lon: 44.3661, type: "capital", population: 7200000 },
    { name: "Ankara", country: "Turkey", lat: 39.9334, lon: 32.8597, type: "capital", population: 5600000 },
    { name: "Kabul", country: "Afghanistan", lat: 34.5553, lon: 69.2075, type: "capital", population: 4600000 },
    { name: "Islamabad", country: "Pakistan", lat: 33.6844, lon: 73.0479, type: "capital", population: 1100000 },
    { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125, type: "capital", population: 21000000 },
    
    // Africa
    { name: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357, type: "capital", population: 20900000 },
    { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, type: "capital", population: 15000000 },
    { name: "Johannesburg", country: "South Africa", lat: -26.2041, lon: 28.0473, type: "capital", population: 5700000 },
    { name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219, type: "capital", population: 4700000 },
    { name: "Addis Ababa", country: "Ethiopia", lat: 9.0320, lon: 38.7469, type: "capital", population: 5000000 },
    { name: "Accra", country: "Ghana", lat: 5.6037, lon: -0.1870, type: "capital", population: 2500000 },
    { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083, type: "capital", population: 7400000 },
    { name: "Kinshasa", country: "DR Congo", lat: -4.4419, lon: 15.2663, type: "capital", population: 14300000 },
    { name: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588, type: "capital", population: 2900000 },
    { name: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898, type: "capital", population: 3800000 },
    
    // Oceania
    { name: "Canberra", country: "Australia", lat: -35.2809, lon: 149.1300, type: "capital", population: 460000 },
    { name: "Wellington", country: "New Zealand", lat: -41.2865, lon: 174.7762, type: "capital", population: 420000 },
    
    // === MAJOR CITIES (80+) ===
    // North America
    { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060, type: "major", population: 8400000 },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437, type: "major", population: 4000000 },
    { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298, type: "major", population: 2700000 },
    { name: "Houston", country: "USA", lat: 29.7604, lon: -95.3698, type: "major", population: 2300000 },
    { name: "Phoenix", country: "USA", lat: 33.4484, lon: -112.0740, type: "major", population: 1700000 },
    { name: "Philadelphia", country: "USA", lat: 39.9526, lon: -75.1652, type: "major", population: 1600000 },
    { name: "San Antonio", country: "USA", lat: 29.4241, lon: -98.4936, type: "major", population: 1500000 },
    { name: "San Diego", country: "USA", lat: 32.7157, lon: -117.1611, type: "major", population: 1400000 },
    { name: "Dallas", country: "USA", lat: 32.7767, lon: -96.7970, type: "major", population: 1300000 },
    { name: "San Francisco", country: "USA", lat: 37.7749, lon: -122.4194, type: "major", population: 880000 },
    { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, type: "major", population: 2900000 },
    { name: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673, type: "major", population: 1800000 },
    { name: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, type: "major", population: 675000 },
    { name: "Guadalajara", country: "Mexico", lat: 20.6597, lon: -103.3496, type: "major", population: 1500000 },
    { name: "Monterrey", country: "Mexico", lat: 25.6866, lon: -100.3161, type: "major", population: 1100000 },
    
    // South America
    { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333, type: "major", population: 12300000 },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729, type: "major", population: 6700000 },
    { name: "Salvador", country: "Brazil", lat: -12.9714, lon: -38.5014, type: "major", population: 2900000 },
    { name: "Fortaleza", country: "Brazil", lat: -3.7172, lon: -38.5433, type: "major", population: 2700000 },
    { name: "Belo Horizonte", country: "Brazil", lat: -19.9167, lon: -43.9345, type: "major", population: 2500000 },
    { name: "Medellín", country: "Colombia", lat: 6.2442, lon: -75.5812, type: "major", population: 2500000 },
    { name: "Cali", country: "Colombia", lat: 3.4516, lon: -76.5320, type: "major", population: 2200000 },
    { name: "Córdoba", country: "Argentina", lat: -31.4201, lon: -64.1888, type: "major", population: 1400000 },
    { name: "Rosario", country: "Argentina", lat: -32.9442, lon: -60.6505, type: "major", population: 1200000 },
    { name: "Guayaquil", country: "Ecuador", lat: -2.1894, lon: -79.8890, type: "major", population: 2700000 },
    
    // Europe
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784, type: "major", population: 15500000 },
    { name: "Barcelona", country: "Spain", lat: 41.3851, lon: 2.1734, type: "major", population: 1600000 },
    { name: "Milan", country: "Italy", lat: 45.4642, lon: 9.1900, type: "major", population: 1400000 },
    { name: "Naples", country: "Italy", lat: 40.8518, lon: 14.2681, type: "major", population: 960000 },
    { name: "Munich", country: "Germany", lat: 48.1351, lon: 11.5820, type: "major", population: 1500000 },
    { name: "Hamburg", country: "Germany", lat: 53.5511, lon: 9.9937, type: "major", population: 1800000 },
    { name: "Frankfurt", country: "Germany", lat: 50.1109, lon: 8.6821, type: "major", population: 750000 },
    { name: "Lyon", country: "France", lat: 45.7640, lon: 4.8357, type: "major", population: 520000 },
    { name: "Marseille", country: "France", lat: 43.2965, lon: 5.3698, type: "major", population: 870000 },
    { name: "Manchester", country: "United Kingdom", lat: 53.4808, lon: -2.2426, type: "major", population: 550000 },
    { name: "Birmingham", country: "United Kingdom", lat: 52.4862, lon: -1.8904, type: "major", population: 1100000 },
    { name: "Glasgow", country: "United Kingdom", lat: 55.8642, lon: -4.2518, type: "major", population: 630000 },
    { name: "Saint Petersburg", country: "Russia", lat: 59.9343, lon: 30.3351, type: "major", population: 5400000 },
    { name: "Porto", country: "Portugal", lat: 41.1579, lon: -8.6291, type: "major", population: 240000 },
    { name: "Valencia", country: "Spain", lat: 39.4699, lon: -0.3763, type: "major", population: 800000 },
    { name: "Seville", country: "Spain", lat: 37.3891, lon: -5.9845, type: "major", population: 690000 },
    { name: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417, type: "major", population: 420000 },
    { name: "Geneva", country: "Switzerland", lat: 46.2044, lon: 6.1432, type: "major", population: 200000 },
    { name: "Sofia", country: "Bulgaria", lat: 42.6977, lon: 23.3219, type: "major", population: 1200000 },
    { name: "Belgrade", country: "Serbia", lat: 44.7866, lon: 20.4489, type: "major", population: 1400000 },
    
    // Asia
    { name: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737, type: "major", population: 27000000 },
    { name: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694, type: "major", population: 7500000 },
    { name: "Guangzhou", country: "China", lat: 23.1291, lon: 113.2644, type: "major", population: 15000000 },
    { name: "Shenzhen", country: "China", lat: 22.5431, lon: 114.0579, type: "major", population: 12500000 },
    { name: "Chengdu", country: "China", lat: 30.5728, lon: 104.0668, type: "major", population: 16000000 },
    { name: "Tianjin", country: "China", lat: 39.3434, lon: 117.3616, type: "major", population: 15600000 },
    { name: "Osaka", country: "Japan", lat: 34.6937, lon: 135.5023, type: "major", population: 2700000 },
    { name: "Yokohama", country: "Japan", lat: 35.4437, lon: 139.6380, type: "major", population: 3700000 },
    { name: "Nagoya", country: "Japan", lat: 35.1815, lon: 136.9066, type: "major", population: 2300000 },
    { name: "Busan", country: "South Korea", lat: 35.1796, lon: 129.0756, type: "major", population: 3400000 },
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777, type: "major", population: 20400000 },
    { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, type: "major", population: 12300000 },
    { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, type: "major", population: 14800000 },
    { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, type: "major", population: 10700000 },
    { name: "Hyderabad", country: "India", lat: 17.3850, lon: 78.4867, type: "major", population: 10000000 },
    { name: "Pune", country: "India", lat: 18.5204, lon: 73.8567, type: "major", population: 6400000 },
    { name: "Karachi", country: "Pakistan", lat: 24.8607, lon: 67.0011, type: "major", population: 16000000 },
    { name: "Lahore", country: "Pakistan", lat: 31.5497, lon: 74.3436, type: "major", population: 11100000 },
    { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lon: 106.6297, type: "major", population: 9000000 },
    { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, type: "major", population: 3400000 },
    { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773, type: "major", population: 1500000 },
    { name: "Taipei", country: "Taiwan", lat: 25.0330, lon: 121.5654, type: "major", population: 2700000 },
    { name: "Tel Aviv", country: "Israel", lat: 32.0853, lon: 34.7818, type: "major", population: 460000 },
    { name: "Jerusalem", country: "Israel", lat: 31.7683, lon: 35.2137, type: "major", population: 930000 },
    
    // Africa
    { name: "Alexandria", country: "Egypt", lat: 31.2001, lon: 29.9187, type: "major", population: 5200000 },
    { name: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241, type: "major", population: 4600000 },
    { name: "Durban", country: "South Africa", lat: -29.8587, lon: 31.0218, type: "major", population: 3900000 },
    { name: "Luanda", country: "Angola", lat: -8.8383, lon: 13.2344, type: "major", population: 8300000 },
    { name: "Abidjan", country: "Ivory Coast", lat: 5.3600, lon: -4.0083, type: "major", population: 5500000 },
    { name: "Khartoum", country: "Sudan", lat: 15.5007, lon: 32.5599, type: "major", population: 5200000 },
    { name: "Tunis", country: "Tunisia", lat: 36.8065, lon: 10.1815, type: "major", population: 2400000 },
    
    // Oceania
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, type: "major", population: 5300000 },
    { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, type: "major", population: 5100000 },
    { name: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251, type: "major", population: 2500000 },
    { name: "Perth", country: "Australia", lat: -31.9505, lon: 115.8605, type: "major", population: 2100000 },
    { name: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633, type: "major", population: 1700000 },
    
    // === CITIES (50+) ===
    { name: "Austin", country: "USA", lat: 30.2672, lon: -97.7431, type: "city", population: 970000 },
    { name: "Seattle", country: "USA", lat: 47.6062, lon: -122.3321, type: "city", population: 750000 },
    { name: "Denver", country: "USA", lat: 39.7392, lon: -104.9903, type: "city", population: 720000 },
    { name: "Boston", country: "USA", lat: 42.3601, lon: -71.0589, type: "city", population: 690000 },
    { name: "Portland", country: "USA", lat: 45.5152, lon: -122.6784, type: "city", population: 650000 },
    { name: "Las Vegas", country: "USA", lat: 36.1699, lon: -115.1398, type: "city", population: 640000 },
    { name: "Miami", country: "USA", lat: 25.7617, lon: -80.1918, type: "city", population: 470000 },
    { name: "Atlanta", country: "USA", lat: 33.7490, lon: -84.3880, type: "city", population: 500000 },
    { name: "Detroit", country: "USA", lat: 42.3314, lon: -83.0458, type: "city", population: 670000 },
    { name: "Minneapolis", country: "USA", lat: 44.9778, lon: -93.2650, type: "city", population: 430000 },
    { name: "Calgary", country: "Canada", lat: 51.0447, lon: -114.0719, type: "city", population: 1300000 },
    { name: "Edmonton", country: "Canada", lat: 53.5461, lon: -113.4938, type: "city", population: 980000 },
    { name: "Puebla", country: "Mexico", lat: 19.0414, lon: -98.2063, type: "city", population: 1600000 },
    { name: "Tijuana", country: "Mexico", lat: 32.5149, lon: -117.0382, type: "city", population: 1800000 },
    { name: "Curitiba", country: "Brazil", lat: -25.4284, lon: -49.2733, type: "city", population: 1900000 },
    { name: "Recife", country: "Brazil", lat: -8.0476, lon: -34.8770, type: "city", population: 1650000 },
    { name: "Porto Alegre", country: "Brazil", lat: -30.0346, lon: -51.2177, type: "city", population: 1490000 },
    { name: "Mendoza", country: "Argentina", lat: -32.8895, lon: -68.8458, type: "city", population: 115000 },
    { name: "Valparaíso", country: "Chile", lat: -33.0472, lon: -71.6127, type: "city", population: 280000 },
    { name: "Cusco", country: "Peru", lat: -13.5319, lon: -71.9675, type: "city", population: 430000 },
    { name: "Cartagena", country: "Colombia", lat: 10.3910, lon: -75.4794, type: "city", population: 1000000 },
    { name: "Florence", country: "Italy", lat: 43.7696, lon: 11.2558, type: "city", population: 380000 },
    { name: "Venice", country: "Italy", lat: 45.4408, lon: 12.3155, type: "city", population: 260000 },
    { name: "Bologna", country: "Italy", lat: 44.4949, lon: 11.3426, type: "city", population: 390000 },
    { name: "Cologne", country: "Germany", lat: 50.9375, lon: 6.9603, type: "city", population: 1080000 },
    { name: "Dresden", country: "Germany", lat: 51.0504, lon: 13.7373, type: "city", population: 560000 },
    { name: "Leipzig", country: "Germany", lat: 51.3397, lon: 12.3731, type: "city", population: 600000 },
    { name: "Toulouse", country: "France", lat: 43.6047, lon: 1.4442, type: "city", population: 480000 },
    { name: "Nice", country: "France", lat: 43.7102, lon: 7.2620, type: "city", population: 340000 },
    { name: "Bordeaux", country: "France", lat: 44.8378, lon: -0.5792, type: "city", population: 250000 },
    { name: "Liverpool", country: "United Kingdom", lat: 53.4084, lon: -2.9916, type: "city", population: 500000 },
    { name: "Edinburgh", country: "United Kingdom", lat: 55.9533, lon: -3.1883, type: "city", population: 530000 },
    { name: "Leeds", country: "United Kingdom", lat: 53.8008, lon: -1.5491, type: "city", population: 790000 },
    { name: "Krakow", country: "Poland", lat: 50.0647, lon: 19.9450, type: "city", population: 780000 },
    { name: "Gdansk", country: "Poland", lat: 54.3520, lon: 18.6466, type: "city", population: 470000 },
    { name: "Bratislava", country: "Slovakia", lat: 48.1486, lon: 17.1077, type: "city", population: 440000 },
    { name: "Zagreb", country: "Croatia", lat: 45.8150, lon: 15.9819, type: "city", population: 790000 },
    { name: "Riga", country: "Latvia", lat: 56.9496, lon: 24.1052, type: "city", population: 630000 },
    { name: "Tallinn", country: "Estonia", lat: 59.4370, lon: 24.7536, type: "city", population: 440000 },
    { name: "Vilnius", country: "Lithuania", lat: 54.6872, lon: 25.2797, type: "city", population: 580000 },
    { name: "Xi'an", country: "China", lat: 34.3416, lon: 108.9398, type: "city", population: 12000000 },
    { name: "Wuhan", country: "China", lat: 30.5928, lon: 114.3055, type: "city", population: 11000000 },
    { name: "Hangzhou", country: "China", lat: 30.2741, lon: 120.1551, type: "city", population: 10400000 },
    { name: "Nanjing", country: "China", lat: 32.0603, lon: 118.7969, type: "city", population: 8500000 },
    { name: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681, type: "city", population: 1470000 },
    { name: "Fukuoka", country: "Japan", lat: 33.5904, lon: 130.4017, type: "city", population: 1600000 },
    { name: "Sapporo", country: "Japan", lat: 43.0642, lon: 141.3469, type: "city", population: 1970000 },
    { name: "Jaipur", country: "India", lat: 26.9124, lon: 75.7873, type: "city", population: 3100000 },
    { name: "Ahmedabad", country: "India", lat: 23.0225, lon: 72.5714, type: "city", population: 8450000 },
    
    // === VILLAGES AND SMALL TOWNS (30+) ===
    { name: "Boulder", country: "USA", lat: 40.0150, lon: -105.2705, type: "village", population: 108000 },
    { name: "Santa Fe", country: "USA", lat: 35.6870, lon: -105.9378, type: "village", population: 84000 },
    { name: "Aspen", country: "USA", lat: 39.1911, lon: -106.8175, type: "village", population: 7000 },
    { name: "Key West", country: "USA", lat: 24.5551, lon: -81.7800, type: "village", population: 25000 },
    { name: "Banff", country: "Canada", lat: 51.1784, lon: -115.5708, type: "village", population: 8000 },
    { name: "Whistler", country: "Canada", lat: 50.1163, lon: -122.9574, type: "village", population: 12000 },
    { name: "Bariloche", country: "Argentina", lat: -41.1335, lon: -71.3103, type: "village", population: 130000 },
    { name: "Ushuaia", country: "Argentina", lat: -54.8019, lon: -68.3029, type: "village", population: 67000 },
    { name: "Galápagos Islands", country: "Ecuador", lat: -0.9538, lon: -90.9656, type: "village", population: 25000 },
    { name: "Machu Picchu Village", country: "Peru", lat: -13.1633, lon: -72.5450, type: "village", population: 4000 },
    { name: "Reykjavik", country: "Iceland", lat: 64.1466, lon: -21.9426, type: "village", population: 130000 },
    { name: "Bergen", country: "Norway", lat: 60.3913, lon: 5.3221, type: "village", population: 280000 },
    { name: "Tromsø", country: "Norway", lat: 69.6492, lon: 18.9553, type: "village", population: 76000 },
    { name: "Rovaniemi", country: "Finland", lat: 66.5039, lon: 25.7294, type: "village", population: 63000 },
    { name: "Interlaken", country: "Switzerland", lat: 46.6863, lon: 7.8632, type: "village", population: 5600 },
    { name: "Zermatt", country: "Switzerland", lat: 46.0207, lon: 7.7491, type: "village", population: 5800 },
    { name: "Innsbruck", country: "Austria", lat: 47.2692, lon: 11.4041, type: "village", population: 130000 },
    { name: "Salzburg", country: "Austria", lat: 47.8095, lon: 13.0550, type: "village", population: 155000 },
    { name: "Dubrovnik", country: "Croatia", lat: 42.6507, lon: 18.0944, type: "village", population: 42000 },
    { name: "Santorini", country: "Greece", lat: 36.3932, lon: 25.4615, type: "village", population: 15500 },
    { name: "Mykonos", country: "Greece", lat: 37.4467, lon: 25.3289, type: "village", population: 10000 },
    { name: "Positano", country: "Italy", lat: 40.6280, lon: 14.4851, type: "village", population: 4000 },
    { name: "Cinque Terre", country: "Italy", lat: 44.1268, lon: 9.7202, type: "village", population: 5000 },
    { name: "Sintra", country: "Portugal", lat: 38.7980, lon: -9.3881, type: "village", population: 380000 },
    { name: "Kyoto Arashiyama", country: "Japan", lat: 35.0094, lon: 135.6686, type: "village", population: 2000 },
    { name: "Nikko", country: "Japan", lat: 36.7199, lon: 139.6982, type: "village", population: 80000 },
    { name: "Luang Prabang", country: "Laos", lat: 19.8845, lon: 102.1349, type: "village", population: 56000 },
    { name: "Chiang Mai", country: "Thailand", lat: 18.7883, lon: 98.9853, type: "village", population: 130000 },
    { name: "Ubud", country: "Indonesia", lat: -8.5069, lon: 115.2625, type: "village", population: 75000 },
    { name: "Queenstown", country: "New Zealand", lat: -45.0312, lon: 168.6626, type: "village", population: 16000 },
    { name: "Rotorua", country: "New Zealand", lat: -38.1368, lon: 176.2497, type: "village", population: 58000 },
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
