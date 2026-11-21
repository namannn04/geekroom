import DottedMap from "dotted-map";
import GlobalReachView, { type MapPin } from "@/components/about/GlobalReachView";
import { countries, home } from "@/data/reach";

/**
 * Server half of the global reach section: the dotted world map and pin positions
 * are computed at build time, so the map library never ships to the browser.
 */
export default function GlobalReach() {
  const map = new DottedMap({ height: 60, grid: "diagonal" });
  const points = map.getPoints();
  const width = Math.max(...points.map((p) => p.x)) + 1;
  const height = Math.max(...points.map((p) => p.y)) + 1;
  // Plain [x, y] pairs keep the serialized props small
  const dots = points.map((p) => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10] as [number, number]);

  const pin = (lat: number, lng: number) => {
    const p = map.getPin({ lat, lng });
    return { x: p.x, y: p.y };
  };

  const pins: MapPin[] = countries.map((c) => ({ name: c.name, continent: c.continent, ...pin(c.lat, c.lng) }));
  const origin = { name: home.name, ...pin(home.lat, home.lng) };

  return <GlobalReachView dots={dots} pins={pins} origin={origin} width={width} height={height} />;
}
