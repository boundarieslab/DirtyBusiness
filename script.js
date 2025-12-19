// =====================================================
// DIRTY BUSINESS - Main Script
// =====================================================

let map;
let currentLang = 'en';
let placesData = [];
let markers = [];
let basemapLayers = {};
let overlayLayers = {};
let currentBasemap = 'dark';

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initControls();
    initLanguage();
    initSidebar();
    loadData();
});

// =====================================================
// MAP SETUP
// =====================================================

function initMap() {
    map = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false
    });
    
    // Zoom control bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    
    // Scale bar
    L.control.scale({ 
        metric: true, 
        imperial: false, 
        position: 'bottomleft' 
    }).addTo(map);
    
    // Initialize basemaps
    for (const [key, config] of Object.entries(basemaps)) {
        basemapLayers[key] = L.tileLayer(config.url, config.options);
    }
    
    // Initialize overlays
    initOverlays();
    
    // Set default basemap
    setBasemap('dark');
}

function initOverlays() {
    // Hillshade
    if (overlays.hillshade) {
        overlayLayers.hillshade = L.tileLayer.wms(overlays.hillshade.url, overlays.hillshade.options);
        overlayLayers.hillshade.on('add', function() {
            const container = this.getContainer();
            if (container && overlays.hillshade.className) {
                container.classList.add(overlays.hillshade.className);
            }
        });
        // Add by default
        overlayLayers.hillshade.addTo(map);
    }
    
    // Contaminated ground
    if (overlays.contaminated) {
        overlayLayers.contaminated = L.tileLayer.wms(overlays.contaminated.url, overlays.contaminated.options);
    }
    
    // Quick clay
    if (overlays.quickclay) {
        overlayLayers.quickclay = L.tileLayer.wms(overlays.quickclay.url, overlays.quickclay.options);
    }
    
    // Surficial deposits
    if (overlays.surficial) {
        overlayLayers.surficial = L.tileLayer.wms(overlays.surficial.url, overlays.surficial.options);
    }
}

function setBasemap(key) {
    // Remove current
    if (basemapLayers[currentBasemap]) {
        map.removeLayer(basemapLayers[currentBasemap]);
    }
    
    // Add new
    if (basemapLayers[key]) {
        basemapLayers[key].addTo(map);
        basemapLayers[key].bringToBack();
        currentBasemap = key;
    }
    
    // Re-add hillshade on top if active
    const hillshadeCheck = document.getElementById('layer-hillshade');
    if (hillshadeCheck && hillshadeCheck.checked && overlayLayers.hillshade) {
        map.removeLayer(overlayLayers.hillshade);
        overlayLayers.hillshade.addTo(map);
    }
}

// =====================================================
// CONTROLS
// =====================================================

function initControls() {
    // Basemap radio buttons
    document.querySelectorAll('input[name="basemap"]').forEach(radio => {
        radio.addEventListener('change', function() {
            setBasemap(this.value);
        });
    });
    
    // Hillshade toggle
    const hillshadeCheck = document.getElementById('layer-hillshade');
    if (hillshadeCheck) {
        hillshadeCheck.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.hillshade.addTo(map);
            } else {
                map.removeLayer(overlayLayers.hillshade);
            }
        });
    }
    
    // Contaminated toggle
    const contaminatedCheck = document.getElementById('layer-contaminated');
    if (contaminatedCheck) {
        contaminatedCheck.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.contaminated.addTo(map);
            } else {
                map.removeLayer(overlayLayers.contaminated);
            }
        });
    }
    
    // Quick clay toggle
    const quickclayCheck = document.getElementById('layer-quickclay');
    if (quickclayCheck) {
        quickclayCheck.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.quickclay.addTo(map);
            } else {
                map.removeLayer(overlayLayers.quickclay);
            }
        });
    }
    
    // Surficial toggle
    const surficialCheck = document.getElementById('layer-surficial');
    if (surficialCheck) {
        surficialCheck.addEventListener('change', function() {
            if (this.checked) {
                overlayLayers.surficial.addTo(map);
            } else {
                map.removeLayer(overlayLayers.surficial);
            }
        });
    }
    
    // Hillshade opacity
    const opacitySlider = document.getElementById('hillshade-opacity');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
            if (overlayLayers.hillshade) {
                overlayLayers.hillshade.setOpacity(this.value / 100);
            }
        });
    }
}

