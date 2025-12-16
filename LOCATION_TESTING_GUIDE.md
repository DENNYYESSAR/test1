# Quick Start: Location-Based Clinic Finder

## Testing the New Features Locally

### 1. Start the Development Server
```bash
cd /home/dennis/Downloads/AfyaLynx
npm run dev
```

### 2. Access the Find Clinics Page
Open your browser to: `http://localhost:3000/find-clinics`

### 3. Test Location Features

#### Enable Location Access
1. You'll see a blue banner prompting "Enable Location Access"
2. Click **"Use My Location"** button
3. Browser will request permission - click **"Allow"**
4. Your coordinates will display with accuracy indicator
5. Nearby clinics will automatically load

#### Manual Location Entry
- If you don't want to use GPS, type a location in the search field
- Format: "New York, NY" or "10001"

#### Test AI Scraping
1. After enabling location, scroll to "AI-Powered Area Search"
2. Enter an area of interest: e.g., "Downtown", "Near Hospital X"
3. Click **"Search Area"** button
4. AI will simulate finding additional facilities
5. Results appear with "AI Discovered" badge

### 4. Test Filters
- **Specialty**: Select from dropdown (Cardiology, Pediatrics, etc.)
- **Insurance**: Filter by insurance provider
- **AI Search**: Toggle checkbox to include/exclude web scraping

### 5. Expected Behavior

#### On First Visit
```
✓ Location prompt banner appears
✓ Default clinics displayed (6 sample clinics)
✓ Map shows generic view
```

#### After Enabling Location
```
✓ Green success banner with coordinates
✓ Map updates to user's location
✓ Clinics sorted by distance
✓ "Updated just now" timestamp
✓ AI area search field appears
```

#### After AI Area Search
```
✓ Loading spinner appears
✓ Additional facilities added to list
✓ "AI Discovered" badges visible
✓ Alert shows number found
```

## Browser Requirements

### Must Use HTTPS in Production
The Geolocation API requires HTTPS in production. For local development, `localhost` works without HTTPS.

### Supported Browsers
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (works but may require specific permissions)

## Database Setup (Optional)

To get real location-based results from your database:

### 1. Add Location Columns
```sql
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
CREATE INDEX idx_clinics_location ON clinics(latitude, longitude);
```

### 2. Add Sample Geocoded Data
```sql
-- New York Area Clinics
UPDATE clinics SET 
  latitude = 40.7589, 
  longitude = -73.9851 
WHERE name = 'Central Medical Center';

UPDATE clinics SET 
  latitude = 40.7614, 
  longitude = -73.9776 
WHERE name = 'Westside Family Clinic';

-- Add more as needed with actual coordinates
```

### 3. Get Coordinates for Addresses
Use online tools:
- https://www.latlong.net/
- https://www.gps-coordinates.net/
- Google Maps (right-click on location)

## Troubleshooting

### Location Permission Denied
**Error:** "Location access denied"

**Solution:**
1. Check browser address bar for blocked location icon
2. Click icon → Allow location access
3. Refresh page
4. Try "Use My Location" again

### No Results Found
**Issue:** Location enabled but no clinics appear

**Cause:** Database clinics don't have latitude/longitude

**Solution:**
- Default sample clinics will display
- Add geocoded data to database (see above)
- Check browser console for API errors

### AI Scraping Returns Mock Data
**Issue:** Scraped results look generic

**Expected:** This is intentional for development

**Explanation:**
- Current implementation uses simulated data
- Replace with real scraping service in production
- See `LOCATION_FEATURE_DOCS.md` for integration options

### Map Not Loading
**Issue:** Map shows blank or error

**Cause:** Google Maps API key not configured

**Solution:**
- For development, the map placeholder works fine
- For production, get Google Maps API key:
  1. Visit https://console.cloud.google.com/
  2. Enable Maps JavaScript API
  3. Create API key
  4. Add to `.env.local`: `GOOGLE_MAPS_API_KEY=your_key`

## Testing Scenarios

### Scenario 1: New User - GPS Enabled
1. Visit `/find-clinics`
2. Click "Use My Location"
3. Allow permission
4. Verify: Green banner with coordinates appears
5. Verify: Map updates
6. Verify: Clinics show distance from your location

### Scenario 2: GPS + Area Search
1. Enable location (as above)
2. Type "Downtown" in AI search field
3. Click "Search Area"
4. Verify: Loading spinner shows
5. Verify: Additional clinics added
6. Verify: Purple "AI Discovered" badges visible

### Scenario 3: Manual Location Entry
1. Visit `/find-clinics`
2. Dismiss location prompt
3. Type "New York, NY" in location field
4. Select specialty: "Cardiology"
5. Verify: Results filter by specialty

### Scenario 4: Filter Combinations
1. Enable location
2. Select specialty: "Pediatrics"
3. Select insurance: "Blue Cross"
4. Verify: Only matching clinics display
5. Verify: Count updates in header

## Performance Testing

### API Response Times
Expected response times:
- `/api/clinics/nearby`: < 500ms
- `/api/clinics/scrape`: < 2s (mock) | 5-10s (real scraping)
- Geolocation API: 1-5s (depends on GPS)

### Load Testing
Test with varying clinic counts:
- 10 clinics: Instant
- 100 clinics: < 1s
- 1000 clinics: Should paginate (future enhancement)

## Mobile Testing

### iOS Safari
1. Settings → Safari → Location Services → Ask
2. Visit site
3. Tap "Use My Location"
4. Tap "Allow" in popup

### Android Chrome
1. Chrome → Settings → Site Settings → Location → Ask first
2. Visit site
3. Tap "Use My Location"
4. Tap "Allow" in prompt

## Next Steps

1. ✅ Test all features locally
2. ✅ Verify no console errors
3. ⏭️ Add geocoded data to database
4. ⏭️ Choose scraping service (optional)
5. ⏭️ Get Google Maps API key (production)
6. ⏭️ Deploy with HTTPS
7. ⏭️ Test on real mobile devices

## Support

For issues or questions:
1. Check browser console for errors
2. Review `LOCATION_FEATURE_DOCS.md` for detailed info
3. Verify environment variables are set
4. Ensure database migrations ran successfully

## Features Summary

✅ **Implemented:**
- Geolocation API integration
- Location permission UI
- Distance-based clinic sorting
- AI scraping infrastructure
- Area-specific search
- Real-time loading states
- Error handling
- Filter combinations
- Source attribution badges

🔄 **Ready for Integration:**
- Real web scraping service
- Google Maps API
- Production geocoding
- Rate limiting
- Caching layer

📋 **Future Enhancements:**
- Save favorite locations
- Push notifications for appointments
- Offline clinic database
- Voice search
- Multi-language support
