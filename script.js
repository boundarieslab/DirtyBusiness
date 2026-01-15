// ============================================
// DIRTY BUSINESS - Main Script
// ============================================

let map;
let markers = [];
let currentLang = 'en';
let siteData = [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    setupEventListeners();
});

// 1. MAP INITIALIZATION
function initMap() {
    map = L.map('map', {
        zoomControl: false
    }).setView(mapCenter, mapZoom);

    // Add Zoom Control to Top Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Set Default Basemap
    updateBasemap('grayscale');
}

function updateBasemap(type) {
    const config = basemaps[type];
    if (window.currentBasemap) map.removeLayer(window.currentBasemap);
    window.currentBasemap = L.tileLayer(config.url, config.options).addTo(map);
}

// 2. DATA LOADING (CSV)
function loadData() {
    Papa.parse(dataLocation, {
        download: true,
        header: true,
        complete: function(results) {
            siteData = results.data;
            renderMarkers();
        },
        error: function(err) {
            console.error("Error loading CSV:", err);
        }
    });
}

// 3. MARKER RENDERING
function renderMarkers() {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    siteData.forEach((site, index) => {
        if (!site.lat || !site.lon) return;

        const style = markerStyles[site.type] || markerStyles['default'];
        
        // Custom Icon using DivIcon for the geometric symbols
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="color: ${style.color}; font-size: 18px; text-shadow: 0 0 3px #fff;">${style.symbol}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([parseFloat(site.lat), parseFloat(site.lon)], { icon: icon })
            .addTo(map)
            .on('click', () => updateSidebar(site));
        
        // Simple Tooltip
        marker.bindTooltip(site.name, { direction: 'top', offset: [0, -10] });
        
        markers.push(marker);
    });
}

// 4. SIDEBAR LOGIC
function updateSidebar(site) {
    const content = document.getElementById('sidebarContent');
    const imageArea = document.getElementById('siteImages');

    // Update Images (Handle slideshow or placeholder)
    if (site.images) {
        const imgs = site.images.split(',');
        imageArea.innerHTML = `<img src="${imgs[0]}" class="slide active" onclick="openLightbox('${imgs[0]}')">`;
    } else {
        imageArea.innerHTML = `<div class="image-placeholder">No Images Available</div>`;
    }

    // Generate Content HTML
    let html = `
        <div class="site-header">
            <h1 class="site-name">${site.name}</h1>
            <div class="site-location">${site.location || ''}</div>
        </div>
        <div class="type-badges">
            <span class="type-badge" style="border-color:${markerStyles[site.type]?.color}">${site.type}</span>
        </div>
        
        <div class="section-block">
            <div class="section-label">${currentLang === 'en' ? 'Description' : 'Beskrivelse'}</div>
            <div class="section-content">${currentLang === 'en' ? (site.desc_en || site.desc_no) : (site.desc_no || site.desc_en)}</div>
        </div>

        <div class="section-block">
            <div class="section-label">${currentLang === 'en' ? 'Contaminants' : 'Forurensning'}</div>
            <div class="chemical-grid">
                ${renderChemicals(site.contaminants)}
            </div>
        </div>

        <div class="section-block">
            <div class="info-row">
                <span class="info-label">Operator:</span>
                <span class="info-value">${site.operator || 'Unknown'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">${site.status || 'Active'}</span>
            </div>
        </div>
    `;

    content.innerHTML = html;
    map.flyTo([site.lat, site.lon], siteZoomLevel);
}

function renderChemicals(contaminantsStr) {
    if (!contaminantsStr) return '<span style="font-size:10px; color:#999;">None reported</span>';
    
    const list = contaminantsStr.toLowerCase().split(',').map(s => s.trim());
    return Object.keys(knownContaminants).map(key => {
        const isPresent = list.includes(key);
        const chem = knownContaminants[key];
        return `
            <div class="chemical-box ${isPresent ? 'present' : ''}" title="${chem.name}">
                <span class="chemical-symbol">${chem.symbol}</span>
                <span class="chemical-name">${chem.name}</span>
            </div>
        `;
    }).join('');
}

// 5. UI CONTROLS & NAVIGATION
function setupEventListeners() {
    // Nav Tabs (Map, About, Credits)
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
        });
    });

    // Basemap Switcher
    document.querySelectorAll('input[name="basemap"]').forEach(input => {
        input.addEventListener('change', (e) => updateBasemap(e.target.value));
    });

    // Overlays
    setupOverlay('toggle-hillshade', overlays.hillshade);
    setupOverlay('toggle-contaminated', overlays.contaminated);
}

function setupOverlay(id, config) {
    let layer = L.tileLayer.wms(config.url, config.options);
    document.getElementById(id).addEventListener('change', (e) => {
        if (e.target.checked) layer.addTo(map);
        else map.removeLayer(layer);
    });
}

function showPanel(id) {
    document.querySelectorAll('.overlay-panel').forEach(p => p.classList.remove('active'));
    if (id !== 'map') {
        const panel = document.getElementById(`panel-${id}`);
        panel.classList.add('active');
        fetchContent(id);
    }
}

async function fetchContent(id) {
    const url = id === 'about' ? aboutDocUrl : creditsDocUrl;
    const container = document.getElementById(`${id}Content`);
    try {
        const response = await fetch(url);
        const text = await response.text();
        // Simple way to extract body if it's a published Google Doc
        container.innerHTML = text; 
    } catch (err) {
        container.innerHTML = "Error loading content.";
    }
}

function updateLanguageUI() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = (el.dataset.lang === currentLang) ? 'inline' : 'none';
        if (el.tagName === 'SPAN' && el.style.display === 'inline') el.style.display = 'inline-block';
    });
}

// Lightbox
window.openLightbox = (src) => {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.classList.add('active');
};

window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('active');
};
