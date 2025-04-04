    import { createResponse } from "@/utils/apiResponseUtils";
    import { createClient } from "@/utils/supabase/server";

    type NearbyDriversParams = {
    lat: string;
    lng: string;
    };

    type NearbyDriver = {
    id: string;
    name: string;
    phone: string;
    latitude: number;
    longitude: number;
    distance_meters: number;
    };

    // Get nearby drivers within 5km range
    export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat") as string;
        const lng = searchParams.get("lng") as string;
        const radius = searchParams.get("radius") || "5000";

        const latitude = parseFloat(lat || "");
        const longitude = parseFloat(lng || "");
        const maxDistance = parseFloat(radius);
        console.log(" latitude:", latitude);
        console.log(" longitude:", longitude);
        console.log(" maxDistance:", maxDistance);

        if (isNaN(latitude) || isNaN(longitude)) {
        return createResponse(
            400,
            null,
            "Valid latitude and longitude are required"
        );
        }

        if (isNaN(maxDistance)) {
        return createResponse(400, null, "Radius must be a valid number");
        }

        // Fetch nearby drivers
        const { data: drivers, error } = await supabase.rpc("get_nearby_drivers", {
        lat: latitude,
        long: longitude,
        max_distance: maxDistance,
        });

        if (error) {
        console.error("Supabase error:", error);
        return createResponse(
            500,
            null,
            error.message,
            "Failed to fetch nearby drivers"
        );
        }

        // Format the response data
        const responseData: NearbyDriver[] = (drivers || []).map((driver: any) => ({
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        latitude: driver.latitude,
        longitude: driver.longitude,
        distance_meters: driver.distance_meters,
        }));

        return createResponse<NearbyDriver[]>(200, responseData);
    } catch (error) {
        console.error("Nearby Drivers API Error:", error);
        return createResponse(
        500,
        null,
        error instanceof Error ? error.message : "Unknown error",
        "Failed to fetch nearby drivers"
        );
    }
    }
