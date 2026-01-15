// ============================================
// DIRTY BUSINESS - Complete Fixed Version
// ============================================

const CONFIG = {
    dataURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS1KaVHKy2zLYGg4Urbhm2zjZkmuATNvIqJOxuECuU0wdickEExV-8G0vL1F7xG1WKn_ADmwwfSARan/pub?gid=0&single=true&output=csv',
    
    mapCenter: [60.0, 10.5],
    mapZoom: 8,
    siteZoomLevel: 14,
    
    basemaps: {
        satellite: {
            type: 'tile',
            // Esri World Imagery - free, no auth required
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            options: { 
                attribution: '&copy; Esri',
                maxZoom: 19
            }
        },
        grayscale: {
            type: 'tile',
            url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/{z}/{y}/{x}.png',
            options: { attribution: '&copy; Kartverket', maxZoom: 20 }
        },
        topo: {
            type: 'tile',
            url: 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png',
            options: { attribution: '&copy; Kartverket', maxZoom: 20 }
        }
    },
    
    overlays: {
        hillshade: {
            url: 'https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833',
            options: { layers: 'Terrengskygge', format: 'image/png', transparent: true, opacity: 0.4 }
        },
        contaminated: {
            url: 'https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer',
            options: { layers: '0', format: 'image/png', transparent: true, opacity: 0.7 }
        }
    },
    
    markerStyles: {
        'Deponi': { color: '#ff00ff', symbol: '●' },
        'Spesialdeponi': { color: '#ff00ff', symbol: '●' },
        'Industrideponi': { color: '#ff00ff', symbol: '●' },
        'Miljøpark': { color: '#ff00ff', symbol: '●' },
        'Massemottak': { color: '#00cccc', symbol: '■' },
        'Massesenter': { color: '#00cccc', symbol: '■' },
        'Kontrollstasjon': { color: '#00cccc', symbol: '■' },
        'Pukkverk': { color: '#99cc00', symbol: '▲' },
        'Gjenvinning': { color: '#ff6600', symbol: '◆' },
        'Gjenvinningsstasjon': { color: '#ff6600', symbol: '◆' },
        'default': { color: '#666666', symbol: '●' }
    },
    
    knownContaminants: {
        'pb': { symbol: 'Pb', name_en: 'Lead', name_no: 'Bly' },
        'bly': { symbol: 'Pb', name_en: 'Lead', name_no: 'Bly' },
        'lead': { symbol: 'Pb', name_en: 'Lead', name_no: 'Bly' },
        'hg': { symbol: 'Hg', name_en: 'Mercury', name_no: 'Kvikksølv' },
        'kvikksølv': { symbol: 'Hg', name_en: 'Mercury', name_no: 'Kvikksølv' },
        'cd': { symbol: 'Cd', name_en: 'Cadmium', name_no: 'Kadmium' },
        'kadmium': { symbol: 'Cd', name_en: 'Cadmium', name_no: 'Kadmium' },
        'as': { symbol: 'As', name_en: 'Arsenic', name_no: 'Arsen' },
        'arsen': { symbol: 'As', name_en: 'Arsenic', name_no: 'Arsen' },
        'cr': { symbol: 'Cr', name_en: 'Chromium', name_no: 'Krom' },
        'krom': { symbol: 'Cr', name_en: 'Chromium', name_no: 'Krom' },
        'cu': { symbol: 'Cu', name_en: 'Copper', name_no: 'Kobber' },
        'kobber': { symbol: 'Cu', name_en: 'Copper', name_no: 'Kobber' },
        'zn': { symbol: 'Zn', name_en: 'Zinc', name_no: 'Sink' },
        'sink': { symbol: 'Zn', name_en: 'Zinc', name_no: 'Sink' },
        'ni': { symbol: 'Ni', name_en: 'Nickel', name_no: 'Nikkel' },
        'nikkel': { symbol: 'Ni', name_en: 'Nickel', name_no: 'Nikkel' },
        'pah': { symbol: 'PAH', name_en: 'PAH', name_no: 'PAH' },
        'pcb': { symbol: 'PCB', name_en: 'PCB', name_no: 'PCB' },
        'pfas': { symbol: 'PFAS', name_en: 'PFAS', name_no: 'PFAS' },
        'oil': { symbol: 'Oil', name_en: 'Oil', name_no: 'Olje' },
        'olje': { symbol: 'Oil', name_en: 'Oil', name_no: 'Olje' },
        'thc': { symbol: 'THC', name_en: 'THC', name_no: 'THC' },
        'btex': { symbol: 'BTEX', name_en: 'BTEX', name_no: 'BTEX' }
    },
    
    translations: {
        en: {
            selectSite: 'Select a site',
            clickMarker: 'Click on a marker to view details',
            description: 'Description',
            details: 'Details',
            company: 'Company',
            operator: 'Operator',
            parent: 'Parent Company',
            accepts: 'Accepts',
            capacity: 'Capacity',
            waterRecipient: 'Water Recipient',
            risk: 'Risk',
            started: 'Started',
            permitAuthority: 'Permit Authority',
            contaminants: 'Contaminants',
            links: 'Links',
            website: 'Website',
            permitDocs: 'Permit Documents',
            noImages: 'No Images Available',
            noDescription: 'No description available'
        },
        no: {
            selectSite: 'Velg et sted',
            clickMarker: 'Klikk på en markør for å se detaljer',
            description: 'Beskrivelse',
            details: 'Detaljer',
            company: 'Selskap',
            operator: 'Operatør',
            parent: 'Morselskap',
            accepts: 'Mottar',
            capacity: 'Kapasitet',
            waterRecipient: 'Vannresipient',
            risk: 'Risiko',
            started: 'Startet',
            permitAuthority: 'Tillatelsesmyndighet',
            contaminants: 'Forurensning',
            links: 'Lenker',
            website: 'Nettside',
            permitDocs: 'Tillatelsesdokumenter',
            noImages: 'Ingen bilder tilgjengelig',
            noDescription: 'Ingen beskrivelse tilgjengelig'
        }
    }
};

