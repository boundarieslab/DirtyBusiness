// ============================================
// DIRTY BUSINESS - Settings
// ============================================

// Map center and zoom
const mapCenter = [59.95, 11.05];
const mapZoom = 10;

// Data source - can be local CSV or Google Sheets published URL
// For Google Sheets: File → Share → Publish to web → CSV
const dataLocation = 'data/places.csv';

// ============================================
// BASE MAPS
// ============================================

const basemaps = {
    // Dark grayscale topographic map (default)
    dark: {
        type: 'wmts',
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4graatone&zoom={z}&x={x}&y={y}',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 20
        }
    },
    
    // Satellite imagery
    satellite: {
        type: 'wmts',
        url: 'https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Nibcache_web_mercator_v2&STYLE=default&FORMAT=image/jpgpng&TILEMATRIXSET=default028mm&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        options: {
            subdomains: ['', '2', '3'],
            attribution: '&copy; <a href="https://norgeibilder.no">Norge i Bilder</a>',
            maxZoom: 20
        }
    },
    
    // Topographic color map
    topo: {
        type: 'wmts',
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 20
        }
    }
};

// ============================================
// OVERLAY LAYERS
// ============================================

const overlays = {
    // DTM Hillshade
    hillshade: {
        type: 'wms',
        url: 'https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833',
        options: {
            layers: 'nhm_dtm_25833_terrengskyggerelieff',
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>'
        },
        className: 'hillshade-layer'
    },
    
    // Contaminated ground (forurenset grunn)
    contaminated: {
        type: 'wms',
        url: 'https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer',
        options: {
            layers: '0,1,2,3',
            format: 'image/png',
            transparent: true,
            opacity: 0.7,
            attribution: '&copy; <a href="https://miljodirektoratet.no">Miljødirektoratet</a>'
        }
    }
};

// ============================================
// GOOGLE DRIVE HELPER
// ============================================
// To use images from Google Drive:
// 1. Upload image to Google Drive
// 2. Right-click → Share → Anyone with link can view
// 3. Copy the file ID from the URL (the long string after /d/)
// 4. Use this format in your CSV:
//    https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
//
// Example:
// If your share link is: https://drive.google.com/file/d/1ABC123xyz/view
// Your image URL should be: https://drive.google.com/uc?export=view&id=1ABC123xyz

// For PDFs:
// Use the same format, or link directly to the Google Drive preview:
// https://drive.google.com/file/d/YOUR_FILE_ID/preview
