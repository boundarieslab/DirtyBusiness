// =====================================================
// DIRTY BUSINESS - Settings
// =====================================================

// Map center: OSLO
const mapCenter = [59.91, 10.75];
const mapZoom = 11;

// =====================================================
// DATA SOURCE - Google Sheets (Published CSV)
// =====================================================
const dataURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnON3VXUjMLUIfRVxtv_3UOAt_Juyx5ShiNkmoGWs7sQWaNqpK6eh3usIMg44OswkVg8iNa5VdhFWv/pub?output=csv';

// =====================================================
// BASE MAPS
// =====================================================
const basemaps = {
    
    // CartoDB Dark Matter - detailed dark basemap
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        options: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }
    },
    
    // Satellite (Norge i Bilder)
    satellite: {
        url: 'https://waapi.webatlas.no/maptiles/tiles/webatlas-orto-newup/wa_grid/{z}/{x}/{y}.jpeg?api_key=b8e36d51-0e18-4792-9450-f2e33db95095',
        options: {
            attribution: '&copy; <a href="https://www.norgeibilder.no">Norge i Bilder</a>',
            maxZoom: 19
        }
    },
    
    // Kartverket Topographic
    topo: {
        url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png',
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
            opacity: 0.4,
            attribution: '&copy; Kartverket'
        }
    },
    
    // Contaminated Ground (Miljødirektoratet)
    contaminated: {
        url: 'https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer',
        options: {
            layers: 'forurenset_omrade,forurenset_omrade_pkt',
            format: 'image/png',
            transparent: true,
            opacity: 0.7,
            attribution: '&copy; Miljødirektoratet'
        }
    },
    
    // Quick Clay Zones (NVE)
    quickclay: {
        url: 'https://gis3.nve.no/map/services/SkredKvikkleire2/MapServer/WMSServer',
        options: {
            layers: '0,1,2,3',
            format: 'image/png',
            transparent: true,
            opacity: 0.6,
            attribution: '&copy; NVE'
        }
    }
};

// =====================================================
// GOOGLE DRIVE FOLDER STRUCTURE
// =====================================================
/*
To add images/documents from Google Drive:

1. Upload file to your DirtyBusiness folder
2. Right-click → Share → "Anyone with the link can view"
3. Copy the file ID from the URL

For IMAGES in spreadsheet:
https://drive.google.com/uc?export=view&id=FILE_ID_HERE

For PDFs/Documents:
https://drive.google.com/file/d/FILE_ID_HERE/preview

Example:
If share link is: https://drive.google.com/file/d/1ABC123xyz/view
Image URL: https://drive.google.com/uc?export=view&id=1ABC123xyz
*/