// Global state
let map;
let markers = [];
let currentLang = 'en';
let siteData = [];
let overlayLayers = {};
let currentSite = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    setupEventListeners();
});

// ============================================
// MAP INITIALIZATION
// ============================================

function initMap() {
    map = L.map('map', {
        zoomControl: false
    }).setView(CONFIG.mapCenter, CONFIG.mapZoom);

    // Zoom control - top left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Scale bar - bottom right
    L.control.scale({ 
        position: 'bottomright',
        metric: true,
        imperial: false,
        maxWidth: 120
    }).addTo(map);

    // Default basemap - satellite
    updateBasemap('satellite');
}

function updateBasemap(type) {
    const config = CONFIG.basemaps[type];
    if (!config) return;
    
    if (window.currentBasemap) {
        map.removeLayer(window.currentBasemap);
    }
    
    window.currentBasemap = L.tileLayer(config.url, config.options).addTo(map);
}

// ============================================
// DATA LOADING
// ============================================

function loadData() {
    Papa.parse(CONFIG.dataURL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            siteData = results.data.filter(row => row.Name && row.Latitude && row.Longitude);
            renderMarkers();
        },
        error: function(err) {
            console.error('Error loading CSV:', err);
        }
    });
}

// ============================================
// MARKER RENDERING
// ============================================

function renderMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    siteData.forEach((site) => {
        const lat = parseFloat(site.Latitude);
        const lon = parseFloat(site.Longitude);
        
        if (isNaN(lat) || isNaN(lon)) return;

        const style = CONFIG.markerStyles[site.Type] || CONFIG.markerStyles['default'];
        
        // Clean icon - no shadow
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="color:${style.color};font-size:16px;line-height:1;">${style.symbol}</div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker([lat, lon], { icon: icon })
            .addTo(map)
            .on('click', () => {
                currentSite = site;
                updateSidebar(site);
            });
        
        marker.bindTooltip(site.Name, { direction: 'top', offset: [0, -8] });
        markers.push(marker);
    });
}

