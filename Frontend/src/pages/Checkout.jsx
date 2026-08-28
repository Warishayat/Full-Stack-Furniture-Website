import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Check, ArrowLeft, ShieldCheck, Truck, Clock } from 'lucide-react';
import klarnaImg from '../assets/klarna.webp';
import payItMonthlyImg from '../assets/payitmonthly.webp';
import clearpayImg from '../assets/clearpayafterpay.webp';
import mastercardImg from '../assets/mastercard.webp';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect to products if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Please select items first.');
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Page Flow States: 'gate' or 'form'
  const [checkoutFlow, setCheckoutFlow] = useState('gate');
  const [isGuestFlow, setIsGuestFlow] = useState(false);

  useEffect(() => {
    if (user) {
      setCheckoutFlow('form');
    } else {
      if (!isGuestFlow) {
        setCheckoutFlow('gate');
      }
    }
  }, [user, isGuestFlow]);

  // Facebook Pixel / Analytics Tracking
  useEffect(() => {
    if (cartItems.length > 0 && window.fbq && !window.initiateCheckoutTracked) {
      window.fbq('track', 'InitiateCheckout', {
        value: cartTotal,
        currency: 'GBP',
        num_items: cartItems.length,
      });
      window.initiateCheckoutTracked = true;
    }
  }, [cartItems, cartTotal]);

  // Gate Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Form Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Customer & Address State
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  // Different Delivery Address State
  const [differentAddress, setDifferentAddress] = useState(false);
  const [diffTitle, setDiffTitle] = useState('');
  const [diffFirstName, setDiffFirstName] = useState('');
  const [diffSurname, setDiffSurname] = useState('');
  const [diffPhone, setDiffPhone] = useState('');
  const [diffAddressLine, setDiffAddressLine] = useState('');
  const [diffCity, setDiffCity] = useState('');
  const [diffPostcode, setDiffPostcode] = useState('');

  // Account creation options for guest flow
  const [createAccount, setCreateAccount] = useState(false);
  const [checkoutPassword, setCheckoutPassword] = useState('');

  // Dynamic Delivery Dates Generation
  const getDynamicDeliveryOptions = () => {
    const options = [];
    const descs = [
      'Complimentary Premium White-Glove Home Assembly',
      'Complimentary Premium Weekend Delivery Slot',
      'Complimentary Premium White-Glove Fitting',
      'Complimentary Room of Choice White-Glove Delivery',
      'Complimentary Direct Concierge White-Glove Delivery',
    ];

    for (let i = 0; i < 5; i++) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 9 + i);

      const dateString = deliveryDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      options.push({
        id: `date-${i}`,
        date: dateString,
        desc: descs[i % descs.length],
      });
    }
    return options;
  };

  const deliveryOptions = getDynamicDeliveryOptions();
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [assemblyService, setAssemblyService] = useState(false);

  // Populate user info if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      const names = user.name ? user.name.split(' ') : [];
      if (names.length > 0) setFirstName(names[0]);
      if (names.length > 1) setSurname(names.slice(1).join(' '));
    }
  }, [user]);

  // Set default selected delivery date
  useEffect(() => {
    if (!selectedDeliveryDate && deliveryOptions.length > 0) {
      setSelectedDeliveryDate(deliveryOptions[0].date);
    }
  }, [selectedDeliveryDate, deliveryOptions]);

  // Existing Customer Login Handler
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

  // Step 1 Validation
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
    if (createAccount && !checkoutPassword) {
      toast.error('Please enter a password for your new account.');
      return;
    }
    setCurrentStep(2);
  };

  // Payment Submit Handler
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePaymentSubmit = async () => {
    try {
      setPaymentLoading(true);

      const itemsPayload = cartItems.map((item) => ({
        product: item.product || item._id,
        title: item.title,
        image: item.image,
        variant: item.variant || '',
        material: item.material || '',
        color: item.color || '',
        leg: item.leg || '',
        firmness: item.firmness || '',
        footstool: item.footstool || '',
        coffeeTable: item.coffeeTable || '',
        quantity: item.quantity,
        price: item.price,
      }));

      const finalAddress = differentAddress
        ? {
          fullName: `${diffTitle ? diffTitle + ' ' : ''}${diffFirstName} ${diffSurname}`.trim(),
          phone: diffPhone || phone,
          address: diffAddressLine,
          city: diffCity,
          postalCode: diffPostcode,
          country: 'GB',
        }
        : {
          fullName: `${title ? title + ' ' : ''}${firstName} ${surname}`.trim(),
          phone,
          address: addressLine,
          city,
          postalCode: postcode,
          country: 'GB',
        };

      const payload = {
        items: itemsPayload,
        lineItems: itemsPayload,
        shippingAddress: finalAddress,
        email,
        createAccount: user ? false : createAccount,
        password: checkoutPassword,
        deliveryDate: selectedDeliveryDate,
        paymentMethodType: paymentMethod,
        assemblyService,
      };

      const endpoint =
        paymentMethod === 'PayItMonthly'
          ? '/api/order/createPayItMonthlyCheckout'
          : '/api/order/createOrderAndSession';

      const { data } = await API.post(endpoint, payload);

      if (data.url) {
        if (data.orderId) {
          localStorage.setItem('pending_guest_order_id', data.orderId);
        }
        if (data.url.startsWith('/')) {
          navigate(data.url);
        } else {
          window.location.href = data.url;
        }
      } else {
        toast.error('Payment redirect URL not found.');
      }
    } catch (error) {
      console.error('Payment redirect error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to initialize payment process.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-24 lg:pt-36 font-sans">
      {/* Header Banner */}
      <div className="border-b border-slate-100 bg-white py-4 px-6 md:px-12 flex flex-col justify-center items-center text-xs font-semibold text-slate-500 gap-2">
        <Link
          to="/"
          className="text-2xl font-serif font-medium tracking-widest text-slate-900 hover:text-green-700 transition-colors"
        >
          EliteSeating <span className="text-sm font-sans font-light tracking-widest text-slate-400">LTD</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Flow 1: Customer Gate */}
        {checkoutFlow === 'gate' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Secure checkout</h1>
              <div className="h-0.5 w-16 bg-red-500 mx-auto mb-6" />
              <div className="flex justify-center items-center gap-4 opacity-80 mb-8">
                <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                <img src={mastercardImg} className="h-6" alt="Mastercard" />
                <img src="https://img.icons8.com/color/48/000000/maestro.png" className="h-6" alt="Maestro" />
                <img src={klarnaImg} className="h-5" alt="Klarna" />
                <img src={clearpayImg} className="h-5" alt="Clearpay" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-8 items-center bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
              {/* Guest Side */}
              <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left h-full">
                <h2 className="text-2xl font-serif text-slate-800 font-black mb-6">New customer</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsGuestFlow(true);
                    setCheckoutFlow('form');
                  }}
                  className="w-full py-4 px-6 bg-[#51823F] hover:bg-[#457036] text-white font-bold rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Continue as guest
                </button>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  You can register your account later upon order completion.
                </p>
              </div>

              {/* Divider */}
              <div className="md:col-span-1 flex md:flex-col justify-center items-center h-full relative py-4 md:py-0">
                <div className="w-full md:w-[1px] h-[1px] md:h-32 bg-slate-200" />
                <span className="bg-slate-50 border border-slate-200 text-xs text-slate-400 font-extrabold px-3 py-1.5 rounded-full absolute">
                  or
                </span>
              </div>

              {/* Existing Customer Side */}
              <form onSubmit={handleGateLogin} className="md:col-span-5 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-serif text-slate-800 font-black mb-6">Existing customer</h2>
                <div className="space-y-4 mb-6">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm transition-all"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 text-sm transition-all"
                  />
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

            <div className="mt-8 text-center">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Return to basket
              </Link>
            </div>
          </div>
        )}

        {/* Flow 2: Multi-step Checkout Form */}
        {checkoutFlow === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
            {/* Left Steps Column */}
            <div className="lg:col-span-8 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 md:p-10">
              <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
                >
                  ‹ Return to basket
                </Link>
                <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                  {user ? 'Member Checkout' : 'Guest Checkout'}
                </span>
              </div>

              {/* Progress Steps Header */}
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-serif text-slate-900 mb-2">Secure checkout</h1>
                <div className="h-[1px] w-12 bg-red-400 mx-auto mb-6" />
                <div className="flex justify-between items-center max-w-md mx-auto relative px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <div className="absolute top-2.5 left-0 right-0 h-[2px] bg-slate-100 -z-10" />

                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${currentStep >= 1 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </span>
                    <span className={currentStep === 1 ? 'text-[#51823F] font-extrabold' : ''}>Details</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${currentStep >= 2 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </span>
                    <span className={currentStep === 2 ? 'text-[#51823F] font-extrabold' : ''}>Dates</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${currentStep >= 3 ? 'bg-[#51823F] text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      3
                    </span>
                    <span className={currentStep === 3 ? 'text-[#51823F] font-extrabold' : ''}>Payment</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Billing and Delivery Address */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-8 animate-fade-in-up">
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    1. Billing and delivery address
                  </h3>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      placeholder="First name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Surname *"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Contact telephone number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Address or street line 1 *"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        required
                        placeholder="Town / City *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Postcode *"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Different Delivery Address Toggle */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={differentAddress}
                        onChange={() => setDifferentAddress(!differentAddress)}
                        className="rounded text-green-600 w-4 h-4 focus:ring-green-500"
                      />
                      Deliver to a different address?
                    </label>

                    {differentAddress && (
                      <div className="mt-6 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recipient Title</p>
                          <div className="flex gap-4 text-xs font-semibold">
                            {['Miss', 'Mr', 'Mrs', 'Ms'].map((t) => (
                              <label key={t} className="flex items-center gap-2 cursor-pointer">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            placeholder="Recipient first name *"
                            value={diffFirstName}
                            onChange={(e) => setDiffFirstName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Recipient surname *"
                            value={diffSurname}
                            onChange={(e) => setDiffSurname(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none"
                          />
                          <input
                            type="tel"
                            placeholder="Recipient telephone (optional)"
                            value={diffPhone}
                            onChange={(e) => setDiffPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none md:col-span-2"
                          />
                        </div>

                        <div className="space-y-4">
                          <input
                            type="text"
                            required
                            placeholder="Delivery address or street line 1 *"
                            value={diffAddressLine}
                            onChange={(e) => setDiffAddressLine(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              required
                              placeholder="Town / City *"
                              value={diffCity}
                              onChange={(e) => setDiffCity(e.target.value)}
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Postcode *"
                              value={diffPostcode}
                              onChange={(e) => setDiffPostcode(e.target.value)}
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account creation option for unauthenticated guests */}
                  {!user && (
                    <div className="pt-4 border-t border-slate-100">
                      <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={createAccount}
                          onChange={() => setCreateAccount(!createAccount)}
                          className="rounded text-green-600 w-4 h-4 focus:ring-green-500"
                        />
                        Create an account for faster checkouts later?
                      </label>
                      {createAccount && (
                        <div className="mt-4">
                          <input
                            type="password"
                            required
                            placeholder="Choose a password *"
                            value={checkoutPassword}
                            onChange={(e) => setCheckoutPassword(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-green-600 outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-[#51823F] hover:bg-[#457036] text-white font-extrabold uppercase tracking-widest text-xs rounded shadow-md transition-all"
                  >
                    Continue to Dates
                  </button>
                </form>
              )}

              {/* Step 2: Delivery Dates & Addons */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in-up">
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    2. Select delivery dates
                  </h3>

                  {/* Premium Service Add-on Box */}
                  <div className="p-5 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assemblyService}
                        onChange={() => setAssemblyService(!assemblyService)}
                        className="rounded text-green-600 w-5 h-5 mt-0.5 focus:ring-green-500"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Add Premium Assembly Service (+£50.00)
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Our specialist white-glove team will unpack, assemble, and position your furniture in your room of choice, removing all packaging materials.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Dates Selection */}
                  <div className="space-y-4">
                    {deliveryOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedDeliveryDate(opt.date)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${selectedDeliveryDate === opt.date
                            ? 'border-[#51823F] bg-green-50/20 shadow-sm'
                            : 'border-slate-100 hover:border-slate-300'
                          }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-900">{opt.date}</p>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                        <input
                          type="radio"
                          name="deliveryDate"
                          checked={selectedDeliveryDate === opt.date}
                          onChange={() => setSelectedDeliveryDate(opt.date)}
                          className="text-green-600 focus:ring-green-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 border border-slate-200 text-slate-600 font-bold text-xs uppercase rounded hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-10 py-4 bg-[#51823F] hover:bg-[#457036] text-white font-extrabold uppercase tracking-widest text-xs rounded shadow-md transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Choice */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in-up">
                  <h3 className="text-xl font-bold font-serif text-slate-900 pb-2 border-b border-slate-100">
                    3. Payment Option
                  </h3>

                  <div className="space-y-4">
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-xl cursor-pointer flex justify-between items-center transition-all ${paymentMethod === 'card'
                          ? 'border-[#51823F] bg-green-50/20 shadow-sm'
                          : 'border-slate-100 hover:border-slate-300'
                        }`}
                    >
                      <span className="font-bold text-sm text-slate-900">Credit / Debit Card (Stripe)</span>
                      <img src={mastercardImg} alt="Card Payment" className="h-6" />
                    </div>

                    <div
                      onClick={() => setPaymentMethod('PayItMonthly')}
                      className={`p-4 border-2 rounded-xl cursor-pointer flex justify-between items-center transition-all ${paymentMethod === 'PayItMonthly'
                          ? 'border-[#51823F] bg-green-50/20 shadow-sm'
                          : 'border-slate-100 hover:border-slate-300'
                        }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Pay It Monthly</span>
                        <span className="text-xs text-slate-500">Spread the cost with flexible monthly instalments</span>
                      </div>
                      <img src={payItMonthlyImg} alt="PayItMonthly" className="h-6" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-4 border border-slate-200 text-slate-600 font-bold text-xs uppercase rounded hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={paymentLoading}
                      onClick={handlePaymentSubmit}
                      className="px-10 py-4 bg-[#51823F] hover:bg-[#457036] text-white font-extrabold uppercase tracking-widest text-xs rounded shadow-md disabled:opacity-50 transition-all"
                    >
                      {paymentLoading ? 'Redirecting...' : 'Place Order & Pay'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-4 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sticky top-28">
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center border-b border-slate-50 pb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                      {item.variant && <p className="text-slate-400">Variant: {item.variant}</p>}
                      {item.material && <p className="text-slate-400">Material: {item.material}</p>}
                      {item.color && <p className="text-slate-400">Color: {item.color}</p>}
                      <p className="text-slate-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                {assemblyService && (
                  <div className="flex justify-between text-slate-600">
                    <span>Assembly Service</span>
                    <span>£50.00</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span>£{(cartTotal + (assemblyService ? 50 : 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-500 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-green-700" /> 256-Bit SSL Encrypted
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Truck className="w-4 h-4 text-green-700" /> White-Glove Direct Delivery
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Clock className="w-4 h-4 text-green-700" /> Scheduled Slots Available
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