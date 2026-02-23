// Service to interact with the Express Backend
const API_URL = 'http://localhost:3001/api';

export const fetchDestinations = async () => {
  try {
    const response = await fetch(`${API_URL}/destinations`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRentals = async () => {
  try {
    const response = await fetch(`${API_URL}/rentals`);
    if (!response.ok) throw new Error('Failed to fetch rentals');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchTours = async () => {
  try {
    const response = await fetch(`${API_URL}/tours`);
    if (!response.ok) throw new Error('Failed to fetch tours');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const cancelBooking = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData: any) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Booking failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};
