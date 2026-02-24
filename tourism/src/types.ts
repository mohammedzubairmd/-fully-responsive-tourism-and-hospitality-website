export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
}

export interface CarRental {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  features: string[];
}

export interface Tour {
  id: number;
  name: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  description: string;
}

export interface TravelGuide {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  date: string;
}

export interface BookingData {
  destinationId?: number;
  customerName: string;
  email: string;
  amount?: number;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

export interface Booking {
  id: string;
  destinationId: number;
  customerName: string;
  email: string;
  amount: number;
  status: string;
  date: string;
}
