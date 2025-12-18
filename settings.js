// =====================================================
// DIRTY BUSINESS - Settings
// =====================================================

// Map initial center (Romerike/Oslo region)
const mapCenter = [59.95, 11.05];
const mapZoom = 10;

// Data source - can be local CSV or Google Sheets published CSV
// To use Google Sheets: File > Publish to web > CSV, then paste URL here
const dataLocation = 'data/places.csv';

// Alternative: Google Sheets URL (uncomment and replace with your own)
// const dataLocation = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv';

// Marker icon settings
const iconWidth = 36;
const iconHeight = 36;

// Basemap tile sources
const basemaps = {
    // Kartverket Orthophoto (satellite)
    satellite: {
        url: 'https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Nibcache_web_mercator_v2&STYLE=default&FORMAT=image/jpgpng&tileMatrixSet=default028mm&tileMatrix={z}&tileRow={y}&tileCol={x}',
        options: {
            subdomains: ['', '2', '3'],
            attribution: '© <a href="https://www.norgeibilder.no/">Geovekst</a>',
            maxZoom: 19
        }
    },
    
    // Kartverket Topographic
    topo: {
        url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png',
        options: {
            attribution: '© <a href="https://www.kartverket.no/">Kartverket</a>',
            maxZoom: 18
        }
    }
};

// Hillshade WMS overlay
const hillshadeWMS = {
    url: 'https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833',
    options: {
        layers: 'NHM_DTM_25833:skyggerelieff',
        format: 'image/png',
        transparent: true,
        opacity: 0.4,
        attribution: '© <a href="https://www.kartverket.no/">Kartverket</a>'
    }
};

// Status translations
const statusLabels = {
    en: {
        active: 'Active',
        inactive: 'Closed',
        illegal: 'Suspected Illegal'
    },
    no: {
        active: 'Aktiv',
        inactive: 'Stengt',
        illegal: 'Mistenkt Ulovlig'
    }
};

// Current language (default)
let currentLang = 'en';
