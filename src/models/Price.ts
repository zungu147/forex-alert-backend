/**
 * Price Model
 * Represents current market prices for symbols
 */

export interface Price {
  id: string;
  symbol: string;
  bid: number; // Bid price
  ask: number; // Ask price
  mid: number; // Mid price (average of bid and ask)
  timestamp: Date;
  change: number; // Price change
  changePercent: number; // Percentage change
  open: number; // Open price
  high: number; // High price
  low: number; // Low price
  volume?: number; // Trading volume
  updatedAt: Date;
}

export interface PriceUpdate {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: Date;
  change?: number;
  changePercent?: number;
}

export interface CreatePriceDTO {
  symbol: string;
  bid: number;
  ask: number;
  open: number;
  high: number;
  low: number;
  volume?: number;
}

export const createPriceModel = (
  data: CreatePriceDTO,
  previousPrice?: Price,
): Omit<Price, 'id' | 'updatedAt'> => {
  const mid = (data.bid + data.ask) / 2;
  const previousMid = previousPrice ? (previousPrice.bid + previousPrice.ask) / 2 : mid;
  const change = mid - previousMid;
  const changePercent = previousMid !== 0 ? (change / previousMid) * 100 : 0;

  return {
    symbol: data.symbol,
    bid: data.bid,
    ask: data.ask,
    mid,
    timestamp: new Date(),
    change,
    changePercent,
    open: data.open,
    high: data.high,
    low: data.low,
    volume: data.volume,
  };
};
