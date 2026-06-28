import { useEffect, useRef, useState } from "react";

export interface MarkerData {
  lat: number;
  lng: number;
  color?: string;
  popupHtml?: string;
  status?: string;
  iconHtml?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  height?: number | string;
  markers?: MarkerData[];
  className?: string;
  onMarkerClick?: (marker: MarkerData, index: number) => void;
  focusIndex?: number | null;
  showGhanaOnly?: boolean;
  dragging?: boolean;
  zoomControl?: boolean;
}

declare const L: any;

let leafletLoaded = false;
let leafletLoading = false;
const callbacks: (() => void)[] = [];

function loadLeaflet(cb: () => void) {
  if (leafletLoaded) { cb(); return; }
  callbacks.push(cb);
  if (leafletLoading) return;
  leafletLoading = true;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(css);

  const script = document.createElement("script");
  script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  script.onload = () => {
    leafletLoaded = true;
    callbacks.forEach(fn => fn());
    callbacks.length = 0;
  };
  document.head.appendChild(script);
}

const pulseStyle = `
  @keyframes markerPulse {
    0%,100% { box-shadow: 0 3px 8px rgba(0,0,0,0.4), 0 0 0 0 rgba(27,94,32,0.5); }
    50%      { box-shadow: 0 3px 8px rgba(0,0,0,0.4), 0 0 0 8px rgba(27,94,32,0); }
  }
`;

function injectPulseStyle() {
  if (document.getElementById("leaflet-pulse-style")) return;
  const el = document.createElement("style");
  el.id = "leaflet-pulse-style";
  el.textContent = pulseStyle;
  document.head.appendChild(el);
}

function markerIcon(m: MarkerData): any {
  if (m.iconHtml) {
    const sz = m.iconSize ?? [38, 38];
    const anch = m.iconAnchor ?? [sz[0] / 2, sz[1] / 2];
    return L.divIcon({ html: m.iconHtml, className: "", iconSize: sz, iconAnchor: anch });
  }

  const s = m.status?.toUpperCase();
  const isActive = s === "ACTIVE";
  const isExpired = s === "EXPIRED";

  const bg = isActive ? "#1b5e20" : isExpired ? "#c62828" : "#e65100";
  const size = isActive ? 18 : 16;
  const border = isActive ? "3px solid white" : "2px solid white";
  const animation = isActive ? "animation:markerPulse 2s ease-in-out infinite;" : "";

  return L.divIcon({
    html: `<div style="background:${bg};width:${size}px;height:${size}px;border-radius:50%;border:${border};box-shadow:0 3px 8px rgba(0,0,0,0.4);${animation}"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function addGhanaOverlay(map: any) {
  const worldWithHole = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
        [[-3.26, 4.73], [-3.26, 11.17], [1.19, 11.17], [1.19, 4.73], [-3.26, 4.73]],
      ],
    },
    properties: {},
  };
  L.geoJSON(worldWithHole, {
    style: { fillColor: "#000", fillOpacity: 0.28, stroke: false, weight: 0 },
    interactive: false,
  }).addTo(map);
}

export default function LeafletMap({
  center = [7.9465, -1.0232],
  zoom,
  height = 400,
  markers = [],
  className = "",
  onMarkerClick,
  focusIndex = null,
  showGhanaOnly = false,
  dragging = true,
  zoomControl = true,
}: LeafletMapProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const markersRef      = useRef<any[]>([]);
  const overlayAddedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  const isMobile   = typeof window !== "undefined" && window.innerWidth < 768;
  const defaultZoom = zoom ?? (isMobile ? 6 : 7);

  useEffect(() => {
    injectPulseStyle();

    loadLeaflet(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl, dragging });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
        maxZoom: 19,
      }).addTo(map);

      if (showGhanaOnly) {
        addGhanaOverlay(map);
        overlayAddedRef.current = true;
      }

      map.setView(center, defaultZoom);
      map.whenReady(() => setMapReady(true));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        overlayAddedRef.current = false;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers whenever markers data changes OR map becomes ready
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    mapRef.current.invalidateSize();
    markersRef.current.forEach(m => mapRef.current.removeLayer(m));
    markersRef.current = [];

    if (markers.length === 0) return;

    const leafletMarkers = markers.map((m, idx) => {
      const icon = markerIcon(m);
      const lm = L.marker([m.lat, m.lng], { icon }).addTo(mapRef.current);
      if (m.popupHtml) lm.bindPopup(m.popupHtml);
      if (onMarkerClick) {
        lm.on("click", () => onMarkerClick(m, idx));
      }
      return lm;
    });
    markersRef.current = leafletMarkers;

    if (focusIndex !== null) return;

    if (markers.length === 1) {
      mapRef.current.flyTo([markers[0].lat, markers[0].lng], 14);
    } else {
      const group = L.featureGroup(leafletMarkers);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [JSON.stringify(markers), mapReady]);

  // Handle focusIndex changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || focusIndex === null) return;
    const m = markers[focusIndex];
    if (!m) return;
    mapRef.current.flyTo([m.lat, m.lng], 14);
    const lm = markersRef.current[focusIndex];
    if (lm) lm.openPopup();
  }, [focusIndex, mapReady]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: "100%", borderRadius: 10, overflow: "hidden" }}
    />
  );
}
