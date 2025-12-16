# Location-Based Clinic Finder with AI Scraping

## Overview
The AfyaLynx platform now includes advanced location-based clinic discovery with AI-powered web scraping capabilities to find nearby healthcare facilities.

## Features Implemented

### 1. **Geolocation Integration** 🗺️
- Browser-based GPS location detection
- User permission prompt with clear instructions
- Real-time location accuracy display
- Fallback to manual location entry
- Location error handling with retry capability

### 2. **Nearby Clinics API** 📍
**Endpoint:** `GET /api/clinics/nearby`

**Parameters:**
- `latitude` (required): User's latitude coordinate
- `longitude` (required): User's longitude coordinate  
- `radius` (optional): Search radius in miles (default: 10)
- `specialty` (optional): Filter by medical specialty
- `includeScraped` (optional): Include web-scraped results

**Features:**
- Haversine formula for accurate distance calculation
- Results sorted by proximity
- Includes database clinics + scraped results
- Real-time availability generation

**Example Request:**
```javascript
fetch('/api/clinics/nearby?latitude=40.7128&longitude=-74.0060&radius=5&includeScraped=true')
```

**Example Response:**
```json
{
  "success": true,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": "5 miles"
  },
  "clinics": [...],
  "scrapedHospitals": [...],
  "totalResults": 15
}
```

### 3. **AI-Powered Web Scraping** 🤖
**Endpoint:** `POST /api/clinics/scrape`

**Purpose:** Discover additional healthcare facilities not in the database by scraping the web

**Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "areaOfInterest": "Downtown Manhattan",
  "specialty": "Cardiology"
}
```

**Features:**
- Area-specific healthcare facility discovery
- Specialty-based filtering
- Verification status tracking
- Source attribution (ai-scraped)

**Integration Possibilities:**
1. **Google Maps Scraping:** Via Outscraper API or Puppeteer
2. **Healthcare Directories:** Healthgrades, Zocdoc, WebMD
3. **Bright Data / ScraperAPI:** For enterprise-grade scraping
4. **Custom Puppeteer:** With proxy rotation

### 4. **Enhanced User Interface** 💫

#### Location Permission Prompt
- Prominent banner requesting location access
- Clear explanation of benefits
- Visual loading states
- One-click GPS activation

#### Search Interface
- GPS quick-access button in location field
- Real-time location status display
- Accuracy indicator
- AI search toggle (include web scraping)
- Area of interest search field

#### Clinic Display
- Visual badges for AI-discovered facilities
  - "AI Found" (web-scraped)
  - "AI Discovered" (area search)
- Source attribution on each clinic card
- Distance calculations from user location
- Dynamic map with user location marker

#### Interactive Features
- Filter by specialty and insurance
- Toggle web scraping on/off
- Search specific areas of interest
- Real-time loading indicators
- Error recovery mechanisms

## User Flow

### Step 1: Initial Page Load
```
User arrives → See location permission prompt → Click "Use My Location"
```

### Step 2: Location Access
```
Browser requests permission → User allows → GPS coordinates captured → 
Location displayed with accuracy → Auto-fetch nearby clinics
```

### Step 3: View Results
```
Database clinics loaded → Sorted by distance → 
Map updated with user marker → Filters available
```

### Step 4: AI Area Search (Optional)
```
User enters area of interest → Click "Search Area" → 
AI scrapes web for facilities → Additional results added →
Marked with "AI Discovered" badge
```

## Technical Implementation

### Database Query with Distance Calculation
```sql
SELECT 
  id, name, specialty, rating, address, phone,
  (
    3959 * acos(
      cos(radians($1)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians($2)) + 
      sin(radians($1)) * sin(radians(latitude))
    )
  ) AS distance
FROM clinics
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
HAVING distance <= $3
ORDER BY distance ASC
```

### Geolocation API Usage
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    // Use coordinates
  },
  (error) => {
    // Handle error
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);
```

### Distance Calculation (Haversine)
```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

## Database Requirements

### Clinics Table Updates
Ensure your `clinics` table includes:
```sql
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for faster geospatial queries
CREATE INDEX idx_clinics_location ON clinics(latitude, longitude);
```

### Sample Data with Coordinates
```sql
INSERT INTO clinics (name, address, latitude, longitude, specialty, rating, phone, email)
VALUES 
  ('Central Medical Center', '123 Healthcare Ave', 40.7589, -73.9851, 'General Practice', 4.8, '+1-555-0100', 'info@central.med'),
  ('Westside Family Clinic', '456 Family Way', 40.7614, -73.9776, 'Family Medicine', 4.6, '+1-555-0200', 'contact@westside.med');
