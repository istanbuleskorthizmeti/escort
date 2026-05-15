import { google } from 'googleapis';
import { googleAuth } from '../google-auth';

/**
 * DRKCNAY ELITE PLACES INTELLIGENCE
 * Fetches real-world business data (tekel, pharmacy, hotels) to enrich SEO pages.
 */

export interface PlaceResult {
  name?: string;
  address?: string;
  rating?: number;
  types?: string[];
  phoneNumber?: string;
}

class PlacesService {
  private places = google.places('v1');

  /**
   * Search for businesses in a specific area by query (e.g., "Bebek Tekel").
   */
  async searchLocalBusinesses(query: string, locationBias?: { latitude: number, longitude: number }): Promise<PlaceResult[]> {
    const auth = await googleAuth.getAuthorizedClient();
    
    try {
      const res = await this.places.places.searchText({
        auth,
        requestBody: {
          textQuery: query,
          maxResultCount: 10,
          locationBias: locationBias ? {
            circle: {
              center: { latitude: locationBias.latitude, longitude: locationBias.longitude },
              radius: 5000 // 5km radius
            }
          } : undefined
        },
      });

      return (res.data.places || []).map(p => ({
        name: p.displayName?.text || undefined,
        address: p.formattedAddress || undefined,
        rating: p.rating || undefined,
        types: (p.types as string[]) || undefined,
        phoneNumber: p.nationalPhoneNumber || undefined
      }));
    } catch (error: any) {
      console.error(`[PLACES] Search Failed: ${error.message}`);
      return [];
    }
  }
}

export const placesService = new PlacesService();
