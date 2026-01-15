// ============================================
// DIRTY BUSINESS - Settings & Configuration
// ============================================

// MAP DEFAULTS
const mapCenter = [59.95, 10.85];  // Oslo region
const mapZoom = 10;
const siteZoomLevel = 16;  // Zoom level when clicking a site

// DATA SOURCE (Google Sheets published as CSV)
// For testing: use local data.csv
// For production: replace with your Google Sheets published CSV URL
// Example: 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv'
const dataLocation = 'data.csv';

// ABOUT & CREDITS CONTENT URLs
// Can be published Google Docs or HTML files
const aboutDocUrl = 'about.html';
const creditsDocUrl = 'credits.html';

// ============================================
// BASEMAPS
// ============================================

const basemaps = {
    grayscale: {
        url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/{z}/{y}/{x}.png',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 20
        }
    },
    satellite: {
        url: 'https://waapi.webatlas.no/maptiles/tiles/webatlas-orto-newup/wa_grid/{z}/{x}/{y}.jpeg?api_key=b8e36d35-b325-4e57-984f-e055ad30e414',
        options: {
            attribution: '&copy; <a href="https://norgeibilder.no">Norge i Bilder</a>',
            maxZoom: 20
        }
    },
    topo: {
        url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 20
        }
    }
};

// ============================================
// OVERLAY LAYERS (WMS)
// ============================================

const overlays = {
    hillshade: {
        url: 'https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833',
        options: {
            layers: 'Terrengskygge',
            format: 'image/png',
            transparent: true,
            opacity: 0.4,
            attribution: '&copy; Kartverket'
        }
    },
    contaminated: {
        url: 'https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer',
        options: {
            layers: '0',
            format: 'image/png',
            transparent: true,
            opacity: 0.7,
            attribution: '&copy; Miljødirektoratet'
        }
    }
};

// ============================================
// MARKER STYLES BY TYPE
// ============================================

const markerStyles = {
    'Deponi': {
        color: '#ff00ff',
        symbol: '●'
    },
    'Massemottak': {
        color: '#00ffff',
        symbol: '■'
    },
    'Pukkverk': {
        color: '#ccff00',
        symbol: '▲'
    },
    'Gjenvinning': {
        color: '#ff6600',
        symbol: '◆'
    },
    'default': {
        color: '#999999',
        symbol: '●'
    }
};

// ============================================
// KNOWN CONTAMINANTS (for chemical grid)
// ============================================

const knownContaminants = {
    'pb': { symbol: 'Pb', name: 'Lead' },
    'hg': { symbol: 'Hg', name: 'Mercury' },
    'cd': { symbol: 'Cd', name: 'Cadmium' },
    'as': { symbol: 'As', name: 'Arsenic' },
    'cr': { symbol: 'Cr', name: 'Chromium' },
    'cu': { symbol: 'Cu', name: 'Copper' },
    'zn': { symbol: 'Zn', name: 'Zinc' },
    'ni': { symbol: 'Ni', name: 'Nickel' },
    'pah': { symbol: 'PAH', name: 'PAH' },
    'pcb': { symbol: 'PCB', name: 'PCB' },
    'pfas': { symbol: 'PFAS', name: 'PFAS' },
    'oil': { symbol: 'Oil', name: 'Petroleum' }
};
