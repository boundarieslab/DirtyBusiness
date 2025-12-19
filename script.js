// ============================================
// DIRTY BUSINESS - Main Script
// ============================================

let map;
let currentLang = 'en';
let placesData = [];
let markers = [];
let basemapLayers = {};
let overlayLayers = {};
let currentBasemap = 'dark';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initIntroOverlay();
});

function initIntroOverlay() {
    const enterBtn = document.getElementById('enter-map');
    const introOverlay = document.getElementById('intro-overlay');
    const mainContainer = document.getElementById('main-container');
    
    enterBtn.addEventListener('click', function() {
        introOverlay.style.display = 'none';
        mainContainer.style.display = 'flex';
        initMap();
        loadData();
    });
    
    // Show intro button in sidebar
    document.getElementById('show-intro').addEventListener('click', function() {
        introOverlay.style.display = 'flex';
        mainContainer.style.display = 'none';
    });
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

function initLanguageToggle() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active state on all toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Show/hide language-specific content
    document.querySelectorAll('[data-lang-en]').forEach(el => {
        el.style.display = lang === 'en' ? '' : 'none';
    });
    document.querySelectorAll('[data-lang-no]').forEach(el => {
        el.style.display = lang === 'no' ? '' : 'none';
    });
    
    // Update gallery if data is loaded
    if (placesData.length > 0) {
        updateGallery();
    }
}

// ============================================
// MAP INITIALIZATION
// ============================================

function initMap() {
    map = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false
    });
    
    // Add zoom control to bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    
    // Add scale
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);
    
    // Initialize base maps
    initBasemaps();
    
    // Initialize overlays
    initOverlays();
    
    // Set default basemap
    setBasemap('dark');
    
    // Initialize controls
    initMapControls();
}

function initBasemaps() {
    for (const [key, config] of Object.entries(basemaps)) {
        if (config.type === 'wmts') {
            basemapLayers[key] = L.tileLayer(config.url, config.options);
        }
    }
}

function initOverlays() {
    // Hillshade
    if (overlays.hillshade) {
        const hillshadeConfig = overlays.hillshade;
        overlayLayers.hillshade = L.tileLayer.wms(hillshadeConfig.url, hillshadeConfig.options);
        
        // Apply className for blend mode
        overlayLayers.hillshade.on('add', function() {
            const container = this.getContainer();
            if (container && hillshadeConfig.className) {
                container.classList.add(hillshadeConfig.className);
            }
        });
    }
    
    // Contaminated ground
    if (overlays.contaminated) {
        const contaminatedConfig = overlays.contaminated;
        overlayLayers.contaminated = L.tileLayer.wms(contaminatedConfig.url, contaminatedConfig.options);
    }
}

function setBasemap(key) {
    // Remove current basemap
    if (basemapLayers[currentBasemap]) {
        map.removeLayer(basemapLayers[currentBasemap]);
    }
    
    // Add new basemap
    if (basemapLayers[key]) {
        basemapLayers[key].addTo(map);
        currentBasemap = key;
    }
    
    // Re-add hillshade on top if enabled
    const hillshadeToggle = document.getElementById('toggle-hillshade');
    if (hillshadeToggle && hillshadeToggle.checked && overlayLayers.hillshade) {
        map.removeLayer(overlayLayers.hillshade);
        overlayLayers.hillshade.addTo(map);
    }
}

// ============================================
// MAP CONTROLS
// ============================================

function initMapControls() {
    // Basemap radio buttons
    document.querySelectorAll('input[name="basemap"]').forEach(radio => {
        radio.addEventListener('change', function() {
            setBasemap(this.value);
        });
    });
    
    // Hillshade toggle
    const hillshadeToggle = document.getElementById('toggle-hillshade');
    if (hillshadeToggle) {
        // Add hillshade by default
        overlayLayers.hillshade.addTo(map);
        
        hillshadeToggle.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.hillshade.addTo(map);
            } else {
                map.removeLayer(overlayLayers.hillshade);
            }
        });
    }
    
    // Contaminated ground toggle
    const contaminatedToggle = document.getElementById('toggle-contaminated');
    if (contaminatedToggle) {
        contaminatedToggle.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.contaminated.addTo(map);
            } else {
                map.removeLayer(overlayLayers.contaminated);
            }
        });
    }
    
    // Hillshade opacity slider
    const opacitySlider = document.getElementById('hillshade-opacity');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
            if (overlayLayers.hillshade) {
                overlayLayers.hillshade.setOpacity(this.value / 100);
            }
        });
    }
}

// ============================================
// DATA LOADING
// ============================================

function loadData() {
    Papa.parse(dataLocation, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            placesData = results.data;
            addMarkers();
            updateGallery();
        },
        error: function(err) {
            console.error('Error loading data:', err);
        }
    });
}

// ============================================
// MARKERS
// ============================================

