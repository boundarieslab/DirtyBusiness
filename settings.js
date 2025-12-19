// =====================================================
// DIRTY BUSINESS - Settings
// =====================================================

// Map center: OSLO
const mapCenter = [59.91, 10.75];
const mapZoom = 11;

// Data source - local CSV or Google Sheets URL
const dataLocation = 'data/places.csv';

// =====================================================
// BASE MAPS
// =====================================================

const basemaps = {
    // Dark grayscale (default)
    dark: {
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4graatone&zoom={z}&x={x}&y={y}',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 19
        }
    },
    
    // Satellite (Norge i Bilder)
    satellite: {
        url: 'https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Nibcache_web_mercator_v2&STYLE=default&FORMAT=image/jpgpng&TILEMATRIXSET=default028mm&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        options: {
            subdomains: ['', '2', '3'],
            attribution: '&copy; <a href="https://norgeibilder.no">Norge i Bilder</a>',
            maxZoom: 19
        }
    },
    
    // Color topographic
    topo: {
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
        options: {
            attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
            maxZoom: 19
        }
    }
};

// =====================================================
// WMS OVERLAY LAYERS
// =====================================================

const overlays = {
    
    // DTM Hillshade (Kartverket)
    hillshade: {
        url: 'https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833',
        options: {
            layers: 'nhm_dtm_25833_terrengskyggerelieff',
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            attribution: '&copy; Kartverket'
        },
        className: 'hillshade-layer'
    },
    
    // Contaminated Ground / Forurenset grunn (Miljødirektoratet)
    // Shows contaminated sites and landfills
    contaminated: {
        url: 'https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer',
        options: {
            layers: '0,1,2,3',
            format: 'image/png',
            transparent: true,
            opacity: 0.7,
            attribution: '&copy; <a href="https://miljodirektoratet.no">Miljødirektoratet</a>'
        }
    },
    
    // Quick Clay Risk / Kvikkleire aktsomhet (NVE)
    // Shows areas with potential quick clay landslide risk
    quickclay: {
        url: 'https://nve.geodataonline.no/arcgis/services/KvikkleireskredAktsomhet/MapServer/WMSServer',
        options: {
            layers: '0',
            format: 'image/png',
            transparent: true,
            opacity: 0.6,
            attribution: '&copy; <a href="https://nve.no">NVE</a>'
        }
    },
    
    // Surficial Deposits / Løsmasser (NGU)
    // Shows quaternary geology / soil types
    surficial: {
        url: 'https://geo.ngu.no/mapserver/LosijordWMS',
        options: {
            layers: 'Losmasse_flate',
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            attribution: '&copy; <a href="https://ngu.no">NGU</a>'
        }
    }
};

// =====================================================
// GOOGLE DRIVE INSTRUCTIONS
// =====================================================
/*
To use images/PDFs from Google Drive:

1. Upload file to Google Drive
2. Right-click → Share → "Anyone with the link can view"
3. Copy the file ID from the share URL

Share URL format:
https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing

For IMAGES, use this URL in CSV:
https://drive.google.com/uc?export=view&id=FILE_ID_HERE

For PDFs, use this URL in CSV:
https://drive.google.com/file/d/FILE_ID_HERE/preview

Example:
If share link is: https://drive.google.com/file/d/1ABC123xyz/view
Image URL: https://drive.google.com/uc?export=view&id=1ABC123xyz
PDF URL: https://drive.google.com/file/d/1ABC123xyz/preview
*/
