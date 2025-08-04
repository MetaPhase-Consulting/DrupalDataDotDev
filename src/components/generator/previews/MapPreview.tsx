import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface MapPreviewProps {
  selectedLibrary: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  selectedLibrary,
  selectedTheme,
  data,
  options
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Get theme colors from actual theme data
  const getThemeColors = () => {
    const theme = chartStylesData.find(t => t.id === selectedTheme);
    
    if (!theme) {
      // Fallback to first theme if selected theme not found
      const fallbackTheme = chartStylesData[0];
      return {
        primary: fallbackTheme.colors.primary,
        secondary: fallbackTheme.colors.secondary,
        accent: fallbackTheme.colors.text,
        background: fallbackTheme.colors.background,
        colors: fallbackTheme.palette
      };
    }
    
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.text,
      background: theme.colors.background,
      colors: theme.palette
    };
  };

  // Render map
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();

    if (selectedLibrary === 'openlayers') {
      // Load OpenLayers dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js';
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/ol.css';
      
      script.onload = () => {
        if (typeof (window as any).ol !== 'undefined') {
          const ol = (window as any).ol;
          
          const map = new ol.Map({
            target: containerRef.current,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([0, 0]),
              zoom: 2
            })
          });
          
          // Add markers or other map features based on data
          console.log('OpenLayers map data:', data);
        }
      };
      
      document.head.appendChild(link);
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    } else if (selectedLibrary === 'leaflet') {
      // Load Leaflet dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      
      script.onload = () => {
        if (typeof (window as any).L !== 'undefined') {
          const L = (window as any).L;
          
          const map = L.map(containerRef.current).setView([0, 0], 2);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Add markers or other map features based on data
          console.log('Leaflet map data:', data);
        }
      };
      
      document.head.appendChild(link);
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }
  }, [selectedLibrary, selectedTheme, data, options]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
        <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
          <div className="text-lg font-semibold mb-2">No Data Available</div>
          <div className="text-sm">
            Add data in Step 5 to see your map preview
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="w-full h-full" style={{ height: '400px' }}></div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          {selectedLibrary === 'openlayers' ? 'OpenLayers' : 'Leaflet'} Map Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Data points: {data.length}
        </div>
      </div>
    </div>
  );
};

export default MapPreview; 