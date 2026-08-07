// Typen für das Plugin leaflet.heat
import "leaflet";

declare module "leaflet" {
  interface HeatOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    minOpacity?: number;
    max?: number;
    gradient?: Record<number, string>;
  }

  function heatLayer(points: [number, number, number][], options?: HeatOptions): Layer;
}

declare module "leaflet.heat";
