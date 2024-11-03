export interface Client {
  id: string;
  name: string;
  phone?: string;
  checkInStatus: 'pending' | 'checked-in' | 'no-show';
}

export interface TourGuide {
  id: string;
  name: string;
  email: string;
  phone: string;
  availability: boolean;
}

export interface Tour {
  id: string;
  name: string;
  date: string;
  busNumber: string;
  startTime: string;
  endTime: string;
  meetingPoint: string;
  clients: Client[];
  guide?: TourGuide;
}

export interface User {
  id: string;
  name: string;
  role: 'guide' | 'admin';
}