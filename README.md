# Dirty Business / Skitne Penger

An interactive investigative map documenting mass movement operations (soil, rock, construction materials) in the Oslo region.

![Preview](preview.png)

## 🌐 Live Site

**https://boundarieslab.github.io/DirtyBusiness/**

## Features

- **Satellite + Hillshade blend** - Terrain multiply overlay for dramatic effect
- **Black & White mode** - Desaturated satellite view
- **Bilingual** - English/Norwegian toggle
- **Interactive sidebar** - Click markers to see company info, photos, documents
- **Image gallery** - Lightbox for full-screen photo viewing
- **Document links** - PDFs, reports linked per location
- **Easy data management** - CSV file or Google Sheets

## File Structure

```
DirtyBusiness/
├── index.html          # Main page
├── style.css           # Dark theme styling
├── script.js           # Map logic & interactivity
├── settings.js         # Configuration (center, zoom, sources)
├── data/
│   └── places.csv      # Location data
├── media/              # Images for each location
│   └── (your photos)
└── docs/               # PDFs and documents
    └── (your files)
```

## Data Format (places.csv)

| Column | Description |
|--------|-------------|
| Name | Location name |
| Latitude | Decimal degrees |
| Longitude | Decimal degrees |
| Status | `active`, `inactive`, or `illegal` |
| Description | English description (HTML allowed) |
| Description_NO | Norwegian description |
| Company | Operator name |
| Municipality | Kommune |
| Volume | Cubic meters (number) |
| StartYear | Year operation began |
| Image1-5 | Path to images (e.g., `media/photo.jpg`) |
| Image1-5_Caption | Caption for each image |
| Document1-5 | Path to PDFs (e.g., `docs/permit.pdf`) |
| Document1-5_Title | Display name for document |
| GoogleMapsLink | Link for directions |

## Using Google Sheets Instead of CSV

1. Create a Google Sheet matching the column format above
2. **Share** → Anyone with link can view
3. **File** → Publish to web → CSV
4. Copy the published URL
5. In `settings.js`, change:

```javascript
const dataLocation = 'https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?gid=0&single=true&output=csv';
```

## Adding New Locations

### Option A: Edit CSV directly
1. Edit `data/places.csv` in GitHub or locally
2. Add a new row with coordinates and details
3. Upload any images to `media/` folder
4. Upload any documents to `docs/` folder
5. Commit changes

### Option B: Use Google Sheets
1. Add a new row to your linked Google Sheet
2. Changes appear automatically (after page refresh)

## Custom Domain Setup

1. Buy a domain (e.g., from domeneshop.no)
2. In GitHub: Settings → Pages → Custom domain → enter your domain
3. At your registrar, add DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | boundarieslab.github.io |

4. Wait 10-30 minutes for DNS propagation
5. Check "Enforce HTTPS" in GitHub Pages settings

## Map Layers

**Base maps (Kartverket):**
- Satellite (Norge i Bilder orthophoto)
- Satellite B&W (grayscale filter)
- Topographic map

**Overlays:**
- DTM Hillshade with multiply blend mode

## Customization

### Change map center
In `settings.js`:
```javascript
const mapCenter = [59.95, 11.05];  // lat, lng
const mapZoom = 10;
```

### Adjust hillshade opacity
In `settings.js`:
```javascript
opacity: 0.4,  // 0 to 1
```

### Add more WMS layers
In `settings.js`, add to the basemaps or overlay objects and update `script.js`.

## Credits

- **Map tiles**: [Kartverket](https://kartverket.no/), [Norge i Bilder](https://norgeibilder.no/)
- **Framework**: [Leaflet.js](https://leafletjs.com/)
- **Template inspired by**: [HandsOnDataViz](https://github.com/HandsOnDataViz/leaflet-point-map-sidebar)

## License

MIT License - Free to use and modify

---

*A project by [Laboratory for Urban Boundaries](https://boundarieslab.github.io)*
