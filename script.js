// =====================================================
// DIRTY BUSINESS - Main Script
// =====================================================

let map;
let currentLang = 'en';
let placesData = [];
let filteredData = [];
let markers = [];
let basemapLayers = {};
let overlayLayers = {};
let currentBasemap = 'dark';
let currentFilter = 'all';

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initControls();
    initLanguage();
    initSidebar();
    initPanels();
    initModals();
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
    
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);
    
    for (const [key, config] of Object.entries(basemaps)) {
        basemapLayers[key] = L.tileLayer(config.url, config.options);
    }
    
    initOverlays();
    setBasemap('dark');
}

function initOverlays() {
    if (overlays.hillshade) {
        overlayLayers.hillshade = L.tileLayer.wms(overlays.hillshade.url, overlays.hillshade.options);
    }
    if (overlays.contaminated) {
        overlayLayers.contaminated = L.tileLayer.wms(overlays.contaminated.url, overlays.contaminated.options);
    }
    if (overlays.quickclay) {
        overlayLayers.quickclay = L.tileLayer.wms(overlays.quickclay.url, overlays.quickclay.options);
    }
}

function setBasemap(key) {
    if (basemapLayers[currentBasemap]) {
        map.removeLayer(basemapLayers[currentBasemap]);
    }
    if (basemapLayers[key]) {
        basemapLayers[key].addTo(map);
        basemapLayers[key].bringToBack();
        currentBasemap = key;
    }
}

// =====================================================
// CONTROLS
// =====================================================

function initControls() {
    document.querySelectorAll('input[name="basemap"]').forEach(radio => {
        radio.addEventListener('change', function() { setBasemap(this.value); });
    });
    
    document.getElementById('layer-hillshade')?.addEventListener('change', function() {
        toggleOverlay('hillshade', this.checked);
    });
    document.getElementById('layer-contaminated')?.addEventListener('change', function() {
        toggleOverlay('contaminated', this.checked);
    });
    document.getElementById('layer-quickclay')?.addEventListener('change', function() {
        toggleOverlay('quickclay', this.checked);
    });
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFilters();
        });
    });
    
    document.getElementById('filter-municipality')?.addEventListener('change', applyFilters);
    document.getElementById('filter-year')?.addEventListener('input', function() {
        document.getElementById('year-value').textContent = this.value + '+';
        applyFilters();
    });
    document.getElementById('timeline-slider')?.addEventListener('input', applyFilters);
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
    
    document.getElementById('btn-measure')?.addEventListener('click', toggleMeasure);
    document.getElementById('btn-download')?.addEventListener('click', downloadCSV);
    document.getElementById('btn-report')?.addEventListener('click', () => openModal('report-modal'));
    document.getElementById('btn-share')?.addEventListener('click', shareLocation);
}

function toggleOverlay(key, show) {
    if (overlayLayers[key]) {
        show ? overlayLayers[key].addTo(map) : map.removeLayer(overlayLayers[key]);
    }
}

// =====================================================
// LANGUAGE
// =====================================================

function initLanguage() {
    document.getElementById('lang-toggle')?.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'no' : 'en';
        updateLanguage();
    });
}

function updateLanguage() {
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
        toggle.querySelector('.lang-active').textContent = currentLang.toUpperCase();
        toggle.querySelector('.lang-inactive').textContent = currentLang === 'en' ? 'NO' : 'EN';
    }
    document.querySelectorAll('[data-lang="en"]').forEach(el => el.style.display = currentLang === 'en' ? '' : 'none');
    document.querySelectorAll('[data-lang="no"]').forEach(el => el.style.display = currentLang === 'no' ? '' : 'none');
    updatePlacesList();
}

// =====================================================
// SIDEBAR
// =====================================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    
    toggle?.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        this.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
    });
    
    document.getElementById('expand-about')?.addEventListener('click', function() {
        const expanded = document.getElementById('about-expanded');
        const isHidden = expanded.style.display === 'none';
        expanded.style.display = isHidden ? 'block' : 'none';
    });
    
    document.getElementById('back-btn')?.addEventListener('click', hidePlaceDetails);
}

// =====================================================
// PANELS
// =====================================================

function initPanels() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const panelId = this.dataset.panel;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + panelId)?.classList.add('active');
        });
    });
}

// =====================================================
// MODALS
// =====================================================

function initModals() {
    document.getElementById('report-close')?.addEventListener('click', () => closeModal('report-modal'));
    document.getElementById('share-close')?.addEventListener('click', () => closeModal('share-modal'));
    document.getElementById('copy-url')?.addEventListener('click', function() {
        const urlInput = document.getElementById('share-url');
        urlInput.select();
        document.execCommand('copy');
        this.textContent = 'Copied!';
    });
    document.getElementById('report-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Report submitted!');
        closeModal('report-modal');
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    });
}

function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

// =====================================================
// DATA LOADING
// =====================================================

