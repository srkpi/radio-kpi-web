export interface RawStats {
  songs: [string, number, string][];
  orders: number[][];
}

export interface ComputedStats {
  totalOrders: number;
  totalMinutes: number;
  daysActive: number;
  topSongs: { name: string; count: number }[];
  monthly: { month: string; count: number }[];
  byHour: { hour: string; count: number }[];
  byWeekday: { day: string; count: number }[];
}
