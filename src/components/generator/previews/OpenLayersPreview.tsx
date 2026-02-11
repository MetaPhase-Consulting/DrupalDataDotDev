/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface OpenLayersPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any;
  options: Record<string, any>;
}

const OpenLayersPreview: React.FC<OpenLayersPreviewProps> = ({
  selectedType,
  selectedSubtype,
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
      colors: theme.palette || [theme.colors.primary, theme.colors.secondary, theme.colors.accent]
    };
  };

  // Transform data for map
  const transformData = () => {
    // Handle different data formats
    let processedData: any[] = [];
    
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        // Direct data array (like map sample data)
        processedData = data.data;
      } else if (data.data && data.data.datasets) {
        // Nested data structure (like sample data)
        processedData = data.data.datasets.flatMap((dataset: any) => dataset.data || []);
      } else if (data.datasets && !data.labels) {
        // Datasets-only format (like scatter charts)
        processedData = data.datasets.flatMap((dataset: any) => dataset.data || []);
      } else if (Array.isArray(data)) {
        processedData = data;
      } else {
        return null;
      }
    } else if (Array.isArray(data)) {
      processedData = data;
    } else {
      return null;
    }
    
    if (processedData.length === 0) return null;

    // Handle different data structures
    const firstItem = processedData[0];
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
      return processedData.map(item => ({
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
      return processedData.map(item => ({
        lat: Number(item[numericFields[0]]) || 0,
        lng: Number(item[numericFields[1]]) || 0,
        name: item.name || item.label || 'Point',
        value: item.value || item.data || 1
      }));
    }

    // Default: create sample points around the world
    return processedData.map((item, index) => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      name: item.name || item.label || `Point ${index + 1}`,
      value: item.value || item.data || 1
    }));
  };

  // Render OpenLayers map
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();
    const transformedData = transformData();

    let script: HTMLScriptElement | null = null;
    let link: HTMLLinkElement | null = null;

    // Check if OpenLayers is already loaded
    if (typeof (window as any).ol !== 'undefined') {
      const ol = (window as any).ol;
        
      // Create map
      const map = new ol.Map({
        target: containerRef.current,
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([0, 0]),
          zoom: 1
        })
      });

      // Add markers for each data point
      if (transformedData && transformedData.length > 0) {
        const features = transformedData.map(point => {
          const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([point.lng, point.lat]))
          });

          // Create a style for the marker
          const style = new ol.style.Style({
            image: new ol.style.Circle({
              radius: Math.min(Math.max(point.value * 2, 5), 20),
              fill: new ol.style.Fill({
                color: theme.colors[0] + '80'
              }),
              stroke: new ol.style.Stroke({
                color: theme.colors[0],
                width: 2
              })
            })
          });

          feature.setStyle(style);
          return feature;
        });

        // Create a vector layer for the markers
        const vectorLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: features
          })
        });

        map.addLayer(vectorLayer);

        // Fit the map to show all markers
        const extent = vectorLayer.getSource().getExtent();
        if (extent[0] !== Infinity && extent[1] !== Infinity && extent[2] !== Infinity && extent[3] !== Infinity) {
          map.getView().fit(extent, {
            padding: [20, 20, 20, 20],
            duration: 1000,
            maxZoom: 10
          });
        } else {
          // Fallback: set a reasonable view for the world
          map.getView().setCenter(ol.proj.fromLonLat([-98.5795, 39.8283])); // Center of US
          map.getView().setZoom(3);
        }
      }
    } else {
      // Load OpenLayers dynamically if not already loaded
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js';
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/ol@7.4.0/ol.css';
      
      script.onerror = () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '<p style="color:red;text-align:center;">Failed to load OpenLayers library</p>';
        }
      };

      script.onload = () => {
        // Re-run the map creation after OpenLayers loads
        if (containerRef.current && typeof (window as any).ol !== 'undefined') {
          // Clear container and recreate map
          containerRef.current.innerHTML = '';
          const ol = (window as any).ol;
          
          // Create map
          const map = new ol.Map({
            target: containerRef.current,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([0, 0]),
              zoom: 1
            })
          });

          // Add markers for each data point
          if (transformedData && transformedData.length > 0) {
            const features = transformedData.map(point => {
              const feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([point.lng, point.lat]))
              });

              // Create a style for the marker
              const style = new ol.style.Style({
                image: new ol.style.Circle({
                  radius: Math.min(Math.max(point.value * 2, 5), 20),
                  fill: new ol.style.Fill({
                    color: theme.colors[0] + '80'
                  }),
                  stroke: new ol.style.Stroke({
                    color: theme.colors[0],
                    width: 2
                  })
                })
              });

              feature.setStyle(style);
              return feature;
            });

            // Create a vector layer for the markers
            const vectorLayer = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: features
              })
            });

            map.addLayer(vectorLayer);

            // Fit the map to show all markers
            const extent = vectorLayer.getSource().getExtent();
            if (extent[0] !== Infinity && extent[1] !== Infinity && extent[2] !== Infinity && extent[3] !== Infinity) {
              map.getView().fit(extent, {
                padding: [20, 20, 20, 20],
                duration: 1000,
                maxZoom: 10
              });
            } else {
              // Fallback: set a reasonable view for the world
              map.getView().setCenter(ol.proj.fromLonLat([-98.5795, 39.8283])); // Center of US
              map.getView().setZoom(3);
            }
          }
        }
      };
      
      document.head.appendChild(link);
      document.head.appendChild(script);
    }

    return () => {
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link?.parentNode) {
        link.parentNode.removeChild(link);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
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
    </div>
  );
};

export default OpenLayersPreview; 