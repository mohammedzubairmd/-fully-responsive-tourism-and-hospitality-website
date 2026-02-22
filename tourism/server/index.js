import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database (Simulating Persistent Data)
const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    description: "Famous for its stunning sunsets, white-washed buildings, and blue-domed churches.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800",
    price: 1200,
    rating: 4.9
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    description: "A tropical paradise known for its lush jungles, pristine beaches, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    price: 850,
    rating: 4.8
  },
  {
    id: 3,
    name: "Kyoto, Japan",
    description: "A city where modern meets traditional, featuring stunning temples and serene gardens.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    price: 1500,
    rating: 4.7
  },
  {
    id: 4,
    name: "Amalfi Coast, Italy",
    description: "Breathtaking coastal cliffs and charming seaside towns overlooking the Mediterranean.",
    image: "https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?auto=format&fit=crop&q=80&w=800",
    price: 1800,
    rating: 4.9
  }
];

const carRentals = [
  {
    id: 1,
    name: "Convertible Luxury",
    type: "Luxury",
    price: 150,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    features: ["Automatic", "AC", "2 Seats"]
  },
  {
    id: 2,
    name: "Off-Road SUV",
    type: "Adventure",
    price: 95,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    features: ["4x4", "Manual", "5 Seats"]
  }
];

const tours = [
  {
    id: 1,
    name: "Ancient Athens Walking Tour",
    duration: "4 Hours",
    price: 45,
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    description: "Explore the historic heart of Athens, visiting the Acropolis and the Plaka district."
  },
  {
    id: 2,
    name: "Safari Adventure",
    duration: "2 Days",
    price: 320,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    description: "Witness the majesty of African wildlife in their natural habitat."
  }
];

// In-memory storage for bookings
let bookings = [];

// API Endpoints
app.get('/api/destinations', (req, res) => {
  res.json(destinations);
});

app.get('/api/rentals', (req, res) => {
  res.json(carRentals);
});

app.get('/api/tours', (req, res) => {
  res.json(tours);
});

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== id);
  
  if (bookings.length < initialLength) {
    res.json({ success: true, message: "Booking cancelled successfully." });
  } else {
    res.status(404).json({ success: false, message: "Booking not found." });
  }
});

// Payment Processing Endpoint (Simulated)
app.post('/api/bookings', (req, res) => {
  const { destinationId, customerName, email, cardDetails, amount } = req.body;
  
  // Simulated Processing Delay
  setTimeout(() => {
    // Basic validation logic
    if (!destinationId || !customerName || !email || !cardDetails || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    if (cardDetails.number.length < 16) {
      return res.status(400).json({ success: false, message: "Invalid card number." });
    }

    // Success Scenario
    const bookingId = `BK-${Date.now()}`;
    const newBooking = {
      id: bookingId,
      destinationId,
      customerName,
      email,
      amount,
      status: 'confirmed',
      date: new Date()
    };
    
    bookings.push(newBooking);
    
    console.log(`[PAYMENT SUCCESS] Booking ${bookingId} for ${amount} by ${customerName}`);
    
    res.json({
      success: true,
      bookingId: bookingId,
      message: "Payment processed successfully. Your booking is confirmed!"
    });
  }, 1500); // 1.5s delay to simulate network request
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