function loadData() {
    Papa.parse(dataURL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            placesData = results.data.filter(p => p.Latitude && p.Longitude);
            filteredData = [...placesData];
            updateStatistics();
            populateMunicipalityFilter();
            addMarkers();
            updatePlacesList();
            buildGallery();
            buildCompanyList();
        },
        error: function(err) { console.error('Error loading data:', err); }
    });
}

// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {
    const total = filteredData.length;
    const active = filteredData.filter(p => (p.Status || '').toLowerCase() === 'active').length;
    const illegal = filteredData.filter(p => (p.Status || '').toLowerCase() === 'illegal').length;
    const volume = filteredData.reduce((sum, p) => sum + (parseInt(p.Volume) || 0), 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-illegal').textContent = illegal;
    document.getElementById('stat-volume').textContent = formatNumber(volume);
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// =====================================================
// FILTERS
// =====================================================

function populateMunicipalityFilter() {
    const select = document.getElementById('filter-municipality');
    if (!select) return;
    
    const municipalities = [...new Set(placesData.map(p => p.Municipality).filter(Boolean))].sort();
    select.innerHTML = '<option value="all">All Municipalities</option>';
    municipalities.forEach(m => {
        select.innerHTML += `<option value="${m}">${m}</option>`;
    });
}

function applyFilters() {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    const municipality = document.getElementById('filter-municipality')?.value || 'all';
    const minYear = parseInt(document.getElementById('filter-year')?.value || 2000);
    const timelineYear = parseInt(document.getElementById('timeline-slider')?.value || 2025);
    
    filteredData = placesData.filter(p => {
        const status = (p.Status || '').toLowerCase();
        const year = parseInt(p.StartYear) || 2000;
        
        if (currentFilter !== 'all' && status !== currentFilter) return false;
        if (municipality !== 'all' && p.Municipality !== municipality) return false;
        if (year < minYear) return false;
        if (year > timelineYear) return false;
        
        if (search) {
            const searchFields = [p.Name, p.Company, p.Municipality, p.Description].join(' ').toLowerCase();
            if (!searchFields.includes(search)) return false;
        }
        return true;
    });
    
    updateStatistics();
    updateMarkers();
    updatePlacesList();
}

// =====================================================
// MARKERS
// =====================================================

function addMarkers() {
    clearMarkers();
    filteredData.forEach(place => {
        const lat = parseFloat(place.Latitude);
        const lng = parseFloat(place.Longitude);
        const status = (place.Status || 'active').toLowerCase();
        
        const icon = L.divIcon({
            className: 'marker-wrapper',
            html: `<div class="custom-marker ${status}"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        
        const marker = L.marker([lat, lng], { icon: icon });
        marker.bindTooltip(place.Name, { direction: 'right', offset: [8, 0] });
        marker.on('click', () => {
            showPlaceDetails(place);
            map.flyTo([lat, lng], 14, { duration: 0.5 });
        });
        marker.placeData = place;
        marker.addTo(map);
        markers.push(marker);
    });
}

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function updateMarkers() {
    clearMarkers();
    addMarkers();
}

// =====================================================
// PLACES LIST
// =====================================================

function updatePlacesList() {
    const list = document.getElementById('places-list');
    if (!list) return;
    
    list.innerHTML = '';
    filteredData.forEach(place => {
        const status = (place.Status || 'active').toLowerCase();
        const item = document.createElement('div');
        item.className = 'place-item';
        item.innerHTML = `
            <span class="place-item-icon ${status}"></span>
            <span class="place-item-name">${place.Name}</span>
            <span class="place-item-municipality">${place.Municipality || ''}</span>
        `;
        item.addEventListener('click', () => {
            showPlaceDetails(place);
            map.flyTo([parseFloat(place.Latitude), parseFloat(place.Longitude)], 14);
        });
        list.appendChild(item);
    });
}

// =====================================================
// PLACE DETAILS
// =====================================================

function showPlaceDetails(place) {
    const detailsDiv = document.getElementById('place-details');
    const contentDiv = document.getElementById('place-content');
    const listSection = document.getElementById('places-list-section');
    
    if (!detailsDiv || !contentDiv) return;
    
    const status = (place.Status || 'active').toLowerCase();
    const statusLabels = { active: { en: 'Active', no: 'Aktiv' }, inactive: { en: 'Inactive', no: 'Inaktiv' }, illegal: { en: 'Illegal', no: 'Ulovlig' } };
    const statusLabel = statusLabels[status] ? statusLabels[status][currentLang] : status;
    const description = currentLang === 'no' && place.Description_NO ? place.Description_NO : place.Description || '';
    
    let galleryHtml = '';
    if (place.Image1) {
        galleryHtml = `<div class="place-gallery"><img src="${place.Image1}" alt="${place.Image1_Caption || ''}" onclick="openLightbox('${place.Image1}', '${(place.Image1_Caption || '').replace(/'/g, "\\'")}')"></div>`;
    }
    
    let detailsHtml = '<div class="place-details-grid">';
    if (place.Volume) detailsHtml += `<div class="detail-item"><div class="detail-label">${currentLang === 'en' ? 'Volume' : 'Volum'}</div><div class="detail-value">${parseInt(place.Volume).toLocaleString()} m³</div></div>`;
    if (place.Company) detailsHtml += `<div class="detail-item"><div class="detail-label">${currentLang === 'en' ? 'Operator' : 'Operatør'}</div><div class="detail-value">${place.Company}</div></div>`;
    if (place.StartYear) detailsHtml += `<div class="detail-item"><div class="detail-label">${currentLang === 'en' ? 'Started' : 'Startet'}</div><div class="detail-value">${place.StartYear}</div></div>`;
    if (place.Municipality) detailsHtml += `<div class="detail-item"><div class="detail-label">${currentLang === 'en' ? 'Municipality' : 'Kommune'}</div><div class="detail-value">${place.Municipality}</div></div>`;
    detailsHtml += '</div>';
    
    let docsHtml = '';
    if (place.Document1) {
        docsHtml = `<h3>${currentLang === 'en' ? 'Documents' : 'Dokumenter'}</h3><ul class="docs-list"><li><a href="${place.Document1}" target="_blank">${place.Document1_Title || 'Document'}</a></li></ul>`;
    }
    
    contentDiv.innerHTML = `
        <div class="place-header">
            <h2>${place.Name}</h2>
            <span class="place-status ${status}">${statusLabel}</span>
        </div>
        ${galleryHtml}
        <p class="place-description">${description}</p>
        ${detailsHtml}
        ${docsHtml}
        ${place.GoogleMapsLink ? `<p><a href="${place.GoogleMapsLink}" target="_blank" style="color:var(--text-secondary);">→ ${currentLang === 'en' ? 'Get directions' : 'Veibeskrivelse'}</a></p>` : ''}
    `;
    
    detailsDiv.style.display = 'block';
    if (listSection) listSection.style.display = 'none';
}

function hidePlaceDetails() {
    document.getElementById('place-details').style.display = 'none';
    document.getElementById('places-list-section').style.display = 'block';
}

// =====================================================
// GALLERY
// =====================================================

function buildGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    placesData.forEach(place => {
        if (place.Image1) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${place.Image1}" alt="${place.Name}"><div class="gallery-item-label">${place.Name}</div>`;
            item.addEventListener('click', () => openLightbox(place.Image1, place.Name + (place.Image1_Caption ? ' - ' + place.Image1_Caption : '')));
            grid.appendChild(item);
        }
        if (place.Image2) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${place.Image2}" alt="${place.Name}"><div class="gallery-item-label">${place.Name}</div>`;
            item.addEventListener('click', () => openLightbox(place.Image2, place.Name + (place.Image2_Caption ? ' - ' + place.Image2_Caption : '')));
            grid.appendChild(item);
        }
    });
    
    if (grid.children.length === 0) {
        grid.innerHTML = '<p class="placeholder-text">No images available yet.</p>';
    }
}

