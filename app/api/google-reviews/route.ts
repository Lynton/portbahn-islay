import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devLog = (...args: any[]) => { if (isDev) console.log(...args); };

interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

// Extract place_id from Google Business URL
function extractPlaceId(url: string): string | null {
  try {
    devLog('[extractPlaceId] Attempting to extract place_id from URL:', url);
    
    // Google Business URLs can be in various formats:
    // 1. https://www.google.com/maps/place/Name/@lat,lng,zoom/data=!3m1!4b1!4m6!3m5!1sPLACE_ID...
    // 2. https://maps.google.com/?cid=CID_NUMBER
    // 3. https://g.page/business-name
    // 4. https://www.google.com/maps/place/Name/@lat,lng/data=!4m6!3m5!1sPLACE_ID!...
    // 5. https://www.google.com/maps/place/?q=place_id:PLACE_ID
    
    // Method 1: Extract place_id from place_id= query parameter (newer format)
    const placeIdParamMatch = url.match(/[?&]place_id=([A-Za-z0-9_-]{27,})/);
    if (placeIdParamMatch && placeIdParamMatch[1]) {
      devLog('[extractPlaceId] Found place_id via place_id= parameter:', placeIdParamMatch[1]);
      return placeIdParamMatch[1];
    }
    
    // Method 2: Extract place_id from !1s pattern (most common in /place/ URLs)
    // Format: /place/Name/@lat,lng/data=!...!1sPLACE_ID!...
    // Try multiple patterns with different minimum lengths
    const patterns = [
      /!1s([A-Za-z0-9_-]{27,})/,           // Standard format
      /!1s([A-Za-z0-9_-]{20,})/,           // Shorter format
      /!3m\d+!4b\d+!4m\d+!3m\d+!1s([A-Za-z0-9_-]+)/,  // With context
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length >= 20) {
        devLog('[extractPlaceId] Found place_id via pattern:', pattern, '=', match[1]);
        return match[1];
      }
    }
    
    // Method 3: Try to find place_id in data parameter (decode first)
    const dataMatch = url.match(/data=([^&'"]+)/);
    if (dataMatch) {
      try {
        // Try decoding multiple times (sometimes double-encoded)
        let decoded = dataMatch[1];
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          // Already decoded or single-encoded
        }
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          // Fully decoded now
        }
        
        devLog('[extractPlaceId] Decoded data parameter, length:', decoded.length);
        
        // Look for place_id pattern: !1s followed by alphanumeric string
        for (const pattern of patterns) {
          const match = decoded.match(pattern);
          if (match && match[1] && match[1].length >= 20) {
            devLog('[extractPlaceId] Found place_id in decoded data:', match[1]);
            return match[1];
          }
        }
        
        // Also try ChIJ... format (Google's place_id format)
        const chijMatch = decoded.match(/(ChIJ[A-Za-z0-9_-]{27,})/);
        if (chijMatch && chijMatch[1]) {
          devLog('[extractPlaceId] Found place_id in ChIJ format:', chijMatch[1]);
          return chijMatch[1];
        }
        
        // Try legacy 0x...:0x... format (needs conversion via API, but we can extract it)
        const legacyMatch = decoded.match(/!1s(0x[a-f0-9]+:0x[a-f0-9]+)/i);
        if (legacyMatch && legacyMatch[1]) {
          devLog('[extractPlaceId] Found legacy format (0x...:0x...), will need API conversion:', legacyMatch[1]);
          // This format needs to be converted via API, return null to trigger API search
          return null;
        }
      } catch (e) {
        console.error('[extractPlaceId] Error decoding data parameter:', e);
      }
    }
    
    // Method 4: Try extracting from URL path directly (some formats)
    // Format: /place/PLACE_ID or /place/Name/@lat,lng/PLACE_ID
    const pathMatch = url.match(/\/place\/[^/@]+\/([A-Za-z0-9_-]{27,})/);
    if (pathMatch && pathMatch[1]) {
      devLog('[extractPlaceId] Found place_id in URL path:', pathMatch[1]);
      return pathMatch[1];
    }
    
    // Method 5: Extract from CID (will need conversion via API)
    const cidMatch = url.match(/[?&]cid=([0-9]+)/);
    if (cidMatch) {
      devLog('[extractPlaceId] Found CID, will need API conversion:', cidMatch[1]);
      // CID can be converted to place_id, but requires additional API call
      // We'll handle this in findPlaceIdByUrl
      return null;
    }
    
    // Method 6: Try to find place_id after /place/ in the path
    const placePathMatch = url.match(/\/place\/([A-Za-z0-9_-]{27,})(?:\/|$|\?|@)/);
    if (placePathMatch && placePathMatch[1]) {
      devLog('[extractPlaceId] Found place_id after /place/ path:', placePathMatch[1]);
      return placePathMatch[1];
    }
    
    devLog('[extractPlaceId] Could not extract place_id from URL');
    return null;
  } catch (error) {
    console.error('[extractPlaceId] Error extracting place_id:', error);
    return null;
  }
}

