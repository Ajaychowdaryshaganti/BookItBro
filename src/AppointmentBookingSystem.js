import { useState, useEffect } from 'react';

export default function AppointmentBookingSystem() {
  // States for form inputs
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [patientId, setPatientId] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [appointmentFee, setAppointmentFee] = useState(500); // Default fee in INR

  // Constants for UPI payment
  const UPI_ID = "ajaychowdarys@ybl";
  
  // Calculate min and max dates for calendar
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Mock time slots - in a real app, these would be fetched based on availability
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 ${ampm}`);
      slots.push(`${displayHour}:30 ${ampm}`);
    }
    return slots;
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // In a real app, this would fetch available slots from server
    setAvailableSlots(generateTimeSlots());
    setSelectedSlot('');
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  // Fetch patient info when contact number is entered
  const fetchPatientInfo = () => {
    // Mock AI flow for retrieving patient info
    if (contactNumber.length === 10) {
      setIsLoading(true);
      // Simulating API call delay
      setTimeout(() => {
        // Mock response
        if (contactNumber === '9876543210') {
          setName('Rahul Sharma');
          setPatientId('PT10001');
        } else {
          // New patient
          setPatientId(`PT${Math.floor(10000 + Math.random() * 90000)}`);
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  // Handle booking submission
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedSlot || !name || !contactNumber) {
      setMessage('Please fill all required fields');
      return;
    }

    // Add booking to Firebase (mock)
    const newBooking = {
      id: `BK${Math.floor(10000 + Math.random() * 90000)}`,
      date: selectedDate,
      slot: selectedSlot,
      name,
      contactNumber,
      patientId,
      notes,
      status: 'pending_payment',
      fee: appointmentFee
    };

    // Simulate adding to Firebase
    setBookings([...bookings, newBooking]);
    setMessage('Appointment added to queue successfully!');
    
    // Reset form
    resetForm();
  };

  // Generate UPI payment link
  const generateUPILink = (bookingId, amount) => {
    // Create UPI payment link with parameters
    const paymentDescription = `Doctor Appointment Fee - ${bookingId}`;
    
    // In production, you'd use actual UPI deep link format or payment gateway
    return `upi://pay?pa=${UPI_ID}&pn=DoctorClinic&am=${amount}&cu=INR&tn=${encodeURIComponent(paymentDescription)}`;
  };

  // Handle payment link generation and SMS sending
  const handleGeneratePayment = () => {
    if (!selectedDate || !selectedSlot || !name || !contactNumber) {
      setMessage('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    
    // Generate booking ID
    const bookingId = `BK${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Generate UPI payment link
    const paymentLink = generateUPILink(bookingId, appointmentFee);
    
    // Simulate Twilio SMS service
    setTimeout(() => {
      console.log(`SMS sent to +91${contactNumber} with payment link: ${paymentLink}`);
      
      // Create shortened link for display purposes
      const shortenedLink = `shorturl.at/${Math.random().toString(36).substring(2, 6)}`;
      
      setMessage(`Payment link sent to +91${contactNumber}. Please complete payment to confirm your appointment.`);
      setIsLoading(false);
      
      // Add booking with payment status
      const newBooking = {
        id: bookingId,
        date: selectedDate,
        slot: selectedSlot,
        name,
        contactNumber,
        patientId,
        notes,
        status: 'payment_sent',
        fee: appointmentFee,
        paymentLink: shortenedLink
      };
      
      setBookings([...bookings, newBooking]);
      
      // Reset form
      resetForm();
    }, 2000);
  };

  // Regenerate payment link for pending payments
  const handleRegeneratePayment = (booking) => {
    setIsLoading(true);
    
    // Generate new UPI payment link
    const paymentLink = generateUPILink(booking.id, booking.fee);
    
    // Simulate sending SMS
    setTimeout(() => {
      console.log(`New payment link sent to +91${booking.contactNumber}: ${paymentLink}`);
      
      // Update booking in the list
      const updatedBookings = bookings.map(b => {
        if (b.id === booking.id) {
          return {
            ...b,
            status: 'payment_sent',
            paymentLink: `shorturl.at/${Math.random().toString(36).substring(2, 6)}`
          };
        }
        return b;
      });
      
      setBookings(updatedBookings);
      setIsLoading(false);
      setMessage(`Payment link resent to +91${booking.contactNumber}`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedDate('');
    setSelectedSlot('');
    setName('');
    setContactNumber('');
    setNotes('');
    setPatientId('');
    setAvailableSlots([]);
  };

  // Mock fetch bookings (in real app, would fetch from Firebase)
  useEffect(() => {
    // Simulate fetching existing bookings
    const mockBookings = [
      { 
        id: 'BK10001', 
        date: '2025-04-15', 
        slot: '10:00 AM', 
        name: 'Priya Patel', 
        contactNumber: '8765432101', 
        status: 'confirmed',
        fee: 500
      },
      { 
        id: 'BK10002', 
        date: '2025-04-16', 
        slot: '2:30 PM', 
        name: 'Arun Kumar', 
        contactNumber: '9876543212', 
        status: 'pending_payment',
        fee: 500
      },
      { 
        id: 'BK10003', 
        date: '2025-04-17', 
        slot: '11:00 AM', 
        name: 'Neha Sharma', 
        contactNumber: '7654321098', 
        status: 'payment_sent',
        fee: 700,
        paymentLink: 'shorturl.at/wxyz1'
      }
    ];
    setBookings(mockBookings);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Medical Appointment Booking System</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-md ${!showBookings ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setShowBookings(false)}
        >
          Book Appointment
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${showBookings ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setShowBookings(true)}
        >
          Manage Bookings
        </button>
      </div>
      
      {!showBookings ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDateString}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {selectedDate && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 border rounded-md ${
                          selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Appointment Fee (₹)</label>
                <input
                  type="number"
                  value={appointmentFee}
                  onChange={(e) => setAppointmentFee(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="100"
                  step="100"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    onBlur={fetchPatientInfo}
                    placeholder="10-digit mobile number"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md"
                    maxLength={10}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {patientId && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">Patient ID: {patientId}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Additional Notes for Doctor</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any symptoms or special requirements"
              className="w-full p-2 border border-gray-300 rounded-md h-24"
            ></textarea>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleBookAppointment}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Add to Queue'}
            </button>
            <button
              onClick={handleGeneratePayment}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Generate UPI Payment Link'}
            </button>
          </div>
          
          {message && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
              {message}
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>UPI Payment:</strong> After clicking "Generate UPI Payment Link", a payment link will be sent to customers 
              mobile number via SMS.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
              {message}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Booking ID</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Time Slot</th>
                  <th className="py-2 px-4 border-b">Patient Name</th>
                  <th className="py-2 px-4 border-b">Contact</th>
                  <th className="py-2 px-4 border-b">Fee (₹)</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="py-2 px-4 border-b">{booking.id}</td>
                    <td className="py-2 px-4 border-b">{formatDateForDisplay(booking.date)}</td>
                    <td className="py-2 px-4 border-b">{booking.slot}</td>
                    <td className="py-2 px-4 border-b">{booking.name}</td>
                    <td className="py-2 px-4 border-b">{booking.contactNumber}</td>
                    <td className="py-2 px-4 border-b">{booking.fee}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmed' : 
                         booking.status === 'pending_payment' ? 'Payment Pending' : 'Payment Link Sent'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {(booking.status === 'pending_payment' || booking.status === 'payment_sent') && (
                        <button
                          onClick={() => handleRegeneratePayment(booking)}
                          disabled={isLoading}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          Resend Payment
                        </button>
                      )}
                      {booking.paymentLink && (
                        <div className="mt-1 text-xs text-gray-500">
                          Link: {booking.paymentLink}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}