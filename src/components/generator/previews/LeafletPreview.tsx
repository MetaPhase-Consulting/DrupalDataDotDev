import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface LeafletPreviewProps {
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const LeafletPreview: React.FC<LeafletPreviewProps> = ({
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
      colors: theme.colors
    };
  };

  // Transform data for map
  const transformData = () => {
    if (!data || data.length === 0) return null;

    // Handle different data structures
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Try to identify coordinate fields
    const latField = keys.find(k => 
      k.toLowerCase().includes('lat') || 
      k.toLowerCase().includes('latitude') ||
      k === 'lat'
    );
    
    const lngField = keys.find(k => 
      k.toLowerCase().includes('lng') || 
      k.toLowerCase().includes('lon') ||
      k.toLowerCase().includes('longitude') ||
      k === 'lng'
    );

    // If we have lat/lng fields, use them
    if (latField && lngField) {
      return data.map(item => ({
        lat: Number(item[latField]) || 0,
        lng: Number(item[lngField]) || 0,
        name: item.name || item.label || 'Point',
        value: item.value || item.data || 1
      }));
    }

    // Fallback: use first two numeric fields as coordinates
    const numericFields = keys.filter(k => 
      typeof firstItem[k] === 'number' || !isNaN(Number(firstItem[k]))
    );

    if (numericFields.length >= 2) {
      return data.map(item => ({
        lat: Number(item[numericFields[0]]) || 0,
        lng: Number(item[numericFields[1]]) || 0,
        name: item.name || item.label || 'Point',
        value: item.value || item.data || 1
      }));
    }

    // Default: create sample points around the world
    return data.map((item, index) => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      name: item.name || item.label || `Point ${index + 1}`,
      value: item.value || item.data || 1
    }));
  };

  // Render Leaflet map
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();
    const transformedData = transformData();

    // Load Leaflet dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    
    script.onload = () => {
      if (typeof (window as any).L !== 'undefined') {
        const L = (window as any).L;
        
        // Create map
        const map = L.map(containerRef.current).setView([0, 0], 2);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add markers for each data point
        if (transformedData && transformedData.length > 0) {
          const markers: any[] = [];
          
          transformedData.forEach(point => {
            const marker = L.circleMarker([point.lat, point.lng], {
              radius: Math.min(Math.max(point.value * 2, 5), 20),
              fillColor: theme.colors[0],
              color: theme.colors[0],
              weight: 2,
              opacity: 1,
              fillOpacity: 0.7
            }).addTo(map);

            // Add popup with point information
            marker.bindPopup(`
              <div>
                <strong>${point.name}</strong><br/>
                Value: ${point.value}<br/>
                Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)}
              </div>
            `);

            markers.push(marker);
          });

          // Fit map to show all markers
          if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds(), {
              padding: [20, 20, 20, 20]
            });
          }
        }
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
  }, [selectedTheme, data, options]);

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
          Leaflet Map Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Data points: {data.length}
        </div>
      </div>
    </div>
  );
};

export default LeafletPreview; 