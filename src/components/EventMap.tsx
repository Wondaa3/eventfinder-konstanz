import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import type { EventItem } from "../types";

interface EventMapProps {
  events: EventItem[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  fitGermany?: boolean;
  withHeat?: boolean;
  withMarkers?: boolean;
  scrollZoom?: boolean;
  interactive?: boolean;
  heatRadius?: number;
  heatBlur?: number;
}

const DEUTSCHLAND: [number, number] = [51.1, 10.2];
const DEUTSCHLAND_ECKEN: [[number, number], [number, number]] = [
  [47.2, 5.8],
  [55.1, 15.1],
];

// graue Grundkarte, dunkler gefiltert per CSS
const TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION = "&copy; OpenStreetMap, &copy; CARTO";

const GRADIENT = {
  0.1: "#facc15",
  0.3: "#fb923c",
  0.6: "#f97316",
  0.85: "#ef4444",
  1.0: "#b91c1c",
};

function EventMap({
  events,
  height = "340px",
  center = DEUTSCHLAND,
  zoom = 6,
  fitGermany = false,
  withHeat = true,
  withMarkers = false,
  scrollZoom = false,
  interactive = true,
  heatRadius = 38,
  heatBlur = 26,
}: EventMapProps) {
  const box = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Effect läuft nur neu, wenn sich die Orte ändern
  const punkteKey = events.map((event) => `${event.id}:${event.lat}:${event.lng}`).join(",");
  const [centerLat, centerLng] = center;

  useEffect(() => {
    if (!box.current) return;

    const map = L.map(box.current, {
      scrollWheelZoom: scrollZoom && interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      zoomControl: interactive,
      zoomSnap: fitGermany ? 0 : 1,
    });
    if (fitGermany) {
      map.fitBounds(DEUTSCHLAND_ECKEN);
    } else {
      map.setView([centerLat, centerLng], zoom);
    }
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

    const mitOrt = events.filter((event) => event.lat != null && event.lng != null);

    if (withHeat) {
      const punkte = mitOrt.map(
        (event) => [event.lat as number, event.lng as number, 1] as [number, number, number]
      );
      L.heatLayer(punkte, {
        radius: heatRadius,
        blur: heatBlur,
        minOpacity: 0.55,
        max: 3,
        gradient: GRADIENT,
      }).addTo(map);
    }

    if (withMarkers) {
      mitOrt.forEach((event) => {
        const marker = L.circleMarker([event.lat as number, event.lng as number], {
          radius: 7,
          color: "#ffffff",
          weight: 2,
          fillColor: "#2563eb",
          fillOpacity: 1,
        }).addTo(map);

        const label = document.createElement("span");
        label.textContent = `${event.title} · ${event.city}`;
        marker.bindTooltip(label);
        marker.on("click", () => navigate(`/events/${event.id}`));
      });
    }

    return () => {
      map.remove();
    };
  }, [
    punkteKey,
    centerLat,
    centerLng,
    zoom,
    fitGermany,
    withHeat,
    withMarkers,
    scrollZoom,
    interactive,
    heatRadius,
    heatBlur,
    navigate,
  ]);

  return <div className="map" style={{ height }} ref={box} />;
}

export default EventMap;