function addMarkers() {
    placesData.forEach((place, index) => {
        if (!place.Latitude || !place.Longitude) return;
        
        const lat = parseFloat(place.Latitude);
        const lng = parseFloat(place.Longitude);
        const status = (place.Status || 'active').toLowerCase();
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'marker-wrapper',
            html: `<div class="marker-icon ${status}"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
        
        const marker = L.marker([lat, lng], { icon: icon });
        
        // Add tooltip
        marker.bindTooltip(place.Name, {
            direction: 'right',
            offset: [10, 0]
        });
        
        // Click handler - open modal
        marker.on('click', function() {
            openPlaceModal(place);
        });
        
        marker.addTo(map);
        markers.push(marker);
    });
}

// ============================================
// GALLERY
// ============================================

function updateGallery() {
    const gallery = document.getElementById('gallery-grid');
    gallery.innerHTML = '';
    
    placesData.forEach((place, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const status = (place.Status || 'active').toLowerCase();
        const name = place.Name || 'Unknown';
        const image = place.Image1 || '';
        
        if (image) {
            item.innerHTML = `
                <img src="${image}" alt="${name}" onerror="this.style.display='none'">
                <span class="gallery-status ${status}"></span>
                <span class="gallery-label">${name}</span>
            `;
        } else {
            item.classList.add('no-image');
            item.innerHTML = `
                <span class="gallery-status ${status}"></span>
                <span class="gallery-label">${name}</span>
            `;
        }
        
        // Click to open modal
        item.addEventListener('click', function() {
            openPlaceModal(place);
            
            // Also fly to location on map
            if (place.Latitude && place.Longitude) {
                map.flyTo([parseFloat(place.Latitude), parseFloat(place.Longitude)], 14);
            }
        });
        
        gallery.appendChild(item);
    });
}

// ============================================
// POPUP MODAL
// ============================================

function openPlaceModal(place) {
    const modal = document.getElementById('popup-modal');
    const modalBody = document.getElementById('modal-body');
    
    const status = (place.Status || 'active').toLowerCase();
    const statusLabel = {
        'active': currentLang === 'en' ? 'Active' : 'Aktiv',
        'inactive': currentLang === 'en' ? 'Inactive' : 'Inaktiv',
        'illegal': currentLang === 'en' ? 'Illegal/Suspected' : 'Ulovlig/Mistenkt'
    };
    
    const description = currentLang === 'no' && place.Description_NO 
        ? place.Description_NO 
        : place.Description || '';
    
    // Build images HTML
    let imagesHtml = '';
    const images = [];
    for (let i = 1; i <= 5; i++) {
        if (place[`Image${i}`]) {
            images.push({
                src: place[`Image${i}`],
                caption: place[`Image${i}_Caption`] || ''
            });
        }
    }
    
    if (images.length > 0) {
        imagesHtml = `
            <div class="modal-images">
                ${images.map(img => `
                    <img src="${img.src}" alt="${img.caption}" 
                         onclick="openLightbox('${img.src}', '${img.caption.replace(/'/g, "\\'")}')"
                         onerror="this.style.display='none'">
                `).join('')}
            </div>
        `;
    }
    
    // Build documents HTML
    let docsHtml = '';
    const docs = [];
    for (let i = 1; i <= 5; i++) {
        if (place[`Document${i}`]) {
            docs.push({
                url: place[`Document${i}`],
                title: place[`Document${i}_Title`] || `Document ${i}`
            });
        }
    }
    
    if (docs.length > 0) {
        docsHtml = `
            <div class="modal-documents">
                <h4>${currentLang === 'en' ? 'Documents' : 'Dokumenter'}</h4>
                ${docs.map(doc => `
                    <a href="${doc.url}" target="_blank" class="modal-doc-link">${doc.title}</a>
                `).join('')}
            </div>
        `;
    }
    
    // Build meta HTML
    let metaHtml = '<div class="modal-meta">';
    
    if (place.Volume) {
        metaHtml += `
            <div class="modal-meta-item">
                <span class="modal-meta-label">${currentLang === 'en' ? 'Volume' : 'Volum'}</span>
                <span class="modal-meta-value">${parseInt(place.Volume).toLocaleString()} m³</span>
            </div>
        `;
    }
    
    if (place.Company) {
        metaHtml += `
            <div class="modal-meta-item">
                <span class="modal-meta-label">${currentLang === 'en' ? 'Operator' : 'Operatør'}</span>
                <span class="modal-meta-value">${place.Company}</span>
            </div>
        `;
    }
    
    if (place.StartYear) {
        metaHtml += `
            <div class="modal-meta-item">
                <span class="modal-meta-label">${currentLang === 'en' ? 'Started' : 'Startet'}</span>
                <span class="modal-meta-value">${place.StartYear}</span>
            </div>
        `;
    }
    
    if (place.Municipality) {
        metaHtml += `
            <div class="modal-meta-item">
                <span class="modal-meta-label">${currentLang === 'en' ? 'Municipality' : 'Kommune'}</span>
                <span class="modal-meta-value">${place.Municipality}</span>
            </div>
        `;
    }
    
    metaHtml += '</div>';
    
    // Directions link
    let directionsHtml = '';
    if (place.GoogleMapsLink) {
        directionsHtml = `
            <a href="${place.GoogleMapsLink}" target="_blank" class="modal-directions">
                ${currentLang === 'en' ? '→ Get directions' : '→ Få veibeskrivelse'}
            </a>
        `;
    }
    
    // Assemble modal content
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${place.Name}</h2>
            <span class="modal-status ${status}">${statusLabel[status] || status}</span>
        </div>
        ${imagesHtml}
        <div class="modal-description">${description}</div>
        ${metaHtml}
        ${docsHtml}
        ${directionsHtml}
    `;
    
    modal.style.display = 'block';
    
    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// ============================================
// LIGHTBOX
// ============================================

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    
    img.src = src;
    captionEl.textContent = caption || '';
    lightbox.classList.add('active');
    
    // Close handlers
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.onclick = function() {
        lightbox.classList.remove('active');
    };
    
    lightbox.onclick = function(e) {
        if (e.target === lightbox || e.target === img) {
            lightbox.classList.remove('active');
        }
    };
    
    // ESC key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Make openLightbox global for inline onclick
window.openLightbox = openLightbox;
