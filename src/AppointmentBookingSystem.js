import { useState, useEffect } from 'react';

export default function MobileAppointmentSystem() {
  // States for form inputs
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
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

  // Available doctors list
  const doctors = [
    { id: 1, name: 'Dr. Sharma (Cardiology)' },
    { id: 2, name: 'Dr. Patel (Orthopedics)' },
    { id: 3, name: 'Dr. Gupta (General Medicine)' },
    { id: 4, name: 'Dr. Khan (Pediatrics)' }
  ];

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
    // In a real app, this would fetch available slots from server based on doctor and date
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
        // Mock response - in a real app, this would check the database
        if (contactNumber === '9876543210') {
          setName('Rahul Sharma');
          setAge('32');
          setSex('Male');
          setAddress('123 Main Street, Bangalore');
          setPatientId('PT10001');
        } else {
          // New patient gets a new ID
          setPatientId(`PT${Math.floor(10000 + Math.random() * 90000)}`);
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  // Handle booking submission
  const handleBookAppointment = () => {
    if (!validateForm()) {
      return;
    }

    // Add booking to state (mock - would be to database in real app)
    const newBooking = {
      id: `BK${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      contactNumber,
      age,
      sex,
      address,
      doctor: selectedDoctor,
      date: selectedDate,
      slot: selectedSlot,
      patientId,
      notes,
      status: 'pending_payment',
      fee: appointmentFee
    };

    // Simulate adding to database
    setBookings([...bookings, newBooking]);
    setMessage('Appointment added to queue successfully!');
    
    // Reset form
    resetForm();
  };

  // Validate form fields
  const validateForm = () => {
    if (!name || !contactNumber || !age || !sex || !selectedDoctor || !selectedDate || !selectedSlot) {
      setMessage('Please fill all required fields');
      return false;
    }
    
    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      setMessage('Please enter a valid 10-digit contact number');
      return false;
    }
    
    if (isNaN(age) || age <= 0 || age > 120) {
      setMessage('Please enter a valid age');
      return false;
    }
    
    return true;
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
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Generate booking ID
    const bookingId = `BK${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Generate UPI payment link
    const paymentLink = generateUPILink(bookingId, appointmentFee);
    
    // Simulate SMS service
    setTimeout(() => {
      console.log(`SMS sent to +91${contactNumber} with payment link: ${paymentLink}`);
      
      // Create shortened link for display purposes
      const shortenedLink = `shorturl.at/${Math.random().toString(36).substring(2, 6)}`;
      
      setMessage(`Payment link sent to +91${contactNumber}. Please complete payment to confirm your appointment.`);
      setIsLoading(false);
      
      // Add booking with payment status
      const newBooking = {
        id: bookingId,
        name,
        contactNumber,
        age,
        sex,
        address,
        doctor: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
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
    setName('');
    setContactNumber('');
    setAge('');
    setSex('');
    setAddress('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedSlot('');
    setNotes('');
    setPatientId('');
    setAvailableSlots([]);
  };

  // Mock fetch bookings (in real app, would fetch from database)
  useEffect(() => {
    // Simulate fetching existing bookings
    const mockBookings = [
      { 
        id: 'BK10001',
        name: 'Priya Patel',
        contactNumber: '8765432101',
        age: '28',
        sex: 'Female',
        address: '45 Green Park, Delhi',
        doctor: 'Dr. Khan (Pediatrics)',
        date: '2025-04-15', 
        slot: '10:00 AM', 
        status: 'confirmed',
        fee: 500
      },
      { 
        id: 'BK10002',
        name: 'Arun Kumar',
        contactNumber: '9876543212',
        age: '45',
        sex: 'Male',
        address: '78 Lake View, Mumbai',
        doctor: 'Dr. Sharma (Cardiology)', 
        date: '2025-04-16', 
        slot: '2:30 PM', 
        status: 'pending_payment',
        fee: 500
      }
    ];
    setBookings(mockBookings);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white">
      <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">Medical Appointment</h1>
      
      <div className="flex mb-4">
        <button 
          className={`flex-1 py-2 text-sm rounded-l-md ${!showBookings ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setShowBookings(false)}
        >
          Book Appointment
        </button>
        <button 
          className={`flex-1 py-2 text-sm rounded-r-md ${showBookings ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setShowBookings(true)}
        >
          My Bookings
        </button>
      </div>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
          {message}
        </div>
      )}
      
      {!showBookings ? (
        <div className="space-y-4">
          {/* Form Fields in the specified order */}
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Patient's full name"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Contact Number *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                  +91
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                  onBlur={fetchPatientInfo}
                  placeholder="10-digit mobile number"
                  className="flex-1 p-2 border border-gray-300 rounded-r-md text-sm"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Age *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Years"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  min="0"
                  max="120"
                  required
                />
              </div>
              
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Sex *</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Patient's address"
                className="w-full p-2 border border-gray-300 rounded-md text-sm h-16"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Select Doctor *</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                required
              >
                <option value="">Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Appointment Date *</label>
              <input
                type="date"
                min={minDate}
                max={maxDateString}
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Select Time Slot *</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 border rounded-md text-xs ${
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
              <label className="block text-gray-700 text-sm font-medium mb-1">Notes for Doctor</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Symptoms or concerns"
                className="w-full p-2 border border-gray-300 rounded-md text-sm h-16"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Consultation Fee</label>
              <div className="flex items-center bg-gray-50 p-2 rounded-md">
                <span className="text-green-700 font-medium">₹ {appointmentFee}</span>
                <span className="ml-2 text-xs text-gray-500">(Pay via UPI after booking)</span>
              </div>
            </div>
            
            {patientId && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700">Patient ID: {patientId}</p>
              </div>
            )}
          </div>
          
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={handleGeneratePayment}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
            >
              {isLoading ? 'Processing...' : 'Book & Pay Now'}
            </button>
            <button
              onClick={handleBookAppointment}
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 text-sm font-medium"
            >
              {isLoading ? 'Processing...' : 'Book Without Payment'}
            </button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <p className="text-xs text-yellow-700">
              <strong>Note:</strong> Payment link will be sent to above mobile number.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-lg text-center font-semibold mb-3">Appointments</h1>
          
          {bookings.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-md p-3 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{booking.doctor}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 
                       booking.status === 'pending_payment' ? 'Payment Pending' : 'Payment Link Sent'}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-600"> Patient's Name:</span>
                      <span>{booking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDateForDisplay(booking.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{booking.slot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span>₹{booking.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="text-xs">{booking.id}</span>
                    </div>
                  </div>
                  
                  {(booking.status === 'pending_payment' || booking.status === 'payment_sent') && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleRegeneratePayment(booking)}
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {booking.status === 'pending_payment' ? 'Pay Now' : 'Resend Payment Link'}
                      </button>
                      
                      {booking.paymentLink && (
                        <div className="mt-1 text-xs text-center text-gray-500">
                          Link: {booking.paymentLink}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}