// =====================================================
// COMPANY LIST
// =====================================================

function buildCompanyList() {
    const list = document.getElementById('company-list');
    if (!list) return;
    
    const companies = {};
    placesData.forEach(p => {
        if (p.Company) {
            if (!companies[p.Company]) companies[p.Company] = { count: 0, volume: 0 };
            companies[p.Company].count++;
            companies[p.Company].volume += parseInt(p.Volume) || 0;
        }
    });
    
    list.innerHTML = '';
    Object.entries(companies).sort((a, b) => b[1].volume - a[1].volume).forEach(([name, data]) => {
        const card = document.createElement('div');
        card.className = 'company-card';
        card.innerHTML = `<div class="company-name">${name}</div><div class="company-stats">${data.count} sites · ${formatNumber(data.volume)} m³</div>`;
        list.appendChild(card);
    });
    
    if (list.children.length === 0) {
        list.innerHTML = '<p class="placeholder-text">No company data available.</p>';
    }
}

// =====================================================
// LIGHTBOX
// =====================================================

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    
    if (!lightbox || !img) return;
    img.src = src;
    if (cap) cap.textContent = caption || '';
    lightbox.classList.add('active');
    
    lightbox.onclick = function(e) {
        if (e.target === lightbox || e.target.id === 'lightbox-close') lightbox.classList.remove('active');
    };
    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') { lightbox.classList.remove('active'); document.removeEventListener('keydown', handler); }
    });
}

window.openLightbox = openLightbox;

// =====================================================
// TOOLS
// =====================================================

function toggleMeasure() {
    const btn = document.getElementById('btn-measure');
    btn.classList.toggle('active');
    alert(currentLang === 'en' ? 'Measure tool: Click on map to measure distances' : 'Måleverktøy: Klikk på kartet for å måle avstander');
}

function downloadCSV() {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dirty_business_data.csv';
    a.click();
}

function shareLocation() {
    const url = window.location.href;
    document.getElementById('share-url').value = url;
    openModal('share-modal');
}
