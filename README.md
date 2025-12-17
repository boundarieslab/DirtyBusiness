[README.md](https://github.com/user-attachments/files/24212387/README.md)

An interactive web map for visualizing terrain changes around Oslo, with Kartverket WMS layers and GeoTIFF upload support.

## Features

- **Satellite imagery** (Orthophoto) from Kartverket
- **DTM Hillshade** terrain visualization
- **Topographic map** layer
- **GeoTIFF upload** — drag and drop your own raster files
- Layer opacity control

## How to Host on GitHub Pages (Free)

### Step 1: Create a GitHub Account
If you don't have one, go to [github.com](https://github.com) and sign up.

### Step 2: Create a New Repository
1. Click the **+** icon in the top right → **New repository**
2. Name it something like `oslo-dirt-map`
3. Make sure it's set to **Public**
4. Check **"Add a README file"**
5. Click **Create repository**

### Step 3: Upload the Files
1. In your new repository, click **Add file** → **Upload files**
2. Drag the `index.html` file into the upload area
3. Click **Commit changes**

### Step 4: Enable GitHub Pages
1. Go to your repository's **Settings** (tab at the top)
2. Scroll down to **Pages** in the left sidebar
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

### Step 5: Access Your Map
After a minute or two, your map will be live at:
```
https://YOUR-USERNAME.github.io/oslo-dirt-map/
```

## Usage Tips

### GeoTIFF Limitations
- Works best with files under ~50MB
- The TIFF must be georeferenced (have coordinate information)
- Supported CRS: WGS84 (EPSG:4326) works best, but most common CRS should reproject automatically
- For large files, consider using Cloud Optimized GeoTIFFs (COG)

### Coordinate Systems
The map uses WGS84 (EPSG:4326). Your GeoTIFFs in UTM 32N (EPSG:25832) or other Norwegian systems should work, but WGS84 will load fastest.

## Customization Ideas

### Change the starting location
Find this line in `index.html`:
```javascript
const map = L.map('map').setView([59.91, 10.75], 11);
```
Change the coordinates and zoom level as needed.

### Add more WMS layers
Kartverket offers many other layers. Browse them at:
https://kartkatalog.geonorge.no/

### Style your uploaded TIFFs
You can modify the color rendering in the `GeoRasterLayer` options.

## Local Development

To test locally before uploading:
1. Open the `index.html` file directly in a browser, OR
2. Run a local server: `python -m http.server 8000` and visit `localhost:8000`

## Credits

- Base maps: [Kartverket](https://kartverket.no/)
- Map library: [Leaflet](https://leafletjs.com/)
- GeoTIFF parsing: [georaster-layer-for-leaflet](https://github.com/GeoTIFF/georaster-layer-for-leaflet)
