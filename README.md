# Dirty Business

Interactive map documenting mass waste management facilities across Norway.

## Features

- Satellite imagery (Esri World Imagery)
- Bilingual (Norwegian / English)
- Contaminants display - only shows present pollutants
- Scale bar and north arrow
- Responsive design

## Files

- `index.html` - Main page
- `style.css` - Styles
- `script.js` - Map logic
- `fonts/` - Custom fonts folder (create this)

## To Use the Complex Font

1. Download Complex font from [dafont.com/complex.font](https://www.dafont.com/complex.font)
2. Create a `fonts` folder in your repository
3. Upload `Complex.ttf` to the `fonts` folder
4. In `style.css`, uncomment the `@font-face` section at the top:

```css
@font-face {
    font-family: 'Complex';
    src: url('fonts/Complex.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

5. Change `font-family` on `body` and `.logo` to `'Complex', sans-serif`

## GitHub Pages Setup

1. Upload all files to your GitHub repository
2. Go to Settings → Pages
3. Select "main" branch as source
4. Site will be live at `https://[username].github.io/[repo-name]/`

## Data Source

Google Sheets CSV with columns:
- Name, Latitude, Longitude, Type, Status
- Municipality, County, Company, Operator
- Description, Description_NO
- Contaminants, TotalCapacity
- Website, GoogleMapsLink, PermitDocuments
- Images

## Credits

Laboratory for Urban Boundaries