// =====================================================
// LANGUAGE
// =====================================================

function initLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'no' : 'en';
            updateLanguage();
        });
    }
}

function updateLanguage() {
    // Update toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const active = langToggle.querySelector('.lang-active');
        const inactive = langToggle.querySelector('.lang-inactive');
        if (currentLang === 'en') {
            active.textContent = 'EN';
            inactive.textContent = 'NO';
        } else {
            active.textContent = 'NO';
            inactive.textContent = 'EN';
        }
    }
    
    // Show/hide language elements
    document.querySelectorAll('[data-lang="en"]').forEach(el => {
        el.style.display = currentLang === 'en' ? '' : 'none';
    });
    document.querySelectorAll('[data-lang="no"]').forEach(el => {
        el.style.display = currentLang === 'no' ? '' : 'none';
    });
}

// =====================================================
// SIDEBAR
// =====================================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const expandAbout = document.getElementById('expand-about');
    const aboutExpanded = document.getElementById('about-expanded');
    const backBtn = document.getElementById('back-btn');
    
    // Sidebar collapse/expand toggle
    if (toggle) {
        toggle.addEventListener('click', function() {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                toggle.textContent = '◀';
            } else if (sidebar.classList.contains('expanded')) {
                sidebar.classList.remove('expanded');
                toggle.textContent = '◀';
            } else {
                sidebar.classList.add('expanded');
                toggle.textContent = '▶';
            }
        });
    }
    
    // Expand about section
    if (expandAbout && aboutExpanded) {
        expandAbout.addEventListener('click', function() {
            const isHidden = aboutExpanded.style.display === 'none';
            aboutExpanded.style.display = isHidden ? 'block' : 'none';
            expandAbout.classList.toggle('expanded', isHidden);
            
            // Update button text
            const enSpan = expandAbout.querySelector('[data-lang="en"]');
            const noSpan = expandAbout.querySelector('[data-lang="no"]');
            if (enSpan) enSpan.textContent = isHidden ? 'Show less ↑' : 'Read more ↓';
            if (noSpan) noSpan.textContent = isHidden ? 'Vis mindre ↑' : 'Les mer ↓';
        });
    }
    
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            hidePlaceDetails();
        });
    }
}

