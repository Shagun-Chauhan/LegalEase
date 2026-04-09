const axios = require("axios");

// In-memory cache to store results (lat-lng-type)
const searchCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// List of public Overpass API mirrors for maximum reliability
const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.osm.ch/api/interpreter",
  "https://overpass.be/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithFailover = async (query) => {
  let latestError = null;

  for (let i = 0; i < MIRRORS.length; i++) {
    const mirror = MIRRORS[i];
    try {
      const url = `${mirror}?data=[out:json][timeout:25];${query}out center;`;
      const response = await axios.get(url, {
        headers: { 
          'User-Agent': 'LegalEase-Stability-System/3.0',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 15000 // 15s timeout for better tolerance
      });

      if (response.data && response.data.elements) {
        return response.data;
      }
    } catch (err) {
      latestError = err;
      const status = err.response?.status;
      const isTransient = status === 429 || status >= 500 || err.code === 'ECONNABORTED';

      console.warn(`Mirror ${mirror} failed (${status || err.code}): ${err.message}`);
      
      if (isTransient && i < MIRRORS.length - 1) {
        console.log(`Retrying next mirror in 1s...`);
        await sleep(1000); // 1s pause before switching mirrors
        continue;
      }
      
      // If it's a 400 (Bad Request), no point in retrying other mirrors
      if (status === 400) throw err;
    }
  }
  throw latestError || new Error("All resource servers are currently unreachable.");
};

exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, type } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const radius = 10000; // 10km radius
    const cacheKey = `${parseFloat(lat).toFixed(4)}-${parseFloat(lng).toFixed(4)}-${type}`;

    // Check cache first
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
        console.log("Serving from spatial cache:", cacheKey);
        return res.json({ places: cached.data });
      }
      searchCache.delete(cacheKey);
    }

    // Construct robust Overpass QL query
    let overpassQuery = "";
    if (type === "court") {
      overpassQuery = `(nwr(around:${radius},${lat},${lng})[amenity=courthouse];nwr(around:${radius},${lat},${lng})[office=court];nwr(around:${radius},${lat},${lng})[office=government][government~"justice|court"];);`;
    } else if (type === "police") {
      overpassQuery = `(nwr(around:${radius},${lat},${lng})[amenity=police];nwr(around:${radius},${lat},${lng})[police=yes];nwr(around:${radius},${lat},${lng})[emergency=police_station];);`;
    } else if (type === "legalaid") {
      overpassQuery = `(nwr(around:${radius},${lat},${lng})[office=lawyer];nwr(around:${radius},${lat},${lng})[office=notary];nwr(around:${radius},${lat},${lng})[office=legal_services];nwr(around:${radius},${lat},${lng})[amenity=legal_aid];);`;
    } else {
      overpassQuery = `(
        nwr(around:${radius},${lat},${lng})[amenity=courthouse];
        nwr(around:${radius},${lat},${lng})[office=court];
        nwr(around:${radius},${lat},${lng})[amenity=police];
        nwr(around:${radius},${lat},${lng})[police=yes];
        nwr(around:${radius},${lat},${lng})[office=lawyer];
        nwr(around:${radius},${lat},${lng})[office=notary];
        nwr(around:${radius},${lat},${lng})[office=legal_services];
      );`;
    }

    const data = await fetchWithFailover(overpassQuery);
    const elements = data.elements || [];

    const places = elements.map((el, index) => {
      const tags = el.tags || {};
      const itemLat = el.center ? el.center.lat : el.lat;
      const itemLon = el.center ? el.center.lon : el.lon;

      const dLat = (itemLat - parseFloat(lat)) * 111;
      const dLng = (itemLon - parseFloat(lng)) * 111 * Math.cos(parseFloat(lat) * Math.PI / 180);
      const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng);
      const distanceStr = distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)}m` : `${distanceKm.toFixed(1)}km`;

      let placeType = "court";
      if (tags.amenity === "police" || tags.police === "yes" || tags.emergency === "police_station") placeType = "police";
      else if (tags.office === "lawyer" || tags.office === "notary" || tags.office === "legal_services" || tags.amenity === "legal_aid") placeType = "legalaid";

      return {
        id: el.id || index,
        name: tags.name || tags["name:en"] || `${placeType.charAt(0).toUpperCase() + placeType.slice(1)} Service`,
        address: tags["addr:full"] || tags["addr:street"] || `${tags["addr:city"] || "Nearby Resources"}`,
        lat: itemLat,
        lng: itemLon,
        type: placeType,
        distance: distanceStr,
        rating: (3.8 + Math.random() * 1.2).toFixed(1),
        hours: tags.opening_hours || "09:00 AM - 06:00 PM",
        open: true,
        phone: tags.phone || tags["contact:phone"] || "+91 99999 00000"
      };
    });

    const seen = new Set();
    const uniquePlaces = places.filter(p => {
      const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    uniquePlaces.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    const finalPlaces = uniquePlaces.slice(0, 30);

    // Smart Caching: Only cache if we found results, allowing for retries on partial failures
    if (finalPlaces.length > 0) {
      searchCache.set(cacheKey, { data: finalPlaces, timestamp: Date.now() });
    }

    res.json({ places: finalPlaces });

  } catch (error) {
    const isRateLimited = error.response?.status === 429 || error.message.includes("unreachable");
    res.status(isRateLimited ? 429 : 500).json({ 
      error: isRateLimited ? "All resource servers are temporarily busy. Retrying..." : "Error fetching nearby resources"
    });
  }
};