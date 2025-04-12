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
  
  // New states for test booking functionality
  const [showTestBooking, setShowTestBooking] = useState(false);
  const [selectedPatientForTest, setSelectedPatientForTest] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testNotes, setTestNotes] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
    age: '',
    sex: '',
    doctor: '',
    date: '',
    slot: ''
  });

  // Constants for UPI payment
  const UPI_ID = "ajaychowdarys@ybl";
  
  // Calculate min and max dates for calendar
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Hospital details for header
  const hospitalDetails = {
    name: "City Medical Center",
    address: "123 Health Street, Bangalore - 560001",
    phone: "+91 80 12345678",
    email: "info@citymedical.com",
    logo: "/api/placeholder/200/70" // Placeholder for hospital logo
  };

  // Available doctors list
  const doctors = [
    { id: 1, name: 'Dr. Sharma (Cardiology)' },
    { id: 2, name: 'Dr. Patel (Orthopedics)' },
    { id: 3, name: 'Dr. Gupta (General Medicine)' },
    { id: 4, name: 'Dr. Khan (Pediatrics)' }
  ];

  // Available tests with pricing
  const availableTests = [
    { id: 1, name: 'Complete Blood Count (CBC)', price: 350, category: 'Blood Test' },
    { id: 2, name: 'Blood Sugar Fasting', price: 150, category: 'Blood Test' },
    { id: 3, name: 'Blood Sugar Post Prandial', price: 150, category: 'Blood Test' },
    { id: 4, name: 'HbA1c', price: 550, category: 'Blood Test' },
    { id: 5, name: 'Lipid Profile', price: 650, category: 'Blood Test' },
    { id: 6, name: 'Liver Function Test', price: 850, category: 'Blood Test' },
    { id: 7, name: 'Kidney Function Test', price: 850, category: 'Blood Test' },
    { id: 8, name: 'Thyroid Function Test', price: 750, category: 'Blood Test' },
    { id: 9, name: 'X-Ray Chest', price: 500, category: 'Radiology' },
    { id: 10, name: 'X-Ray Knee', price: 550, category: 'Radiology' },
    { id: 11, name: 'X-Ray Spine', price: 600, category: 'Radiology' },
    { id: 12, name: 'MRI Brain', price: 5000, category: 'Radiology' },
    { id: 13, name: 'MRI Knee', price: 5500, category: 'Radiology' },
    { id: 14, name: 'MRI Spine', price: 6000, category: 'Radiology' },
    { id: 15, name: 'CT Scan Brain', price: 3500, category: 'Radiology' },
    { id: 16, name: 'CT Scan Chest', price: 4000, category: 'Radiology' },
    { id: 17, name: 'Ultrasound Abdomen', price: 1200, category: 'Radiology' },
    { id: 18, name: 'ECG', price: 300, category: 'Cardiology' },
    { id: 19, name: 'ECHO', price: 2200, category: 'Cardiology' },
    { id: 20, name: 'Stress Test', price: 2500, category: 'Cardiology' }
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
    // Clear date error when a date is selected
    setErrors({...errors, date: ''});
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
      // Clear contact number error when valid
      setErrors({...errors, contactNumber: ''});
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
    } else if (contactNumber.length > 0) {
      setErrors({...errors, contactNumber: 'Please enter a valid 10-digit number'});
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

  // Handle input changes and clear errors
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value) {
      setErrors({...errors, name: ''});
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setContactNumber(value);
    if (value.length === 10) {
      setErrors({...errors, contactNumber: ''});
    }
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
    if (!isNaN(e.target.value) && e.target.value > 0 && e.target.value <= 120) {
      setErrors({...errors, age: ''});
    }
  };

  const handleSexChange = (e) => {
    setSex(e.target.value);
    if (e.target.value) {
      setErrors({...errors, sex: ''});
    }
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    if (e.target.value) {
      setErrors({...errors, doctor: ''});
    }
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setErrors({...errors, slot: ''});
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      name: '',
      contactNumber: '',
      age: '',
      sex: '',
      doctor: '',
      date: '',
      slot: ''
    };
    
    let isValid = true;
    
    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit number';
      isValid = false;
    }
    
    if (!age) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(age) || age <= 0 || age > 120) {
      newErrors.age = 'Please enter a valid age';
      isValid = false;
    }
    
    if (!sex) {
      newErrors.sex = 'Please select sex';
      isValid = false;
    }
    
    if (!selectedDoctor) {
      newErrors.doctor = 'Please select a doctor';
      isValid = false;
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
      isValid = false;
    }
    
    if (!selectedSlot) {
      newErrors.slot = 'Please select a time slot';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Generate UPI payment link
  const generateUPILink = (referenceId, amount) => {
    // Create UPI payment link with parameters
    const paymentDescription = `${referenceId}`;
    
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
    setErrors({
      name: '',
      contactNumber: '',
      age: '',
      sex: '',
      doctor: '',
      date: '',
      slot: ''
    });
  };

  // Handle test toggle
  const handleTestToggle = (testId) => {
    const testExists = selectedTests.find(test => test.id === testId);
    if (testExists) {
      setSelectedTests(selectedTests.filter(test => test.id !== testId));
    } else {
      const testToAdd = availableTests.find(test => test.id === testId);
      setSelectedTests([...selectedTests, testToAdd]);
    }
  };

  // Calculate total test amount
  const calculateTotalTestAmount = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  // Handle booking tests
  const handleBookTests = () => {
    if (!selectedPatientForTest) {
      setMessage('Please select a patient first');
      return;
    }

    if (selectedTests.length === 0) {
      setMessage('Please select at least one test');
      return;
    }

    setIsLoading(true);

    // Generate test booking ID
    const testBookingId = `TB${Math.floor(10000 + Math.random() * 90000)}`;
    const testDate = new Date();
    const formattedDate = testDate.toISOString().split('T')[0];
    
    // Create test booking object
    const testBooking = {
      id: testBookingId,
      patientId: selectedPatientForTest.patientId || `PT${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: selectedPatientForTest.name,
      contactNumber: selectedPatientForTest.contactNumber,
      age: selectedPatientForTest.age,
      sex: selectedPatientForTest.sex,
      address: selectedPatientForTest.address,
      tests: selectedTests,
      totalAmount: calculateTotalTestAmount(),
      bookingDate: formattedDate,
      notes: testNotes,
      status: 'booked',
      type: 'test'
    };

    // Generate PDF data
    const pdfPreviewData = {
      ...testBooking,
      hospitalDetails,
      invoiceDate: new Date().toLocaleDateString(),
      invoiceTime: new Date().toLocaleTimeString()
    };
    
    setPdfData(pdfPreviewData);
    setShowPdfPreview(true);
    setIsLoading(false);
  };

  // Handle test payment link generation
  const handleGenerateTestPayment = () => {
    if (!pdfData) return;
    
    setIsLoading(true);
    
    const paymentLink = generateUPILink(pdfData.id, pdfData.totalAmount);
    const shortenedLink = `shorturl.at/${Math.random().toString(36).substring(2, 6)}`;
    
    setTimeout(() => {
      console.log(`SMS sent to +91${pdfData.contactNumber} with payment link: ${paymentLink}`);
      
      // Add test booking with payment link
      const updatedPdfData = {
        ...pdfData,
        paymentLink: shortenedLink,
        status: 'payment_sent'
      };
      
      setPdfData(updatedPdfData);
      setMessage(`Payment link sent to +91${pdfData.contactNumber}`);
      setIsLoading(false);
    }, 1500);
  };

  // Print PDF
  const handlePrintPdf = () => {
    if (!pdfData) return;
    
    // In a real application, this would trigger a PDF download or print
    console.log('Printing PDF:', pdfData);
    
    // Mock print behavior
    setMessage('PDF prepared for printing. Check downloads.');
    
    // In production, this would use a PDF library like jsPDF or a server-side PDF generation
    setTimeout(() => {
      // After "printing", navigate back to bookings
      setShowPdfPreview(false);
      setShowTestBooking(false);
      setSelectedTests([]);
      setTestNotes('');
      setSelectedPatientForTest(null);
      setPdfData(null);
    }, 2000);
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
        fee: 500,
        patientId: 'PT20001'
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
        fee: 500,
        patientId: 'PT20002'
      }
    ];
    setBookings(mockBookings);
  }, []);

  // Start test booking for a specific patient
  const handleStartTestBooking = (patient) => {
    setSelectedPatientForTest(patient);
    setShowTestBooking(true);
  };

  // Group tests by category
  const groupedTests = availableTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {});

  return (
    <div className="max-w-md mx-auto p-4 bg-white">
      <h1 className="text-xl font-bold mb-4 text-blue-700 text-center">Medical Appointment</h1>
      
      {!showTestBooking && !showPdfPreview && (
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
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
          {message}
        </div>
      )}
      
      {showPdfPreview && pdfData && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => {
                setShowPdfPreview(false);
                setShowTestBooking(true);
              }}
              className="text-blue-600 text-sm"
            >
              ← Back
            </button>
            <h2 className="text-lg font-bold">Test Invoice Preview</h2>
          </div>
          
          {/* PDF Preview */}
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            {/* Hospital Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <img src={hospitalDetails.logo} alt="Hospital Logo" className="h-12 mb-2" />
                <h2 className="font-bold text-lg text-blue-700">{hospitalDetails.name}</h2>
                <p className="text-xs text-gray-600">{hospitalDetails.address}</p>
                <p className="text-xs text-gray-600">{hospitalDetails.phone} | {hospitalDetails.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">Invoice #: {pdfData.id}</p>
                <p className="text-xs text-gray-600">Date: {pdfData.invoiceDate}</p>
                <p className="text-xs text-gray-600">Time: {pdfData.invoiceTime}</p>
              </div>
            </div>
            
            {/* Patient Details */}
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-medium text-sm mb-2">Patient Details:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p><span className="font-medium">Name:</span> {pdfData.patientName}</p>
                <p><span className="font-medium">Patient ID:</span> {pdfData.patientId}</p>
                <p><span className="font-medium">Age/Sex:</span> {pdfData.age} / {pdfData.sex}</p>
                <p><span className="font-medium">Contact:</span> +91 {pdfData.contactNumber}</p>
              </div>
            </div>
            
            {/* Tests List */}
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Tests Ordered:</h3>
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-1 text-left pl-2">Test Name</th>
                    <th className="py-1 text-center">Category</th>
                    <th className="py-1 text-right pr-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfData.tests.map((test) => (
                    <tr key={test.id} className="border-b">
                      <td className="py-1 pl-2">{test.name}</td>
                      <td className="py-1 text-center">{test.category}</td>
                      <td className="py-1 text-right pr-2">₹{test.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-medium">
                  <tr>
                    <td className="pt-2" colSpan="2">Total Amount</td>
                    <td className="pt-2 text-right pr-2">₹{pdfData.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Notes */}
            {pdfData.notes && (
              <div className="mb-4 text-xs">
                <h3 className="font-medium text-sm mb-1">Notes:</h3>
                <p className="bg-gray-50 p-2 rounded-md">{pdfData.notes}</p>
              </div>
            )}
            
            {/* Payment Status */}
            <div className="mb-4 text-xs border-t pt-4">
              <p className="font-medium">Payment Status: 
                <span className={`ml-2 px-2 py-1 rounded ${pdfData.status === 'payment_sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {pdfData.status === 'payment_sent' ? 'Payment Link Sent' : 'Pending Payment'}
                </span>
              </p>
              {pdfData.paymentLink && (
                <p className="mt-1">Payment Link: {pdfData.paymentLink}</p>
              )}
            </div>
            
            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
              <p>This is a computer-generated document. No signature required.</p>
              <p>For any queries, please contact {hospitalDetails.phone}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {pdfData.status !== 'payment_sent' && (
              <button 
                onClick={handleGenerateTestPayment}
                disabled={isLoading}
                className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Generate Payment Link'}
              </button>
            )}
            <button 
              onClick={handlePrintPdf}
              disabled={isLoading}
              className="flex-1 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Print Invoice'}
            </button>
          </div>
        </div>
      )}
      
      {showTestBooking && !showPdfPreview && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setShowTestBooking(false)}
              className="text-blue-600 text-sm"
            >
              ← Back to Bookings
            </button>
            <h2 className="text-lg font-bold">Book Tests</h2>
          </div>
          
          {/* Patient Info */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h3 className="font-medium text-sm mb-2">Patient Details:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p><span className="font-medium">Name:</span> {selectedPatientForTest.name}</p>
              <p><span className="font-medium">ID:</span> {selectedPatientForTest.patientId || 'New Patient'}</p>
              <p><span className="font-medium">Age/Sex:</span> {selectedPatientForTest.age} / {selectedPatientForTest.sex}</p>
              <p><span className="font-medium">Contact:</span> {selectedPatientForTest.contactNumber}</p>
            </div>
          </div>
          
          {/* Test Selection */}
          <div className="border border-gray-200 rounded-md p-3">
            <h3 className="font-medium text-sm mb-3">Select Tests:</h3>
            
            {/* Tests by Category */}
            <div className="space-y-4">
              {Object.keys(groupedTests).map(category => (
                <div key={category}>
                  <h4 className="text-sm font-medium mb-2 text-blue-700">{category}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {groupedTests[category].map(test => (
                      <div 
                        key={test.id} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100"
                      >
                        <label className="flex items-center space-x-2 text-sm">
                          <input 
                            type="checkbox"
                            checked={selectedTests.some(t => t.id === test.id)}
                            onChange={() => handleTestToggle(test.id)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>{test.name}</span>
                        </label>
                        <span className="text-sm font-medium">₹{test.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
{/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-blue-800">Selected Tests ({selectedTests.length})</h3>
                  <button 
                    onClick={() => setSelectedTests([])} 
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="mt-2 space-y-2">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{test.name}</span>
                        <span className="ml-2 text-sm text-gray-600">({test.category})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-sm font-medium">₹{test.price}</span>
                        <button
                          onClick={() => handleTestToggle(test.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-2 border-t border-blue-100 flex justify-between items-center">
                  <div className="font-medium">
                    Total Amount: <span className="text-blue-700">₹{calculateTotalTestAmount()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Additional Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Additional Notes:</label>
              <textarea
                value={testNotes}
                onChange={(e) => setTestNotes(e.target.value)}
                placeholder="Any specific instructions or notes for the tests"
                className="w-full border border-gray-300 rounded-md p-2 text-sm h-20"
              ></textarea>
            </div>
            
            {/* Booking Button */}
            <div className="mt-4">
              <button
                onClick={handleBookTests}
                disabled={isLoading || selectedTests.length === 0}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : `Book Tests (₹${calculateTotalTestAmount()})`}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!showTestBooking && !showPdfPreview && !showBookings && (
        /* Appointment Booking Form */
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="font-medium text-blue-700">Patient Information</h2>
            
            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number*</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 border border-r-0 border-gray-300 rounded-l-md text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={handleContactChange}
                  onBlur={fetchPatientInfo}
                  maxLength={10}
                  placeholder="10 digit mobile number"
                  className="flex-1 border border-gray-300 rounded-r-md p-2 text-sm"
                />
              </div>
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
            </div>
            
            {isLoading ? (
              <div className="text-center p-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500 border-r-2 border-blue-500 border-b-2 border-blue-500 border-l-2 border-gray-200"></div>
                <p className="text-sm text-gray-500 mt-2">Fetching patient details...</p>
              </div>
            ) : (
              <>
                {/* Patient ID */}
                {patientId && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient ID</label>
                    <input
                      type="text"
                      value={patientId}
                      disabled
                      className="w-full border border-gray-200 bg-gray-50 rounded-md p-2 text-sm"
                    />
                  </div>
                )}
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name*</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter patient name"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                {/* Age & Sex */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age*</label>
                    <input
                      type="number"
                      value={age}
                      onChange={handleAgeChange}
                      placeholder="Age"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sex*</label>
                    <select
                      value={sex}
                      onChange={handleSexChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Patient address"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm h-20"
                  ></textarea>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-3">
            <h2 className="font-medium text-blue-700">Appointment Details</h2>
            
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Doctor*</label>
              <select
                value={selectedDoctor}
                onChange={handleDoctorChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
              {errors.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>}
            </div>
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Date*</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDateString}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            {/* Time Slot Selection */}
            {selectedDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Time Slot*</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelection(slot)}
                      className={`p-2 text-xs rounded-md ${selectedSlot === slot ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.slot && <p className="text-red-500 text-xs mt-1">{errors.slot}</p>}
              </div>
            )}
            
            {/* Appointment Fee */}
            <div>
              <label className="block text-sm font-medium mb-1">Appointment Fee</label>
              <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 p-2">
                <span className="text-gray-500 mr-1">₹</span>
                <input
                  type="number"
                  value={appointmentFee}
                  onChange={(e) => setAppointmentFee(Number(e.target.value))}
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>
            
            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes"
                className="w-full border border-gray-300 rounded-md p-2 text-sm h-20"
              ></textarea>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleGeneratePayment}
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Book & Send Payment Link'}
            </button>
            <button
              onClick={handleBookAppointment}
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              {isLoading ? 'Processing...' : 'Book Only (Without Payment)'}
            </button>
          </div>
        </div>
      )}
      
      {!showTestBooking && !showPdfPreview && showBookings && (
        <div className="space-y-4">
          <h2 className="font-medium text-blue-700">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">No bookings found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-md p-3 bg-white">
                  {/* Booking Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xs text-gray-500">ID: {booking.id}</span>
                      <h3 className="font-medium">{booking.name}</h3>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 
                       booking.status === 'pending_payment' ? 'Payment Pending' : 
                       'Payment Sent'}
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <p><span className="text-gray-500">Doctor:</span> {booking.doctor}</p>
                    <p><span className="text-gray-500">Fee:</span> ₹{booking.fee}</p>
                    <p><span className="text-gray-500">Date:</span> {formatDateForDisplay(booking.date)}</p>
                    <p><span className="text-gray-500">Time:</span> {booking.slot}</p>
                  </div>
                  
                  {/* Booking Actions */}
                  <div className="flex justify-between border-t pt-2">
                    {booking.status === 'pending_payment' ? (
                      <button
                        onClick={() => handleRegeneratePayment(booking)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Generate Payment Link
                      </button>
                    ) : booking.status === 'payment_sent' ? (
                      <div className="text-sm text-gray-600">
                        Link: {booking.paymentLink}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Appointment Confirmed
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleStartTestBooking(booking)}
                      className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                    >
                      Book Tests
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}