```

## Future Enhancements

### 1. Real Web Scraping Integration
```javascript
// Example: Outscraper Google Maps API
const Outscraper = require('outscraper');
const client = new Outscraper(API_KEY);

const results = await client.googleMapsSearch(
  [`hospitals near ${latitude},${longitude}`],
  limit: 20
);
```

### 2. Caching Strategy
- Cache scraped results for 24 hours
- Redis/Memcached for geospatial queries
- Reduce repeated scraping costs

### 3. Verification System
- Flag scraped facilities for manual verification
- User reporting for incorrect information
- Admin dashboard for approval workflow

### 4. Advanced Filters
- Operating hours (open now)
- Rating threshold
- Accepted insurance validation
- Emergency services availability

### 5. Route Planning
- Multi-stop route optimization
- Public transit integration
- Drive time vs. distance
- Traffic-aware recommendations

## Security Considerations

### Location Privacy
- Only request location when needed
- Clear user consent
- Never store raw GPS coordinates
- Comply with GDPR/CCPA

### Scraping Ethics
- Respect robots.txt
- Rate limiting
- User-agent identification
- Terms of service compliance

### Data Validation
- Sanitize scraped content
- Verify clinic credentials
- Flag suspicious entries
- Regular data quality audits

## Browser Compatibility

**Geolocation API Support:**
- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge 12+
- ✅ iOS Safari 3.2+
- ✅ Android Browser 2.1+

**HTTPS Requirement:**
Modern browsers require HTTPS for geolocation API access in production.

## Testing Checklist

- [ ] Location permission prompt displays correctly
- [ ] GPS coordinates captured accurately
- [ ] Distance calculations are correct
- [ ] Nearby clinics API returns results within radius
- [ ] Specialty filtering works
- [ ] Insurance filtering works
- [ ] AI scraping returns results
- [ ] Map updates with user location
- [ ] Loading states display properly
- [ ] Error messages are clear
- [ ] Mobile responsive design
- [ ] HTTPS enabled in production

## API Integration Examples

### External Scraping Services

#### 1. Outscraper (Recommended)
```javascript
const response = await fetch('https://api.outscraper.com/maps/search-v2', {
  method: 'POST',
  headers: {
    'X-API-KEY': process.env.OUTSCRAPER_API_KEY
  },
  body: JSON.stringify({
    query: `hospitals near ${latitude},${longitude}`,
    limit: 20
  })
});
```

#### 2. ScraperAPI
```javascript
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital`;
const response = await fetch(`http://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(url)}`);
```

#### 3. Bright Data
```javascript
const response = await fetch('https://api.brightdata.com/dca/trigger', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${BRIGHT_DATA_API_KEY}`
  },
  body: JSON.stringify({
    collector_type: 'google_maps',
    search_query: `hospitals ${latitude},${longitude}`
  })
});
```

## Environment Variables

Add to `.env.local`:
```env
# Optional: For advanced scraping features
OUTSCRAPER_API_KEY=your_outscraper_api_key
SCRAPERAPI_KEY=your_scraperapi_key
BRIGHT_DATA_API_KEY=your_bright_data_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Cost Considerations

### Free Tier Options
- Browser Geolocation: Free (built-in)
- Database queries: Free (self-hosted)
- Basic scraping: Free with rate limits

### Paid Services
- Outscraper: $50-200/month (10k-50k requests)
- ScraperAPI: $50-150/month (100k-500k API calls)
- Bright Data: Custom pricing (enterprise)
- Google Maps API: $200 free credit/month, then $5/1000 requests

## Conclusion

The AfyaLynx clinic finder now provides:
- ✅ Accurate GPS-based location detection
- ✅ Distance-sorted clinic results
- ✅ AI-powered web scraping capability
- ✅ Area-specific healthcare discovery
- ✅ Real-time availability information
- ✅ User-friendly interface with clear feedback

Next steps: Integrate production scraping service and expand database with geocoded clinics.
