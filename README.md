# DIRTY_BUSINESS

An interactive investigative map documenting mass movement operations in the Oslo region.

## 🌐 Live Site

**https://dirtybusiness.no**

## Features

- **Dark basemap** as default (Kartverket grayscale)
- **Satellite imagery** option
- **WMS overlay layers**: Terrain hillshade, Contaminated ground (Miljødirektoratet)
- **Popup modals** when clicking markers
- **Full-screen intro page** with project description
- **Gallery view** in sidebar with thumbnails
- **Bilingual** English/Norwegian
- **Google Drive integration** for images and documents

---

## 📁 File Structure

```
DirtyBusiness/
├── index.html          # Main page
├── style.css           # Dark terminal theme
├── script.js           # Map logic & interactions
├── settings.js         # Configuration
└── data/
    └── places.csv      # Location data
```

---

## 🖼️ Using Google Drive for Images & PDFs

Instead of hosting files locally, you can link directly to files in Google Drive.

### Step 1: Upload to Google Drive

Upload your images and PDFs to a folder in Google Drive.

### Step 2: Share the Files

For each file:
1. Right-click the file
2. Click **Share**
3. Change to **Anyone with the link can view**
4. Click **Copy link**

### Step 3: Convert the Link

The share link looks like:
```
https://drive.google.com/file/d/1ABC123xyz789/view?usp=sharing
```

**For images**, convert to:
```
https://drive.google.com/uc?export=view&id=1ABC123xyz789
```

**For PDFs**, convert to:
```
https://drive.google.com/file/d/1ABC123xyz789/preview
```

### Step 4: Add to CSV

Put these URLs in your `places.csv` file:

| Column | Example Value |
|--------|--------------|
| Image1 | `https://drive.google.com/uc?export=view&id=1ABC123xyz789` |
| Document1 | `https://drive.google.com/file/d/1XYZ789abc123/preview` |

---

## 📊 CSV Data Format

| Column | Description | Example |
|--------|-------------|---------|
| Name | Location name | Massedeponi Nord |
| Latitude | Decimal degrees | 59.9669 |
| Longitude | Decimal degrees | 11.0456 |
| Status | `active`, `inactive`, or `illegal` | active |
| Description | English text (HTML ok) | Large fill operation... |
| Description_NO | Norwegian text | Stort deponi... |
| Company | Operator name | Masseflyt AS |
| Municipality | Kommune | Lillestrøm |
| Volume | Cubic meters | 450000 |
| StartYear | Year started | 2018 |
| Image1 | URL to image | (Google Drive URL) |
| Image1_Caption | Caption text | Aerial view 2023 |
| Image2-5 | Additional images | ... |
| Document1 | URL to PDF | (Google Drive URL) |
| Document1_Title | Document name | Environmental Permit |
| Document2-5 | Additional docs | ... |
| GoogleMapsLink | Link for directions | https://maps.google.com/?q=59.9669,11.0456 |

---

## 🗺️ WMS Layers Included

### Contaminated Ground (Forurenset grunn)
From Miljødirektoratet - shows registered contaminated sites and landfills.

**WMS URL:** 
```
https://kart.miljodirektoratet.no/arcgis/services/grunnforurensning2/MapServer/WMSServer
```

### Terrain Hillshade
From Kartverket - DTM-based terrain relief.

**WMS URL:**
```
https://wms.geonorge.no/skwms1/wms.hoyde-dtm-nhm-25833
```

---

## ⚙️ Customization

### Change map center
In `settings.js`:
```javascript
const mapCenter = [59.95, 11.05];  // [lat, lng]
const mapZoom = 10;
```

### Use Google Sheets instead of CSV
1. Create a Google Sheet with the same columns
2. File → Share → Publish to web → CSV
3. Copy the URL
4. In `settings.js`:
```javascript
const dataLocation = 'https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv';
```

### Add more WMS layers
In `settings.js`, add to the `overlays` object and update `script.js` to add toggle controls.

---

## 🚀 Deployment

Files are hosted on GitHub Pages with custom domain:
- Repository: https://github.com/boundarieslab/DirtyBusiness
- Custom domain: dirtybusiness.no

To update:
1. Edit files locally or in GitHub
2. Commit and push changes
3. Changes go live automatically

---

## Credits

- **Map tiles**: [Kartverket](https://kartverket.no/)
- **Environmental data**: [Miljødirektoratet](https://miljodirektoratet.no/)
- **Framework**: [Leaflet.js](https://leafletjs.com/)

---

*A project by [Laboratory for Urban Boundaries](https://boundarieslab.github.io)*
