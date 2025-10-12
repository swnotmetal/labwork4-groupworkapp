import { Spot } from '../types/Spot';

const STORAGE_KEY = 'my-spots';

/**
 * Storage utilities for persisting spots locally
 * Uses localStorage API - data persists even after closing the app
 */

// Load all spots from localStorage
export const loadSpots = (): Spot[] => {
  const storageDataRaw = localStorage.getItem(STORAGE_KEY);
  
  if (!storageDataRaw) {
    return [];
  }
  
  return JSON.parse(storageDataRaw);
};

// Save spots array to localStorage
export const saveSpots = (spots: Spot[]): void => {
  const spotString = JSON.stringify(spots);
  localStorage.setItem(STORAGE_KEY, spotString);
};

// Add a new spot to storage
export const addSpot = (spot: Spot): void => {
  const currentSpotArr = loadSpots();
  currentSpotArr.push(spot);
  saveSpots(currentSpotArr);
};

// Delete a spot by ID
export const deleteSpot = (id: string): void => {
  const spots = loadSpots();
  const result = spots.filter((spot) => spot.id !== id);
  saveSpots(result);
};

// Update an existing spot
export const updateSpot = (updatedSpot: Spot): void => {
  const spots = loadSpots();
  const index = spots.findIndex((spot) => spot.id === updatedSpot.id);

  if (index !== -1) {
    spots[index] = updatedSpot;
    saveSpots(spots);
  }
};

// Clear all spots from storage
export const clearAllSpots = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};