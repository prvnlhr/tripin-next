import wkx from "wkx";

export function wkbToLatLng(wkb: string) {
  try {
    const geometry = wkx.Geometry.parse(Buffer.from(wkb, "hex"));
    return {
      lat: geometry.y,
      lng: geometry.x,
    };
  } catch (error) {
    console.error("Error parsing WKB:", error);
    return null;
  }
}
