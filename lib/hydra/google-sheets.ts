import { getGlobalContact } from '../contact-service';

/**
 * DRKCNAY ELITE: GOOGLE SHEETS COMMAND CENTER ENGINE
 * Fetches dynamic SEO targets (Cities, Districts) from a central Google Sheet.
 */

// WARNING: These should be in .env.local
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY || ""; // Strict fallback
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID || "1XycTLWfSZVmVUooPyC1afp14dT_XT10v38UbyTn6KKA";

// Assuming the sheet has columns: City | District | Latitude | Longitude
const RANGE = "A2:D100"; // Read from row 2 up to 100

export interface CommandCenterTarget {
    city: string;
    district: string;
    latitude: number;
    longitude: number;
}

export async function fetchCommandCenterTargets(): Promise<CommandCenterTarget[]> {
    if (!SPREADSHEET_ID) {
        console.warn("[DRKCNAY] Google Sheets ID is missing. Falling back to local config.");
        return [];
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_API_KEY}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour to avoid API limits, or force revalidate on demand
        });

        if (!response.ok) {
            throw new Error(`Google Sheets API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
            return [];
        }

        // Map the raw array data into structured objects
        const targets: CommandCenterTarget[] = data.values
            .filter((row: any[]) => row.length >= 2) // Ensure at least city and district exist
            .map((row: any[]) => ({
                city: row[0]?.trim() || "",
                district: row[1]?.trim() || "",
                latitude: parseFloat(row[2]) || 41.0082, // Default to Istanbul lat if missing
                longitude: parseFloat(row[3]) || 28.9784  // Default to Istanbul lng if missing
            }));

        return targets;

    } catch (error) {
        console.error("[DRKCNAY] Failed to fetch Command Center data:", error);
        return [];
    }
}
