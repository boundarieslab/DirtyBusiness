// =====================================================
// DIRTY BUSINESS - Main Script
// =====================================================

// Initialize map
const map = L.map('map', {
    center: mapCenter,
    zoom: mapZoom,
    zoomControl: true
});

// Move zoom control to bottom-left
map.zoomControl.setPosition('bottomleft');

// =====================================================
// BASE LAYERS
// =====================================================

// Satellite layer (default)
const satelliteLayer = L.tileLayer(basemaps.satellite.url, basemaps.satellite.options);
satelliteLayer.addTo(map);

// Topo layer (created but not added)
const topoLayer = L.tileLayer(basemaps.topo.url, basemaps.topo.options);

// Track current basemap
let currentBasemap = 'satellite';
let isGrayscale = false;

// =====================================================
// HILLSHADE OVERLAY (with multiply blend)
// =====================================================

const hillshadeLayer = L.tileLayer.wms(hillshadeWMS.url, {
    layers: hillshadeWMS.options.layers,
    format: hillshadeWMS.options.format,
    transparent: hillshadeWMS.options.transparent,
    opacity: hillshadeWMS.options.opacity,
    attribution: hillshadeWMS.options.attribution,
    className: 'hillshade-layer' // For CSS blend mode
});
hillshadeLayer.addTo(map);

// =====================================================
// LAYER CONTROLS
// =====================================================

// Basemap radio buttons
document.querySelectorAll('input[name="basemap"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const value = e.target.value;
        
        // Remove current basemap
        if (currentBasemap === 'satellite' || currentBasemap === 'satellite-bw') {
            map.removeLayer(satelliteLayer);
        } else if (currentBasemap === 'topo') {
            map.removeLayer(topoLayer);
        }
        
        // Remove grayscale class
        const tilePane = document.querySelector('.leaflet-tile-pane');
        tilePane.classList.remove('grayscale-tiles');
        
        // Add new basemap
        if (value === 'satellite') {
            satelliteLayer.addTo(map);
            currentBasemap = 'satellite';
            isGrayscale = false;
        } else if (value === 'satellite-bw') {
            satelliteLayer.addTo(map);
            // Apply grayscale filter after tiles load
            setTimeout(() => {
                const container = satelliteLayer.getContainer();
                if (container) container.style.filter = 'grayscale(100%) contrast(1.1)';
            }, 100);
            currentBasemap = 'satellite-bw';
            isGrayscale = true;
        } else if (value === 'topo') {
            topoLayer.addTo(map);
            currentBasemap = 'topo';
            isGrayscale = false;
         } else if (value === 'none') {
    currentBasemap = 'none';
    isGrayscale = false;
}
        
        // Make sure hillshade stays on top
        if (map.hasLayer(hillshadeLayer)) {
            hillshadeLayer.bringToFront();
        }
    });
});

// Hillshade toggle
document.getElementById('hillshade-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        hillshadeLayer.addTo(map);
    } else {
        map.removeLayer(hillshadeLayer);
    }
});

// Hillshade opacity
document.getElementById('hillshade-opacity').addEventListener('input', (e) => {
    hillshadeLayer.setOpacity(e.target.value / 100);
});

// =====================================================
// LANGUAGE TOGGLE
// =====================================================

const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'no' : 'en';
    updateLanguage();
});

function updateLanguage() {
    // Update toggle button
    const spans = langToggle.querySelectorAll('span');
    if (currentLang === 'en') {
        spans[0].className = 'lang-active';
        spans[1].className = 'lang-inactive';
    } else {
        spans[0].className = 'lang-inactive';
        spans[1].className = 'lang-active';
    }
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

// =====================================================
// SIDEBAR FUNCTIONALITY
// =====================================================

const sidebarIntro = document.getElementById('sidebar-intro');
const sidebarPlace = document.getElementById('sidebar-place');
const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
    sidebarPlace.style.display = 'none';
    sidebarIntro.style.display = 'block';
});

