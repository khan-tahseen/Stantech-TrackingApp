export interface Attendance {
  clockIn: string | null;
  clockOut: string | null;
}

export interface LocationHistory {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface DealerLocation {
  latitude: number;
  longitude: number;
  name: string;
}
