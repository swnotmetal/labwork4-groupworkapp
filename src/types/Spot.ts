// Type definitions for our spot-mapping app

// Represents a single spot/pin on the map
export interface Spot {
  id: string;           // Unique identifier (hint: use Date.now() or UUID)
  lat: number;          // Latitude coordinate
  lng: number;          // Longitude coordinate
  note: string;         // User's note about this spot
  emoji: string;        // Optional emoji representation
  category: SpotCategory; // Category for color-coding
  createdAt: number;    // Timestamp
}

// Categories for color-coding pins
export enum SpotCategory {
  CAFE = 'cafe',
  PARK = 'park',
  RESTAURANT = 'restaurant',
  SECRET = 'secret',
  OTHER = 'other'
}

// Color mapping for categories
export const CATEGORY_COLORS: Record<SpotCategory, string> = {
  [SpotCategory.CAFE]: '#8B4513',      // Brown
  [SpotCategory.PARK]: '#228B22',      // Green
  [SpotCategory.RESTAURANT]: '#FF6347', // Tomato red
  [SpotCategory.SECRET]: '#9370DB',    // Purple
  [SpotCategory.OTHER]: '#4169E1'      // Royal blue
};