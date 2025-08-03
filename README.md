# DrupalDataDotDev

Free, fast, Drupal data visualization generator. Create beautiful charts and maps from JSON, CSV, or manual input with Chart.js, Highcharts, ECharts, and more.

## Project Structure

```
├── public/           # Static assets (favicon, manifest, robots.txt)
├── src/              # Source code
│   ├── components/   # React components
│   ├── data/         # JSON configuration files
│   ├── pages/        # Page components
│   ├── services/     # Business logic services
│   └── types/        # TypeScript type definitions
└── index.html        # Main HTML file
```

## Development

```bash
npm install
npm run dev
```

## Static Assets

Static assets like favicon, manifest, and robots.txt are stored in the `public/` folder and served from the root URL.
