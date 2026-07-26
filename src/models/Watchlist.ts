/**
 * Watchlist Model
 * Represents a user's watchlist of favorite symbols
 */

export interface WatchlistItem {
  id: string;
  deviceId: string;
  symbol: string;
  displayName: string; // e.g., "Euro/US Dollar"
  order: number; // Position in watchlist (for ordering)
  addedAt: Date;
  updatedAt: Date;
}

export interface Watchlist {
  deviceId: string;
  items: WatchlistItem[];
  lastUpdatedAt: Date;
}

export interface AddToWatchlistDTO {
  deviceId: string;
  symbol: string;
  displayName: string;
}

export interface RemoveFromWatchlistDTO {
  deviceId: string;
  symbol: string;
}

export interface ReorderWatchlistDTO {
  deviceId: string;
  items: Array<{
    id: string;
    order: number;
  }>;
}

export const createWatchlistItemModel = (
  data: AddToWatchlistDTO,
  order: number,
): Omit<WatchlistItem, 'id' | 'addedAt' | 'updatedAt'> => ({
  deviceId: data.deviceId,
  symbol: data.symbol,
  displayName: data.displayName,
  order,
});
