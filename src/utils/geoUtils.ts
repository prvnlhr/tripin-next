import wkx from "wkx";

export function wkbToLatLng(wkb: string) {
  try {
    const geometry = wkx.Geometry.parse(Buffer.from(wkb, "hex"));
    if (geometry instanceof wkx.Point) {
      return {
        lat: geometry.y,
        lng: geometry.x,
      };
    }
  } catch (error) {
    console.error("Error parsing WKB:", error);
    return null;
  }
}
// utils/geoUtils.ts
export const getAddressFromLatLng = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  if (!window.google || !window.google.maps) {
    console.error("Google Maps API not loaded");
    return null;
  }

  const geocoder = new google.maps.Geocoder();
  const latLng = { lat, lng };

  try {
    const response = await geocoder.geocode({ location: latLng });
    if (response.results && response.results.length > 0) {
      // Prioritize results with higher specificity
      for (const result of response.results) {
        // Look for a result with a detailed address (e.g., street level)
        if (
          result.types.includes("street_address") ||
          result.types.includes("premise") ||
          result.types.includes("route")
        ) {
          return result.formatted_address; // Return the first detailed address
        }
      }
      // Fallback to the first result if no detailed address is found
      return response.results[0].formatted_address;
    } else {
      console.warn("No results found for coordinates:", latLng);
      return null;
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};
