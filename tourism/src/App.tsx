import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Hotel, 
  Car, 
  Map, 
  Star, 
  ChevronRight,
  ArrowRight,
  X,
  Camera,
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './styles/App.css';
import { fetchDestinations, fetchRentals, fetchTours, createBooking, fetchBookings, cancelBooking } from './services/api';

  // Fallback data in case backend isn't running
import { destinations as mockDestinations, carRentals as mockRentals, tours as mockTours, travelGuides } from './data/mockData';
import { Destination, CarRental, Tour, Booking } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Data State - Initialized with mock data so it works immediately
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations);
  const [rentals, setRentals] = useState<CarRental[]>(mockRentals);
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [selectedItem, setSelectedItem] = useState<Destination | CarRental | Tour | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    guests: '1',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const dests = await fetchDestinations();
        const cars = await fetchRentals();
        const tourData = await fetchTours();
        if (dests.length > 0) setDestinations(dests);
        if (cars.length > 0) setRentals(cars);
        if (tourData.length > 0) setTours(tourData);
      } catch (err) {
        console.error("Failed to load data from backend", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRentals = rentals.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTours = tours.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openBooking = (item: Destination | CarRental | Tour) => {
    setSelectedItem(item);
    setBookingStep(1);
    setIsModalOpen(true);
    setBookingError('');
  };

  const openBookings = async () => {
    setIsBookingsOpen(true);
    setLoading(true);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  const handleNewsletterJoin = () => {
    if (newsletterEmail) {
      setNewsletterJoined(true);
      setTimeout(() => setNewsletterJoined(false), 3000);
      setNewsletterEmail('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setBookingError('');

    try {
      await createBooking({
        destinationId: selectedItem?.id,
        customerName: formData.name,
        email: formData.email,
        amount: selectedItem?.price,
        cardDetails: {
          number: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv
        }
      });
      setBookingStep(3); // Success
    } catch (err: any) {
      setBookingError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin className="text-primary" style={{ color: 'var(--primary)' }} />
            <span>Horizon<span style={{ color: 'var(--primary)' }}>Travels</span></span>
          </div>

          <ul className="nav-links desktop-only">
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#rentals">Car Rentals</a></li>
            <li><a href="#tours">Tours</a></li>
            <li><a href="#guides">Travel Guides</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>

          <div className="nav-actions">
            <button className="btn-search" style={{ padding: '8px 24px' }} onClick={openBookings}>My Bookings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content container">
          <h1>Discover Your Next Adventure</h1>
          <p>Book unique stays, luxury cars, and unforgettable tours all in one place.</p>
        </div>
      </header>

      {/* Booking Engine */}
      <section className="container">
        <div className="booking-engine">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              <Hotel size={20} /> Hotels
            </button>
            <button 
              className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
              onClick={() => setActiveTab('cars')}
            >
              <Car size={20} /> Car Rentals
            </button>
            <button 
              className={`tab ${activeTab === 'tours' ? 'active' : ''}`}
              onClick={() => setActiveTab('tours')}
            >
              <Map size={20} /> Tours
            </button>
          </div>

          <div className="search-form">
            <div className="form-group">
              <label>Where to?</label>
              <input 
                type="text" 
                placeholder="Destination, Hotel, or Activity" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Check-in</label>
              <input type="date" />
            </div>
            {activeTab === 'hotels' && (
              <div className="form-group">
                <label>Guests</label>
                <select>
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>Family</option>
                </select>
              </div>
            )}
            <button className="btn-search" onClick={() => {
              const target = activeTab === 'hotels' ? '#destinations' : activeTab === 'cars' ? '#rentals' : '#tours';
              window.location.href = target;
            }}>
              <Search size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Browse
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="section container">
        <h2 className="section-title">Popular Destinations</h2>
        {loading ? (
          <p>Loading destinations...</p>
        ) : (
          <div className="grid">
            {filteredDestinations.map(dest => (
              <div key={dest.id} className="card">
                <img src={dest.image} alt={dest.name} className="card-image" />
                <div className="card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 className="card-title">{dest.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={16} fill="var(--accent)" color="var(--accent)" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    {dest.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="card-price">From ${dest.price}</span>
                    <button 
                      onClick={() => openBooking(dest)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      Book Now <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Car Rentals Section */}
      <section id="rentals" className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 className="section-title">Premium Car Rentals</h2>
          <div className="grid">
            {filteredRentals.map(car => (
              <div key={car.id} className="card">
                <img src={car.image} alt={car.name} className="card-image" />
                <div className="card-content">
                  <h3 className="card-title">{car.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {car.features.map(f => (
                      <span key={f} style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>{f}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="card-price">${car.price} / day</span>
                    <button 
                      className="btn-search" 
                      style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      onClick={() => openBooking(car)}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" className="section container">
        <h2 className="section-title">Adventure Tours</h2>
        <div className="grid">
          {filteredTours.map(tour => (
            <div key={tour.id} className="card">
              <img src={tour.image} alt={tour.name} className="card-image" />
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 className="card-title">{tour.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} fill="var(--accent)" color="var(--accent)" />
                    <span>{tour.rating}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Duration: {tour.duration}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  {tour.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="card-price">From ${tour.price}</span>
                  <button 
                    onClick={() => openBooking(tour)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    Book Tour <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Guides Section */}
      <section id="guides" className="section container">
        <h2 className="section-title">Travel Inspiration</h2>
        <div className="grid">
          {travelGuides.map(guide => (
            <div key={guide.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-content">
                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase' }}>{guide.category}</span>
                <h3 className="card-title" style={{ marginTop: '8px' }}>{guide.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{guide.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{guide.date}</span>
                  <a href="#" style={{ color: 'var(--secondary)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read More <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="section container">
        <h2 className="section-title">Guest Gallery</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {destinations.map(d => (
            <div 
              key={d.id} 
              style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer', aspectRatio: '1' }}
              onClick={() => setSelectedImage(d.image)}
            >
              <img src={d.image} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="gallery-img" />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="gallery-overlay">
                <Camera color="white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full view" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
          <button style={{ position: 'absolute', top: '40px', right: '40px', background: 'white', border: 'none', borderRadius: '50%', padding: '8px' }}>
            <X size={24} />
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="lightbox-overlay" style={{ alignItems: 'flex-start', paddingTop: '100px', overflowY: 'auto' }}>
          <div className="booking-modal" style={{ background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            {bookingStep === 1 && (
              <>
                <h3 style={{ marginBottom: '16px' }}>Confirm Booking</h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                  <img src={selectedItem?.image} alt="Thumb" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4>{selectedItem?.name}</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${selectedItem?.price}</p>
                  </div>
                </div>
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                </div>
                
                <button className="btn-search" style={{ width: '100%' }} onClick={() => setBookingStep(2)}>
                  Proceed to Payment
                </button>
              </>
            )}

            {bookingStep === 2 && (
              <form onSubmit={submitBooking}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={24} /> Payment Details
                </h3>
                
                {bookingError && (
                  <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertCircle size={16} /> {bookingError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={handleInputChange} 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" maxLength={3} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <span>Total Amount:</span>
                  <span>${selectedItem?.price}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button type="button" onClick={() => setBookingStep(1)} style={{ padding: '12px', flex: 1, border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                  <button type="submit" className="btn-search" style={{ flex: 2 }} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </form>
            )}

            {bookingStep === 3 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Thank you, {formData.name}. Your booking for <strong>{selectedItem?.name}</strong> has been confirmed.
                  We have sent a receipt to {formData.email}.
                </p>
                <button className="btn-search" onClick={() => setIsModalOpen(false)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Bookings Modal */}
      {isBookingsOpen && (
        <div className="lightbox-overlay" style={{ alignItems: 'flex-start', paddingTop: '100px', overflowY: 'auto' }}>
          <div className="booking-modal" style={{ background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '800px', width: '90%', position: 'relative' }}>
            <button 
              onClick={() => setIsBookingsOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h3 style={{ marginBottom: '24px' }}>My Confirmed Bookings</h3>
            
            {loading ? (
              <p>Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>You don't have any bookings yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px' }}>Booking ID</th>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Amount</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace' }}>{b.id}</td>
                        <td style={{ padding: '12px' }}>
                          <div>{b.customerName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.email}</div>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>${b.amount}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.875rem' }}>{new Date(b.date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <button className="btn-search" style={{ marginTop: '24px', width: '100%' }} onClick={() => setIsBookingsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--secondary)', color: 'white', padding: '60px 0 20px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>Horizon Travels</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Making your travel dreams a reality since 2010. Excellence in hospitality and adventure.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>About Us</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Support</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Newsletter</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Your email" 
                style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', flex: 1 }} 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button 
                onClick={handleNewsletterJoin}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
              >
                Join
              </button>
            </div>
            {newsletterJoined && <p style={{ color: '#4ade80', fontSize: '0.8rem', marginTop: '8px' }}>Thanks for subscribing!</p>}
          </div>
        </div>
        <div className="container" style={{ borderTop: '1px solid #334155', marginTop: '40px', paddingTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
          &copy; 2026 Horizon Travels. All rights reserved. Built with React & TypeScript.
        </div>
      </footer>
    </div>
  );
}

export default App;
