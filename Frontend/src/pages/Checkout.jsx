import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import { ShieldCheck, Truck, RotateCcw, Award, Check, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect to products if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Please select items first.');
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Page States: 'gate' (Image 1 selection) or 'form' (Image 2 form steps)
  const [checkoutFlow, setCheckoutFlow] = useState('gate');
  const [isGuestFlow, setIsGuestFlow] = useState(false);

  // If user is already logged in, skip the gate
  useEffect(() => {
    if (user) {
      setCheckoutFlow('form');
    } else {
      if (!isGuestFlow) {
        setCheckoutFlow('gate');
      }
    }
  }, [user, isGuestFlow]);

  // Login form state (Gate existing customer)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Steps indicator: 1 (Contact), 2 (Delivery Dates), 3 (Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields State
  const [title, setTitle] = useState(''); // Miss, Mr, Mrs, Ms
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  
  // Deliver to different address state
  const [differentAddress, setDifferentAddress] = useState(false);
  const [diffTitle, setDiffTitle] = useState('');
  const [diffFirstName, setDiffFirstName] = useState('');
  const [diffSurname, setDiffSurname] = useState('');
  const [diffPhone, setDiffPhone] = useState('');
  const [diffAddressLine, setDiffAddressLine] = useState('');
  const [diffCity, setDiffCity] = useState('');
  const [diffPostcode, setDiffPostcode] = useState('');

  // Save account & newsletters state
  const [createAccount, setCreateAccount] = useState(false);
  const [newsletter, setNewsletter] = useState(''); // Yes or No

  // Dynamic Delivery Dates Options (today + 9 days to today + 13 days)
  const getDynamicDeliveryOptions = () => {
    const options = [];
    const descs = [
      'Complimentary Premium White-Glove Home Assembly',
      'Complimentary Premium Weekend Delivery Slot',
      'Complimentary Premium White-Glove Fitting',
      'Complimentary Room of Choice White-Glove Delivery',
      'Complimentary Direct Concierge White-Glove Delivery'
    ];
    
    for (let i = 0; i < 5; i++) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 9 + i);
      
      const dateString = deliveryDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      
      options.push({
        id: `date-${i}`,
        date: dateString,
        desc: descs[i % descs.length]
      });
    }
    return options;
  };

  const deliveryOptions = getDynamicDeliveryOptions();
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');

  // Set default email if user is logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      const names = user.name ? user.name.split(' ') : [];
      if (names.length > 0) setFirstName(names[0]);
      if (names.length > 1) setSurname(names.slice(1).join(' '));
    }
  }, [user]);

  // Automatically select first delivery date option
  useEffect(() => {
    if (!selectedDeliveryDate && deliveryOptions.length > 0) {
      setSelectedDeliveryDate(deliveryOptions[0].date);
    }
  }, [selectedDeliveryDate, deliveryOptions]);

  const handleGateLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please input email and password.');
      return;
    }
    try {
      setLoginLoading(true);
      const success = await login(loginEmail, loginPassword);
      if (success) {
        setCheckoutFlow('form');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!firstName || !surname || !email || !phone || !addressLine || !postcode) {
      toast.error('Please fill in all required address fields.');
      return;
    }
    if (differentAddress && (!diffFirstName || !diffSurname || !diffAddressLine || !diffPostcode)) {
      toast.error('Please fill in all delivery address fields.');
      return;
    }
    // Advance to Step 2
    setCurrentStep(2);
  };

  const handleStep2Submit = () => {
    setCurrentStep(3);
  };

  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePaymentSubmit = async () => {
    try {
      setPaymentLoading(true);

      const itemsPayload = cartItems.map(item => ({
        product: item.product,
        title: item.title,
        image: item.image,
        variant: item.variant,
        material: item.material,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      }));

      const finalAddress = differentAddress ? {
        fullName: `${diffTitle ? diffTitle + ' ' : ''}${diffFirstName} ${diffSurname}`.trim(),
        phone: diffPhone || phone,
        address: `${diffAddressLine}`,
        city: diffCity,
        postalCode: diffPostcode,
        country: 'GB'
      } : {
        fullName: `${title ? title + ' ' : ''}${firstName} ${surname}`.trim(),
        phone,
        address: `${addressLine}`,
        city,
        postalCode: postcode,
        country: 'GB'
      };

      const payload = {
        items: itemsPayload,
        shippingAddress: finalAddress,
        email,
        createAccount,
        deliveryDate: selectedDeliveryDate
      };

      const { data } = await API.post('/api/order/createOrderAndSession', payload);

      if (data.url) {
        // Save order info locally to clean guest cart on land
        localStorage.setItem('pending_guest_order_id', data.orderId);
        window.location.href = data.url;
      } else {
        toast.error('Stripe redirect URL not found.');
      }

    } catch (error) {
      console.error('Payment redirect error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // handled by useEffect
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-24 lg:pt-36">
      
      {/* Branded Trustpilot Mini Header */}
      <div className="border-b border-gray-100 bg-white py-4 px-6 md:px-12 flex justify-between items-center text-xs font-semibold text-gray-500">
        <Link to="/" className="text-xl font-serif font-black tracking-widest text-slate-900 hover:text-green-700 transition-colors">
          ELITESEATING <span className="text-sm font-sans font-light tracking-widest block md:inline text-slate-400">LTD</span>
        </Link>
        <div className="flex items-center gap-2">
          <span>Excellent 4.6 out of 5</span>
          <span className="text-green-500 font-extrabold flex items-center">★ Trustpilot</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* State 1: Gate (Sign In / Guest checkout gate) */}
        {checkoutFlow === 'gate' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            
            {/* Header Title Block */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Secure checkout</h1>
              <div className="h-0.5 w-16 bg-red-500 mx-auto mb-6" />
              
              {/* Payment Card Icons */}
              <div className="flex justify-center gap-3 opacity-80 mb-8">
                <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
                <img src="https://img.icons8.com/color/48/000000/maestro.png" className="h-6" alt="Maestro" />
                <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-6" alt="PayPal" />
              </div>
            </div>

            {/* Split Gateway View */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-12 items-center bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
              
              {/* Guest Side */}
              <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left h-full">
                <h2 className="text-2xl font-serif text-slate-800 font-black mb-6">New customer</h2>
                <button
                  onClick={() => {
                    setIsGuestFlow(true);
                    setCheckoutFlow('form');
                  }}
                  className="w-full py-4 px-6 bg-[#51823F] hover:bg-[#457036] text-white font-bold rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Continue as guest
                </button>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed italic">
                  You can register your account later on completion.
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="md:col-span-1 flex md:flex-col justify-center items-center h-full relative py-4 md:py-0">
                <div className="w-full md:w-[1px] h-[1px] md:h-32 bg-slate-200" />
                <span className="bg-slate-50 border border-slate-200 text-xs text-slate-400 font-extrabold px-3 py-1.5 rounded-full absolute">or</span>
              </div>

              {/* Member Sign In Side */}
              <form onSubmit={handleGateLogin} className="md:col-span-5 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-serif text-slate-800 font-black mb-6">Existing customer</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="sr-only">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 bg-[#51823F] hover:bg-[#457036] text-white font-bold rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loginLoading ? 'Signing In...' : 'Sign in'}
                </button>
              </form>

            </div>

            {/* Back to Cart Action */}
            <div className="mt-8 text-center">
              <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return to basket
              </Link>
            </div>

          </div>
        )}

        {/* State 2: Step-by-Step Checkout Form (Image 2) */}
        {checkoutFlow === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
            
            {/* Left Column: Form & Steps */}
            <div className="lg:col-span-8 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 md:p-10">
              
              {/* Back to basket */}
              <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
                <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">
                  ‹ Return to basket
                </Link>
                <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                  {user ? 'Member Checkout' : 'Guest Checkout'}
                </span>
              </div>

              {/* Secure Checkout Header with Card Icons */}
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-serif text-slate-900 mb-2">Secure checkout</h1>
                <div className="h-[1px] w-12 bg-red-400 mx-auto mb-4" />
                <div className="flex justify-center gap-2 opacity-75 mb-6">
                  <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5" alt="Visa" />
                  <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-5" alt="Mastercard" />
                  <img src="https://img.icons8.com/color/48/000000/maestro.png" className="h-5" alt="Maestro" />
                  <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-5" alt="PayPal" />
                </div>

                {/* Progress Steps Indicator */}
                <div className="flex justify-between items-center max-w-md mx-auto relative px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {/* Connecting Line */}
                  <div className="absolute top-2.5 left-0 right-0 h-[2px] bg-slate-100 -z-10" />
                  
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
                    </span>
                    <span className={currentStep === 1 ? 'text-[#51823F] font-extrabold' : ''}>Contact details</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
                    </span>
                    <span className={currentStep === 2 ? 'text-[#51823F] font-extrabold' : ''}>Select delivery dates</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                      3
                    </span>
                    <span className={currentStep === 3 ? 'text-[#51823F] font-extrabold' : ''}>Payment</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-1 bg-white px-2 opacity-50">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span>Confirmation</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Billing and Delivery Address */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-8 animate-fade-in-up">
                  
                  {/* Address Section Title */}
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    1. Billing and delivery address
                  </h3>

                  {/* Title Select Checkboxes */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</p>
                    <div className="flex gap-4 text-xs font-semibold">
                      {['Miss', 'Mr', 'Mrs', 'Ms'].map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={title === t}
                            onChange={() => setTitle(title === t ? '' : t)}
                            className="rounded text-green-600 focus:ring-green-500"
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name and Contact Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Contact number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* Address Postcode Fields */}
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Start typing your address or street"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Postcode"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deliver to different address toggle */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={differentAddress}
                        onChange={() => setDifferentAddress(!differentAddress)}
                        className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                      />
                      Deliver to a different address
                    </label>
                  </div>

                  {/* Conditional Different Address Fields */}
                  {differentAddress && (
                    <div className="space-y-6 pt-4 border-t border-dashed border-slate-200 animate-fade-in-up">
                      <p className="text-sm font-bold text-slate-500">Shipping Address Details</p>
                      
                      <div className="flex gap-4 text-xs font-semibold">
                        {['Miss', 'Mr', 'Mrs', 'Ms'].map((t) => (
                          <label key={`diff-${t}`} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={diffTitle === t}
                              onChange={() => setDiffTitle(diffTitle === t ? '' : t)}
                              className="rounded text-green-600 focus:ring-green-500"
                            />
                            {t}
                          </label>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          required
                          placeholder="Shipping First name"
                          value={diffFirstName}
                          onChange={(e) => setDiffFirstName(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Shipping Surname"
                          value={diffSurname}
                          onChange={(e) => setDiffSurname(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="tel"
                          placeholder="Shipping Contact number (Optional)"
                          value={diffPhone}
                          onChange={(e) => setDiffPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Shipping Address Line"
                          value={diffAddressLine}
                          onChange={(e) => setDiffAddressLine(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Shipping City"
                          value={diffCity}
                          onChange={(e) => setDiffCity(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Shipping Postcode"
                          value={diffPostcode}
                          onChange={(e) => setDiffPostcode(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Create account & newsletter checkboxes */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 text-sm">
                    
                    {!user && (
                      <label className="flex items-start gap-3 cursor-pointer font-medium text-slate-600">
                        <input
                          type="checkbox"
                          checked={createAccount}
                          onChange={() => setCreateAccount(!createAccount)}
                          className="rounded text-green-600 focus:ring-green-500 w-4 h-4 mt-0.5 shrink-0"
                        />
                        <span>Create an account to save your details</span>
                      </label>
                    )}
                  </div>

                  {/* T&Cs, Privacy Note & Button */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      By clicking continue you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms and Conditions</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
                    </p>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-10 py-4 bg-[#51823F] hover:bg-[#457036] text-white font-extrabold uppercase tracking-widest text-xs rounded shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
                    >
                      Continue
                    </button>
                  </div>

                </form>
              )}

              {/* Step 2: Select Delivery Dates */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in-up">
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    2. Select delivery dates
                  </h3>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Please select your preferred complimentary white-glove home assembly slot from our available artisan logistics schedule.
                  </p>

                  {/* Date Cards */}
                  <div className="space-y-4">
                    {deliveryOptions.map((opt) => {
                      const isSelected = selectedDeliveryDate === opt.date;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDeliveryDate(opt.date)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#51823F] bg-green-50/20' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-serif font-bold text-slate-900">{opt.date}</p>
                              <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#51823F] bg-[#51823F] text-white' : 'border-slate-300'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Back & Next Actions */}
                  <div className="pt-8 border-t border-slate-100 flex gap-4 justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest rounded hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleStep2Submit}
                      className="px-10 py-3 bg-[#51823F] hover:bg-[#457036] text-white font-extrabold uppercase tracking-widest text-xs rounded shadow-md hover:shadow-lg transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in-up">
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    3. Payment
                  </h3>

                  {/* Review Information Card */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 text-sm leading-relaxed">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Review details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-500 block">Name:</span>
                        <span className="font-medium text-slate-800">{firstName} {surname}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block">Email:</span>
                        <span className="font-medium text-slate-800">{email}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-bold text-slate-500 block">Delivery Address:</span>
                        <span className="font-medium text-slate-800">{differentAddress ? diffAddressLine : addressLine}, {differentAddress ? diffCity : city}, {differentAddress ? diffPostcode : postcode}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-bold text-slate-500 block">Artisanal Delivery:</span>
                        <span className="font-medium text-[#51823F] font-bold">{selectedDeliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment Info & Trigger */}
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your transaction is fully encrypted. Clicking the button below will securely initialize your card portal via Stripe Checkout to complete the secure payment.
                    </p>

                    <button
                      onClick={handlePaymentSubmit}
                      disabled={paymentLoading}
                      className="w-full py-5 bg-[#51823F] hover:bg-[#457036] text-white font-black uppercase tracking-[0.2em] text-sm rounded shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <CreditCard className="w-5 h-5" />
                      {paymentLoading ? 'Redirecting to Stripe Secure...' : 'Complete with Stripe'}
                    </button>
                  </div>

                  {/* Back Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest rounded hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary (Image 2 style) */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
              
              {/* Core Order Summary Card */}
              <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 md:p-8">
                
                {/* Heading */}
                <div className="flex justify-between items-baseline mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-serif text-slate-900 font-bold">
                    Order summary <span className="text-sm font-sans font-medium text-slate-400">({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  </h3>
                  <Link to="/cart" className="text-xs font-bold text-blue-600 hover:underline">‹ Amend</Link>
                </div>

                {/* Item List */}
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-1">
                  {cartItems.filter(item => item.product).map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      
                      {/* Thumbnail Image */}
                      <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                        <img src={item.image || 'https://placehold.co/100x100?text=Sofa'} className="w-full h-full object-cover" alt={item.title} />
                      </div>

                      {/* Details */}
                      <div className="flex-grow text-xs space-y-1">
                        <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight">{item.title}</h4>
                        <div className="flex gap-2 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                          <span>Qty {item.quantity}</span>
                          <span>•</span>
                          <span>{item.variant || 'Standard'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-green-700 text-[10px] font-black uppercase tracking-widest">
                          <Truck className="w-3.5 h-3.5 shrink-0" />
                          <span>In stock. Fast delivery.</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-slate-900">£{(Number(item.price) * item.quantity).toLocaleString()}</p>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Subtotals & Totals Block */}
                <div className="space-y-4 pt-4 border-t border-slate-100 text-sm">
                  
                  <div className="flex justify-between text-slate-500">
                    <span className="font-semibold">Order subtotal</span>
                    <span className="font-bold">£{cartTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span className="font-semibold">Delivery</span>
                    <span className="font-bold text-[#51823F]">Free</span>
                  </div>

                  <div className="h-[1px] bg-slate-100 w-full my-4" />

                  <div className="flex justify-between items-baseline text-slate-900">
                    <span className="text-lg font-serif font-black">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">£{cartTotal.toLocaleString()}</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Including VAT £0.00</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Brand Value Props List (Image 2 styles) */}
              <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4 text-xs font-bold text-slate-600 leading-none">
                
                <div className="flex items-center gap-3 py-1 cursor-pointer hover:text-slate-900">
                  <span className="text-green-600 text-base">✓</span>
                  <span>Delivery info ›</span>
                </div>

                <div className="flex items-center gap-3 py-1 cursor-pointer hover:text-slate-900">
                  <span className="text-green-600 text-base">✓</span>
                  <span>Free & easy returns ›</span>
                </div>

                <div className="flex items-center gap-3 py-1 cursor-pointer hover:text-slate-900">
                  <span className="text-green-600 text-base">✓</span>
                  <span>0% finance ›</span>
                </div>

                <div className="flex items-center gap-3 py-1 cursor-pointer hover:text-slate-900">
                  <span className="text-green-600 text-base">✓</span>
                  <span>Family owned British business ›</span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