// ============================================
// SIDEBAR UPDATE - Fully translated
// ============================================

function updateSidebar(site) {
    const content = document.getElementById('sidebarContent');
    const imageArea = document.getElementById('siteImages');
    const t = CONFIG.translations[currentLang];

    // Handle images
    const imageUrl = site.Images || site.Image || site.Image1 || site.Thumbnail || '';
    if (imageUrl.trim()) {
        let imgSrc = imageUrl.trim();
        // Handle Google Drive links
        if (imgSrc.includes('drive.google.com')) {
            const match = imgSrc.match(/\/d\/([^\/]+)/);
            if (match) {
                imgSrc = `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
        }
        imageArea.innerHTML = `<img src="${imgSrc}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'>${t.noImages}</div>'">`;
    } else {
        imageArea.innerHTML = `<div class="image-placeholder">${t.noImages}</div>`;
    }

    const style = CONFIG.markerStyles[site.Type] || CONFIG.markerStyles['default'];
    
    // Location
    const locationParts = [site.Place, site.Municipality, site.County].filter(p => p && p.trim());
    const locationStr = locationParts.join(', ');
    
    // Description based on language
    const description = currentLang === 'no' 
        ? (site.Description_NO || site.Description || t.noDescription)
        : (site.Description || site.Description_NO || t.noDescription);

    // Build HTML
    let html = `
        <div class="site-header">
            <h1 class="site-name">${site.Name || 'Unknown'}</h1>
            <div class="site-location">${locationStr}</div>
        </div>
        
        <div class="type-badges">
            <span class="type-badge" style="border-color:${style.color}; color:${style.color}">${site.Type || 'Unknown'}</span>
            ${site.Subtype ? `<span class="type-badge subtype">${site.Subtype}</span>` : ''}
            ${site.Status ? `<span class="type-badge status-${site.Status.toLowerCase()}">${site.Status}</span>` : ''}
        </div>
        
        <div class="section-block">
            <div class="section-label">${t.description}</div>
            <div class="section-content">${description}</div>
        </div>
    `;
    
    // Contaminants - ONLY show present ones
    const presentContaminants = parseContaminants(site.Contaminants || '');
    if (presentContaminants.length > 0) {
        html += `
            <div class="section-block">
                <div class="section-label">${t.contaminants}</div>
                <div class="chemical-grid">
                    ${presentContaminants.map(chem => {
                        const name = currentLang === 'no' ? chem.name_no : chem.name_en;
                        return `<div class="chemical-box" title="${name}"><span class="chemical-symbol">${chem.symbol}</span></div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Details section
    html += `<div class="section-block"><div class="section-label">${t.details}</div>`;
    
    if (site.Company) html += `<div class="info-row"><span class="info-label">${t.company}</span><span class="info-value">${site.Company}</span></div>`;
    if (site.Operator) html += `<div class="info-row"><span class="info-label">${t.operator}</span><span class="info-value">${site.Operator}</span></div>`;
    if (site.ParentCompany) html += `<div class="info-row"><span class="info-label">${t.parent}</span><span class="info-value">${site.ParentCompany}</span></div>`;
    if (site.MassesAccepted) html += `<div class="info-row"><span class="info-label">${t.accepts}</span><span class="info-value">${site.MassesAccepted}</span></div>`;
    if (site.TotalCapacity) html += `<div class="info-row"><span class="info-label">${t.capacity}</span><span class="info-value">${formatNumber(site.TotalCapacity)} ${site.CapacityUnit || 'm³'}</span></div>`;
    if (site.WaterRecipient) html += `<div class="info-row"><span class="info-label">${t.waterRecipient}</span><span class="info-value">${site.WaterRecipient}</span></div>`;
    if (site.EnvironmentalRisk) html += `<div class="info-row"><span class="info-label">${t.risk}</span><span class="info-value">${site.EnvironmentalRisk}</span></div>`;
    if (site.StartYear) html += `<div class="info-row"><span class="info-label">${t.started}</span><span class="info-value">${site.StartYear}</span></div>`;
    if (site.PermitAuthority) html += `<div class="info-row"><span class="info-label">${t.permitAuthority}</span><span class="info-value">${site.PermitAuthority}</span></div>`;
    
    html += `</div>`;
    
    // Links section - NO emoji symbols
    const hasLinks = site.Website || site.GoogleMapsLink || site.PermitDocuments;
    if (hasLinks) {
        html += `<div class="section-block"><div class="section-label">${t.links}</div>`;
        if (site.Website) html += `<a href="${site.Website}" target="_blank" class="link-item">${t.website}</a>`;
        if (site.GoogleMapsLink) html += `<a href="${site.GoogleMapsLink}" target="_blank" class="link-item">Google Maps</a>`;
        if (site.PermitDocuments) html += `<a href="${site.PermitDocuments}" target="_blank" class="link-item">${t.permitDocs}</a>`;
        html += `</div>`;
    }

    content.innerHTML = html;
    map.flyTo([parseFloat(site.Latitude), parseFloat(site.Longitude)], CONFIG.siteZoomLevel);
}

// Parse contaminants - return only unique present ones
function parseContaminants(str) {
    if (!str || !str.trim()) return [];
    
    const items = str.toLowerCase().split(/[,;]/).map(s => s.trim()).filter(s => s);
    const found = new Map(); // Use map to avoid duplicates by symbol
    
    items.forEach(item => {
        for (const [key, data] of Object.entries(CONFIG.knownContaminants)) {
            if (item.includes(key) && !found.has(data.symbol)) {
                found.set(data.symbol, data);
                break;
            }
        }
    });
    
    return Array.from(found.values());
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.panel;
            showPanel(target);
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Language Toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLanguageUI();
            // Re-render sidebar if site selected
            if (currentSite) {
                updateSidebar(currentSite);
            }
        });
    });

    // Basemap Switcher
    document.querySelectorAll('input[name="basemap"]').forEach(input => {
        input.addEventListener('change', (e) => updateBasemap(e.target.value));
    });

    // Overlay toggles
    setupOverlayToggle('toggle-hillshade', 'hillshade');
    setupOverlayToggle('toggle-contaminated', 'contaminated');
}

function setupOverlayToggle(elementId, overlayKey) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const config = CONFIG.overlays[overlayKey];
    if (!config) return;
    
    el.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (!overlayLayers[overlayKey]) {
                overlayLayers[overlayKey] = L.tileLayer.wms(config.url, config.options);
            }
            overlayLayers[overlayKey].addTo(map);
        } else {
            if (overlayLayers[overlayKey]) map.removeLayer(overlayLayers[overlayKey]);
        }
    });
}

// ============================================
// UI FUNCTIONS
// ============================================

function showPanel(id) {
    document.querySelectorAll('.overlay-panel').forEach(p => p.classList.remove('active'));
    
    const mapUI = ['.map-controls', '.legend', '.north-arrow', '.leaflet-control-zoom', '.leaflet-control-scale'];
    
    if (id !== 'map') {
        const panel = document.getElementById(`panel-${id}`);
        if (panel) panel.classList.add('active');
        mapUI.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });
    } else {
        mapUI.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'block';
        });
    }
}

function updateLanguageUI() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.classList.contains('lang-btn')) return;
        el.style.display = (el.dataset.lang === currentLang) ? '' : 'none';
    });
    
    // Reset sidebar if no site selected
    if (!currentSite) {
        const t = CONFIG.translations[currentLang];
        document.getElementById('siteImages').innerHTML = `<div class="image-placeholder">${currentLang === 'en' ? 'Select a site on the map' : 'Velg et sted på kartet'}</div>`;
        document.getElementById('sidebarContent').innerHTML = `
            <div class="site-header">
                <h1 class="site-name">${t.selectSite}</h1>
                <div class="site-location">${t.clickMarker}</div>
            </div>
        `;
    }
}

function formatNumber(num) {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// ============================================
// LIGHTBOX
// ============================================

window.openLightbox = function(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('active');
};

window.closeLightbox = function() {
    document.getElementById('lightbox').classList.remove('active');
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