function showPlaceDetails(place) {
    const detailsDiv = document.getElementById('place-details');
    const contentDiv = document.getElementById('place-content');
    const docsSection = document.getElementById('docs-section');
    
    if (!detailsDiv || !contentDiv) return;
    
    const status = (place.Status || 'active').toLowerCase();
    const statusLabels = {
        'active': { en: 'Active', no: 'Aktiv' },
        'inactive': { en: 'Inactive', no: 'Inaktiv' },
        'illegal': { en: 'Illegal', no: 'Ulovlig' }
    };
    const statusLabel = statusLabels[status] ? statusLabels[status][currentLang] : status;
    
    const description = currentLang === 'no' && place.Description_NO 
        ? place.Description_NO 
        : place.Description || '';
    
    // Build images
    let galleryHtml = '';
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
        galleryHtml = `
            <div class="place-gallery">
                <img src="${images[0].src}" alt="${images[0].caption}" 
                     onclick="openLightbox('${images[0].src}', '${images[0].caption.replace(/'/g, "\\'")}')">
                ${images.length > 1 ? `
                    <div class="gallery-thumbs">
                        ${images.map((img, idx) => `
                            <img src="${img.src}" alt="${img.caption}" 
                                 class="${idx === 0 ? 'active' : ''}"
                                 onclick="openLightbox('${img.src}', '${img.caption.replace(/'/g, "\\'")}')">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Build details grid
    let detailsHtml = '<div class="place-details-grid">';
    if (place.Volume) {
        detailsHtml += `
            <div class="detail-item">
                <div class="detail-label">${currentLang === 'en' ? 'Volume' : 'Volum'}</div>
                <div class="detail-value">${parseInt(place.Volume).toLocaleString()} m³</div>
            </div>
        `;
    }
    if (place.Company) {
        detailsHtml += `
            <div class="detail-item">
                <div class="detail-label">${currentLang === 'en' ? 'Operator' : 'Operatør'}</div>
                <div class="detail-value">${place.Company}</div>
            </div>
        `;
    }
    if (place.StartYear) {
        detailsHtml += `
            <div class="detail-item">
                <div class="detail-label">${currentLang === 'en' ? 'Started' : 'Startet'}</div>
                <div class="detail-value">${place.StartYear}</div>
            </div>
        `;
    }
    if (place.Municipality) {
        detailsHtml += `
            <div class="detail-item">
                <div class="detail-label">${currentLang === 'en' ? 'Municipality' : 'Kommune'}</div>
                <div class="detail-value">${place.Municipality}</div>
            </div>
        `;
    }
    detailsHtml += '</div>';
    
    // Build documents
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
            <h3>${currentLang === 'en' ? 'Documents' : 'Dokumenter'}</h3>
            <ul class="docs-list">
                ${docs.map(doc => `
                    <li><a href="${doc.url}" target="_blank"><span class="doc-icon"></span>${doc.title}</a></li>
                `).join('')}
            </ul>
        `;
    }
    
    // Directions link
    let directionsHtml = '';
    if (place.GoogleMapsLink) {
        directionsHtml = `
            <p style="margin-top: 16px;">
                <a href="${place.GoogleMapsLink}" target="_blank" style="color: var(--text-secondary);">
                    → ${currentLang === 'en' ? 'Get directions' : 'Få veibeskrivelse'}
                </a>
            </p>
        `;
    }
    
    contentDiv.innerHTML = `
        <div class="place-header">
            <h2>${place.Name}</h2>
            <span class="place-status ${status}">${statusLabel}</span>
        </div>
        ${galleryHtml}
        <p>${description}</p>
        ${detailsHtml}
        ${docsHtml}
        ${directionsHtml}
    `;
    
    detailsDiv.style.display = 'block';
    if (docsSection) docsSection.style.display = 'none';
}

function hidePlaceDetails() {
    const detailsDiv = document.getElementById('place-details');
    const docsSection = document.getElementById('docs-section');
    
    if (detailsDiv) detailsDiv.style.display = 'none';
    if (docsSection) docsSection.style.display = 'block';
}

// =====================================================
// DATA & MARKERS
// =====================================================

function loadData() {
    Papa.parse(dataLocation, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            placesData = results.data;
            addMarkers();
        },
        error: function(err) {
            console.error('Error loading data:', err);
        }
    });
}

function addMarkers() {
    placesData.forEach((place, index) => {
        if (!place.Latitude || !place.Longitude) return;
        
        const lat = parseFloat(place.Latitude);
        const lng = parseFloat(place.Longitude);
        const status = (place.Status || 'active').toLowerCase();
        
        const icon = L.divIcon({
            className: 'marker-wrapper',
            html: `<div class="custom-marker ${status}"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const marker = L.marker([lat, lng], { icon: icon });
        
        marker.bindTooltip(place.Name, {
            direction: 'right',
            offset: [10, 0]
        });
        
        marker.on('click', function() {
            showPlaceDetails(place);
            map.flyTo([lat, lng], 14, { duration: 0.5 });
        });
        
        marker.addTo(map);
        markers.push(marker);
    });
}

// =====================================================
// LIGHTBOX
// =====================================================

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    
    if (!lightbox || !img) return;
    
    img.src = src;
    if (captionEl) captionEl.textContent = caption || '';
    lightbox.classList.add('active');
    
    // Close on click
    lightbox.onclick = function(e) {
        if (e.target === lightbox || e.target.id === 'lightbox-close') {
            lightbox.classList.remove('active');
        }
    };
    
    // Close on ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Make available globally
window.openLightbox = openLightbox;
