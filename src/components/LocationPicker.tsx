import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  lat: string;
  lng: string;
  onPick: (lat: number, lng: number) => void;
  onClear: () => void;
}

const DEUTSCHLAND: [number, number] = [51.1, 10.2];
const TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const PUNKT = {
  radius: 9,
  color: "#ffffff",
  weight: 3,
  fillColor: "#dc2626",
  fillOpacity: 1,
};

function LocationPicker({ lat, lng, onPick, onClear }: LocationPickerProps) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  const punktLat = lat === "" ? null : Number(lat);
  const punktLng = lng === "" ? null : Number(lng);

  // Karte nur einmal bauen
  useEffect(() => {
    if (!box.current) return;

    const start = punktLat !== null && punktLng !== null;
    const map = L.map(box.current, { scrollWheelZoom: false }).setView(
      start ? [punktLat, punktLng] : DEUTSCHLAND,
      start ? 14 : 6
    );
    L.tileLayer(TILES, {
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      pickRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Marker folgt dem State
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (punktLat === null || punktLng === null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([punktLat, punktLng]);
    } else {
      markerRef.current = L.circleMarker([punktLat, punktLng], PUNKT).addTo(map);
    }
  }, [punktLat, punktLng]);

  return (
    <div className="location-picker">
      <div className="map" style={{ height: "260px" }} ref={box} />
      {punktLat !== null && punktLng !== null ? (
        <p className="picker-info">
          Ort gesetzt: {punktLat.toFixed(4)}, {punktLng.toFixed(4)}{" "}
          <button type="button" className="secondary small" onClick={onClear}>
            entfernen
          </button>
        </p>
      ) : (
        <p className="picker-info">Auf die Karte klicken, um den genauen Ort zu setzen.</p>
      )}
    </div>
  );
}

export default LocationPicker;