function showPlaceDetails(place) {
    sidebarIntro.style.display = 'none';
    sidebarPlace.style.display = 'block';
    
    // Name
    document.getElementById('place-name').textContent = place.Name;
    
    // Status
    const statusEl = document.getElementById('place-status');
    const status = place.Status ? place.Status.toLowerCase() : 'active';
    statusEl.textContent = statusLabels[currentLang][status] || status;
    statusEl.className = `place-status ${status}`;
    
    // Gallery
    const gallery = document.getElementById('place-gallery');
    gallery.innerHTML = '';
    
    const images = [];
    for (let i = 1; i <= 5; i++) {
        const imgKey = `Image${i}`;
        if (place[imgKey]) {
            images.push({
                src: place[imgKey],
                caption: place[`Image${i}_Caption`] || ''
            });
        }
    }
    
    if (images.length > 0) {
        const mainImg = document.createElement('img');
        mainImg.src = images[0].src;
        mainImg.alt = place.Name;
        mainImg.addEventListener('click', () => openLightbox(images, 0));
        gallery.appendChild(mainImg);
        
        if (images.length > 1) {
            const thumbs = document.createElement('div');
            thumbs.className = 'gallery-thumbs';
            images.forEach((img, idx) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.alt = `Image ${idx + 1}`;
                thumb.className = idx === 0 ? 'active' : '';
                thumb.addEventListener('click', () => {
                    mainImg.src = img.src;
                    thumbs.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                thumbs.appendChild(thumb);
            });
            gallery.appendChild(thumbs);
        }
    }
    
    // Description
    const descEl = document.getElementById('place-description');
    const descKey = currentLang === 'no' ? 'Description_NO' : 'Description';
    descEl.innerHTML = place[descKey] || place.Description || '';
    
    // Details
    const detailsEl = document.getElementById('place-details');
    detailsEl.innerHTML = '';
    
    const detailFields = [
        { key: 'Volume', label: { en: 'Volume', no: 'Volum' }, suffix: ' m³' },
        { key: 'Company', label: { en: 'Operator', no: 'Operatør' } },
        { key: 'StartYear', label: { en: 'Started', no: 'Startet' } },
        { key: 'Municipality', label: { en: 'Municipality', no: 'Kommune' } }
    ];
    
    detailFields.forEach(field => {
        if (place[field.key]) {
            const item = document.createElement('div');
            item.className = 'detail-item';
            item.innerHTML = `
                <div class="detail-label">${field.label[currentLang]}</div>
                <div class="detail-value">${place[field.key]}${field.suffix || ''}</div>
            `;
            detailsEl.appendChild(item);
        }
    });
    
    // Documents
    const docList = document.getElementById('document-list');
    docList.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const docKey = `Document${i}`;
        const docTitleKey = `Document${i}_Title`;
        if (place[docKey]) {
            const li = document.createElement('li');
            const title = place[docTitleKey] || `Document ${i}`;
            const ext = place[docKey].split('.').pop().toUpperCase();
            li.innerHTML = `
                <a href="${place[docKey]}" target="_blank">
                    <span class="doc-icon">📄</span>
                    <span>${title}</span>
                    <span style="color: var(--text-muted); font-size: 11px;">${ext}</span>
                </a>
            `;
            docList.appendChild(li);
        }
    }
    
    // Hide documents section if empty
    document.getElementById('place-documents').style.display = docList.children.length ? 'block' : 'none';
}

// =====================================================
// LIGHTBOX
// =====================================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
}

function updateLightbox() {
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxCaption.textContent = lightboxImages[lightboxIndex].caption || '';
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

document.getElementById('lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
});

document.getElementById('lightbox-prev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
});

document.getElementById('lightbox-next').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
});

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightbox();
    }
    if (e.key === 'ArrowRight') {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        updateLightbox();
    }
});

// =====================================================
// LOAD DATA AND CREATE MARKERS
// =====================================================

const markers = L.layerGroup().addTo(map);

function createMarker(place) {
    const lat = parseFloat(place.Latitude);
    const lng = parseFloat(place.Longitude);
    
    if (isNaN(lat) || isNaN(lng)) return;
    
    const status = place.Status ? place.Status.toLowerCase() : 'active';
    
    // Create custom div icon
    const icon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `<div class="custom-marker ${status}">●</div>`,
        iconSize: [iconWidth, iconHeight],
        iconAnchor: [iconWidth / 2, iconHeight / 2]
    });
    
    const marker = L.marker([lat, lng], { icon: icon });
    
    marker.on('click', () => {
        showPlaceDetails(place);
        map.panTo([lat, lng]);
    });
    
    // Optional: small popup on hover
    marker.bindTooltip(place.Name, {
        direction: 'top',
        offset: [0, -20],
        className: 'marker-tooltip'
    });
    
    markers.addLayer(marker);
}

function loadData() {
    Papa.parse(dataLocation, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Loaded', results.data.length, 'places');
            results.data.forEach(place => {
                if (place.Name && place.Latitude && place.Longitude) {
                    createMarker(place);
                }
            });
        },
        error: function(err) {
            console.error('Error loading data:', err);
        }
    });
}

// Load data on page load
loadData();

// =====================================================
// URL HASH FOR SHARING
// =====================================================

// Check for place in URL hash on load
window.addEventListener('load', () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
        // Will need to match with loaded data
        console.log('Looking for place:', hash);
    }
});

// =====================================================
// SCALE CONTROL
// =====================================================

L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomleft'
}).addTo(map);