// Fetch place_id using Google Places Text Search or Find Place API
async function findPlaceIdByUrl(businessUrl: string, apiKey: string): Promise<string | null> {
  try {
    devLog('[findPlaceIdByUrl] Attempting to find place_id via API for URL:', businessUrl);
    
    const urlObj = new URL(businessUrl);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Try to extract business identifier from URL
    let searchQuery = '';
    
    // For g.page URLs: https://g.page/business-name
    if (urlObj.hostname.includes('g.page')) {
      searchQuery = pathParts[pathParts.length - 1] || '';
      devLog('[findPlaceIdByUrl] Extracted from g.page:', searchQuery);
    } else if (urlObj.hostname.includes('google.com') || urlObj.hostname.includes('maps.google.com')) {
      // For maps URLs, try to extract business name from path
      const placeIndex = pathParts.indexOf('place');
      if (placeIndex >= 0 && pathParts[placeIndex + 1]) {
        // Extract business name (before @ symbol if present)
        const placeName = pathParts[placeIndex + 1];
        searchQuery = decodeURIComponent(placeName.split('@')[0].replace(/\+/g, ' '));
        devLog('[findPlaceIdByUrl] Extracted business name from /place/ path:', searchQuery);
      } else {
        // Try to extract from query parameters
        const qParam = urlObj.searchParams.get('q');
        if (qParam) {
          searchQuery = qParam;
          devLog('[findPlaceIdByUrl] Extracted from q parameter:', searchQuery);
        } else {
          // Fallback: use the full URL as search query
          searchQuery = businessUrl;
          devLog('[findPlaceIdByUrl] Using full URL as search query');
        }
      }
    } else {
      // For other domains, use the full URL
      searchQuery = businessUrl;
    }
    
    if (!searchQuery) {
      devLog('[findPlaceIdByUrl] No search query extracted');
      return null;
    }
    
    // Add location context for better results (Isle of Islay, Scotland)
    const locationContext = ' Isle of Islay Scotland';
    const enhancedQuery = searchQuery + locationContext;
    
    // Use Find Place API (more accurate)
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(enhancedQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    
    devLog('[findPlaceIdByUrl] Calling Find Place API...');
    const findResponse = await fetch(findUrl);
    if (findResponse.ok) {
      const findData = await findResponse.json();
      devLog('[findPlaceIdByUrl] Find Place API response:', JSON.stringify(findData, null, 2));
      
      if (findData.candidates && findData.candidates.length > 0) {
        devLog('[findPlaceIdByUrl] Found place_id via Find Place API:', findData.candidates[0].place_id);
        return findData.candidates[0].place_id;
      }
    } else {
      const errorText = await findResponse.text();
      console.error('[findPlaceIdByUrl] Find Place API error:', findResponse.status, errorText);
    }
    
    // Fallback to Text Search API
    devLog('[findPlaceIdByUrl] Trying Text Search API...');
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(enhancedQuery)}&key=${apiKey}`;
    
    const response = await fetch(textSearchUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[findPlaceIdByUrl] Text Search API error:', response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    devLog('[findPlaceIdByUrl] Text Search API response:', JSON.stringify(data, null, 2));
    
    if (data.results && data.results.length > 0) {
      devLog('[findPlaceIdByUrl] Found place_id via Text Search API:', data.results[0].place_id);
      return data.results[0].place_id;
    }
    
    devLog('[findPlaceIdByUrl] No place_id found via API');
    return null;
  } catch (error) {
    console.error('[findPlaceIdByUrl] Error finding place_id:', error);
    return null;
  }
}

// Fetch reviews from Google Places API
async function fetchGoogleReviews(placeId: string, apiKey: string): Promise<GoogleReview[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }
    
    if (!data.result || !data.result.reviews) {
      return [];
    }
    
    // Transform Google reviews to our format
    return data.result.reviews.map((review: any) => ({
      author: review.author_name || 'Anonymous',
      rating: review.rating || 5,
      text: review.text || '',
      date: review.time ? new Date(review.time * 1000).toISOString().split('T')[0] : undefined,
    }));
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    throw error;
  }
}

// Resolve shortened Google Maps URLs (maps.app.goo.gl)
async function resolveShortUrl(shortUrl: string): Promise<string> {
  try {
    devLog('[resolveShortUrl] Resolving short URL:', shortUrl);
    
    // Follow redirects to get the full URL
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    // Get the final URL after redirects
    const finalUrl = response.url;
    devLog('[resolveShortUrl] Resolved to:', finalUrl);
    
    return finalUrl;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[resolveShortUrl] Timeout resolving short URL:', shortUrl);
    } else {
      console.error('[resolveShortUrl] Error resolving short URL:', error);
    }
    return shortUrl; // Return original if resolution fails
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let businessUrl = searchParams.get('url');
    const manualPlaceId = searchParams.get('placeId'); // Optional manual place_id
    
    if (!businessUrl && !manualPlaceId) {
      return NextResponse.json(
        { error: 'Google Business URL or Place ID is required' },
        { status: 400 }
      );
    }
    
    // Check for API key (try both NEXT_PUBLIC_ and non-prefixed versions)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('[google-reviews] Google Maps API key not found in environment variables');
      console.error('[google-reviews] Available env vars:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));
      return NextResponse.json(
        { 
          error: 'Google Maps API key is not configured',
          hint: 'Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your Vercel environment variables'
        },
        { status: 500 }
      );
    }
    
    // If it's a short URL, resolve it first
    if (businessUrl && (businessUrl.includes('maps.app.goo.gl') || businessUrl.includes('goo.gl'))) {
      devLog('[google-reviews] Detected short URL, resolving...');
      businessUrl = await resolveShortUrl(businessUrl);
      devLog('[google-reviews] Resolved URL:', businessUrl);
    }
    
    let placeId = manualPlaceId;
    
    // If no manual place_id, try to extract from URL
    if (!placeId && businessUrl) {
      devLog('[google-reviews] Processing URL:', businessUrl);
      placeId = extractPlaceId(businessUrl);
      
      // If we couldn't extract it, try API search
      if (!placeId) {
        devLog('[google-reviews] Could not extract place_id, trying API search...');
        placeId = await findPlaceIdByUrl(businessUrl, apiKey);
      }
    }
    
    if (!placeId) {
      console.error('[google-reviews] Failed to find place_id for URL:', businessUrl);
      
      // Provide helpful debugging info
      const debugInfo = {
        url: businessUrl,
        hasPlaceParam: businessUrl?.includes('place_id='),
        hasPlacePath: businessUrl?.includes('/place/'),
        hasDataParam: businessUrl?.includes('data='),
        hasCid: businessUrl?.includes('cid='),
        urlLength: businessUrl?.length,
      };
      
      console.error('[google-reviews] URL debug info:', debugInfo);
      
      return NextResponse.json(
        { 
          error: 'Could not find Google Business place_id from URL',
          url: businessUrl,
          debug: debugInfo,
          suggestion: 'Please ensure the URL is a valid Google Business Profile URL. You can also add the place_id manually in Sanity (SEO tab → Google Place ID field). To find the place_id: 1) Open your Google Business Profile in a browser, 2) Look in the URL for "!1s" followed by a long string (27+ characters), 3) Or look for "place_id=" in the URL, 4) Copy that string and paste it into the "Google Place ID" field in Sanity.'
        },
        { status: 404 }
      );
    }
    
    devLog('[google-reviews] Using place_id:', placeId);
    
    // Fetch reviews
    const reviews = await fetchGoogleReviews(placeId, apiKey);
    
    return NextResponse.json(
      { reviews, placeId },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error: any) {
    console.error('Error in google-reviews endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

