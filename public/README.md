# Public Folder

This folder contains static assets that are served directly by the web server.

## Favicon Files

### Core Favicons
- `favicon.ico` - Traditional favicon for older browsers
- `favicon.svg` - Modern SVG favicon for newer browsers
- `favicon-16x16.png` - Small PNG favicon
- `favicon-32x32.png` - Standard PNG favicon

### Platform-Specific Icons
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `android-chrome-192x192.png` - Android Chrome icon (192x192)
- `android-chrome-512x512.png` - Android Chrome icon (512x512)

### Configuration Files
- `manifest.json` - Web app manifest for PWA support
- `site.webmanifest` - Alternative web app manifest
- `browserconfig.xml` - Windows tile configuration
- `robots.txt` - Search engine crawling instructions

### Branding Assets
- `drupaldatadotdev-logo.png` - Main logo file

## Adding Static Assets

To add new static assets:

1. Place files in this folder
2. Reference them in your code using absolute paths (e.g., `/favicon.ico`)
3. Vite will automatically serve them from the root URL

## Browser Support

- **Modern browsers**: Use SVG favicon (scalable, crisp)
- **Older browsers**: Fall back to ICO favicon
- **iOS devices**: Use apple-touch-icon.png
- **Android devices**: Use android-chrome icons
- **Windows tiles**: Use browserconfig.xml
- **PWA features**: Enabled via manifest files

## Icon Hierarchy

Browsers will use icons in this order:
1. SVG favicon (modern browsers)
2. PNG favicons (16x16, 32x32)
3. ICO favicon (fallback)
4. Platform-specific icons (iOS, Android) 