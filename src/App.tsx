/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import {
  X,
  ChevronRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Clock,
  ArrowUp,
  ArrowRight,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { cn } from './lib/utils';
import { Dish, CartItem, CompletedOrder, spiceLabel } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [spiceLevel, setSpiceLevel] = useState('mild');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    time: '',
    notes: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollPos > 20);
      setShowBackToTop(scrollPos > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (dish: Dish) => {
    setSelectedDish(dish);
    setSelectedAddons(new Set());
    setSpiceLevel('mild');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedDish(null);
    if (!isCartOpen && !isCheckoutOpen) {
      document.body.style.overflow = 'auto';
    }
  };

  const toggleAddon = (addonName: string) => {
    const newAddons = new Set(selectedAddons);
    if (newAddons.has(addonName)) {
      newAddons.delete(addonName);
    } else {
      newAddons.add(addonName);
    }
    setSelectedAddons(newAddons);
  };

  const calculateTotal = () => {
    if (!selectedDish) return 0;
    let total = selectedDish.price;
    selectedDish.addons.forEach(addon => {
      if (selectedAddons.has(addon.name)) {
        total += addon.price;
      }
    });
    return total;
  };

  const addToCart = () => {
    if (!selectedDish) return;
    
    const addons = selectedDish.addons.filter(a => selectedAddons.has(a.name));
    const totalPrice = calculateTotal();
    
    const newItem: CartItem = {
      cartId: Math.random().toString(36).substring(2, 9),
      dish: selectedDish,
      spiceLevel,
      selectedAddons: addons,
      totalPrice,
      quantity: 1
    };

    setCart([...cart, newItem]);
    closeModal();
    toast.success(`${selectedDish.name} er tilføjet`, {
      description: `Med ${spiceLevel} styrke`,
      action: {
        label: 'Se kurv',
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors closeButton />
          <div className="min-h-screen font-sans text-dark">
        {/* SVG Filters */}
        <svg style={{ display: 'none' }}>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale="50" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="container-glass">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="glass" />
            <feComposite in="SourceGraphic" in2="glass" operator="atop" />
          </filter>
        </svg>

        <Navbar 
          scrolled={scrolled} 
          cartCount={cart.length} 
          cartTotal={cartTotal}
          onOpenCart={() => {
            setIsCartOpen(true);
            document.body.style.overflow = 'hidden';
          }} 
        />

        <main>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-muted text-lg">Indlæser...</span></div>}>
            <Routes>
              <Route path="/" element={<HomePage cartCount={cart.length} cartTotal={cartTotal} onOpenCart={() => { setIsCartOpen(true); document.body.style.overflow = 'hidden'; }} />} />
              <Route path="/menu" element={<MenuPage onSelectDish={openModal} cartCount={cart.length} cartTotal={cartTotal} onOpenCart={() => { setIsCartOpen(true); document.body.style.overflow = 'hidden'; }} />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Sticky Mobile Cart Bar */}
        <AnimatePresence>
          {cart.length > 0 && !isCartOpen && !isCheckoutOpen && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-6 left-4 right-4 md:hidden z-[90]"
            >
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  document.body.style.overflow = 'hidden';
                }}
                className="w-full bg-primary text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-between group active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Se Kurv ({cart.length})</span>
                </div>
                <span className="text-lg">{cartTotal} kr.</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-28 right-6 z-[100] bg-white text-secondary p-4 rounded-full shadow-2xl border border-black/5 hover:bg-secondary hover:text-white transition-all group"
            >
              <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {selectedDish && (
            <div className="fixed inset-0 !z-[2000] flex items-center justify-center p-5">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg p-10 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-dark">{selectedDish.name}</h2>
                  <button onClick={closeModal} className="text-muted hover:text-dark transition-colors">
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-bold text-dark border-b border-black/10 pb-2 mb-4">Vælg stærkhed</h4>
                  <div className="space-y-3">
                    {['mild', 'medium', 'hot'].map((level) => (
                      <label key={level} className="flex justify-between items-center cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="spice" 
                            value={level} 
                            checked={spiceLevel === level}
                            onChange={() => setSpiceLevel(level)}
                            className="w-5 h-5 accent-primary" 
                          /> 
                          <span className="text-dark group-hover:text-primary transition-colors">{spiceLabel(level)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedDish.addons.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-bold text-dark border-b border-black/10 pb-2 mb-4">Ekstra tilbehør</h4>
                    <div className="space-y-3">
                      {selectedDish.addons.map((addon) => (
                        <label key={addon.name} className="flex justify-between items-center cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedAddons.has(addon.name)}
                              onChange={() => toggleAddon(addon.name)}
                              className="w-5 h-5 accent-primary" 
                            /> 
                            <span className="text-dark group-hover:text-primary transition-colors">{addon.name}</span>
                          </div>
                          <span className="text-primary font-semibold">+{addon.price} kr.</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
                  <div className="text-3xl font-bold text-primary">{calculateTotal()} kr.</div>
                  <motion.button 
                    onClick={addToCart}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-10 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-primary-hover transition-all shadow-lg flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" /> Læg i kurv
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 !z-[3000] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsCartOpen(false);
                  document.body.style.overflow = 'auto';
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-black/10 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-dark flex items-center gap-3">
                    <ShoppingBag className="text-primary" /> Din Kurv
                  </h2>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      document.body.style.overflow = 'auto';
                    }} 
                    className="text-muted hover:text-dark transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-secondary mb-2">Din kurv er tom</h3>
                      <p className="text-muted mb-8 max-w-xs">Det ser ud til, at du ikke har tilføjet noget til din kurv endnu.</p>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          document.body.style.overflow = 'auto';
                        }}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-primary/90 transition-all shadow-lg"
                      >
                        Start Bestilling <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div key={item.cartId} className="flex gap-4 border-b border-black/5 pb-6">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-dark">{item.dish.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.cartId)}
                                className="text-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-sm text-muted mb-2">Stærkhed: {spiceLabel(item.spiceLevel)}</p>
                            {item.selectedAddons.length > 0 && (
                              <div className="text-xs text-muted mb-3">
                                {item.selectedAddons.map(a => a.name).join(', ')}
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                <button 
                                  onClick={() => updateQuantity(item.cartId, -1)}
                                  className="p-1 hover:text-primary transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.cartId, 1)}
                                  className="p-1 hover:text-primary transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="font-bold text-primary">{item.totalPrice * item.quantity} kr.</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-black/10 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-medium text-dark">Total</span>
                      <span className="text-3xl font-bold text-primary">{cartTotal} kr.</span>
                    </div>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-primary text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      Se bestillingsoversigt <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Checkout Modal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <div className="fixed inset-0 !z-[4000] flex items-end md:items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsCheckoutOpen(false);
                  document.body.style.overflow = 'auto';
                }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 350, mass: 0.8 }}
                className="relative bg-[#fdfbf7] w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[92vh] rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Checkout Header */}
                <div className="px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-20">
                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center gap-2 text-[#1a1a1a] font-bold text-lg hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Tilbage
                  </button>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-[#1a1a1a]">Din Ønskeliste</h2>
                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                    className="bg-black/5 p-2 rounded-full text-muted hover:text-dark transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-64 min-h-0 scroll-smooth checkout-scroll-area">
                  <div className="max-w-xl mx-auto">
                    <div className="mb-12">
                      <h3 className="text-4xl font-black text-[#1a1a1a] mb-2 tracking-tight">Klar til opkald?</h3>
                      <p className="text-[#6c757d] text-lg">Udfyld dine detaljer for at generere en oversigt, du kan ringe ind med.</p>
                      <div className="mt-4 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                        <Phone className="text-primary w-5 h-5" />
                        <p className="text-sm font-bold text-primary">Bestilling sker via telefon: +45 27 21 92 37</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] ml-1">Navn</label>
                        <input 
                          type="text" 
                          placeholder="Indtast dit fulde navn"
                          className={cn(
                            "w-full p-5 bg-white border-2 rounded-2xl focus:outline-none transition-all text-lg shadow-sm placeholder:text-black/20",
                            formErrors.name ? "border-red-500 focus:border-red-500" : "border-black/5 focus:border-primary"
                          )}
                          value={checkoutForm.name}
                          onChange={(e) => {
                            setCheckoutForm({...checkoutForm, name: e.target.value});
                            if (formErrors.name) setFormErrors(prev => {
                              const next = {...prev};
                              delete next.name;
                              return next;
                            });
                          }}
                        />
                        {formErrors.name && <p className="text-red-500 text-xs font-bold ml-1">{formErrors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] ml-1">E-mail</label>
                        <input 
                          type="email" 
                          placeholder="din@email.dk"
                          className={cn(
                            "w-full p-5 bg-white border-2 rounded-2xl focus:outline-none transition-all text-lg shadow-sm placeholder:text-black/20",
                            formErrors.email ? "border-red-500 focus:border-red-500" : "border-black/5 focus:border-primary"
                          )}
                          value={checkoutForm.email}
                          onChange={(e) => {
                            setCheckoutForm({...checkoutForm, email: e.target.value});
                            if (formErrors.email) setFormErrors(prev => {
                              const next = {...prev};
                              delete next.email;
                              return next;
                            });
                          }}
                        />
                        {formErrors.email && <p className="text-red-500 text-xs font-bold ml-1">{formErrors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] ml-1">Telefonnummer</label>
                        <input 
                          type="tel" 
                          placeholder="+45 00 00 00 00"
                          className={cn(
                            "w-full p-5 bg-white border-2 rounded-2xl focus:outline-none transition-all text-lg shadow-sm placeholder:text-black/20",
                            formErrors.phone ? "border-red-500 focus:border-red-500" : "border-black/5 focus:border-primary"
                          )}
                          value={checkoutForm.phone}
                          onChange={(e) => {
                            setCheckoutForm({...checkoutForm, phone: e.target.value});
                            if (formErrors.phone) setFormErrors(prev => {
                              const next = {...prev};
                              delete next.phone;
                              return next;
                            });
                          }}
                        />
                        {formErrors.phone && <p className="text-red-500 text-xs font-bold ml-1">{formErrors.phone}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] ml-1">Afhentningstid</label>
                          <div className="relative">
                            <input 
                              type="time" 
                              className={cn(
                                "w-full p-5 bg-white border-2 rounded-2xl focus:outline-none transition-all text-lg shadow-sm appearance-none",
                                formErrors.time ? "border-red-500 focus:border-red-500" : "border-black/5 focus:border-primary"
                              )}
                              value={checkoutForm.time}
                              onChange={(e) => {
                                setCheckoutForm({...checkoutForm, time: e.target.value});
                                if (formErrors.time) setFormErrors(prev => {
                                  const next = {...prev};
                                  delete next.time;
                                  return next;
                                });
                              }}
                            />
                            <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-black/20 w-6 h-6 pointer-events-none" />
                          </div>
                          {formErrors.time && <p className="text-red-500 text-xs font-bold ml-1">{formErrors.time}</p>}
                        </div>
                        <div className="flex items-end pb-2">
                          <p className="text-xs text-[#6c757d] leading-tight text-balance">Ring og hør nærmere om den præcise afhentningstid.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] ml-1">Bemærkninger (valgfrit)</label>
                        <textarea 
                          placeholder="Har du allergier eller specielle ønsker?"
                          rows={3}
                          className="w-full p-5 bg-white border-2 border-black/5 rounded-2xl focus:outline-none focus:border-primary transition-all text-lg resize-none shadow-sm placeholder:text-black/20"
                          value={checkoutForm.notes}
                          onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="mt-16 bg-white p-8 rounded-[32px] border-2 border-black/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary/10 p-2 rounded-xl">
                          <ShoppingBag className="text-primary w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#1a1a1a] tracking-tight">Din Bestilling</h3>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {cart.map((item) => (
                          <div key={item.cartId} className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-primary">{item.quantity}x</span>
                                <span className="font-bold text-[#1a1a1a]">{item.dish.name}</span>
                              </div>
                              <p className="text-xs text-[#6c757d] mt-1">
                                {spiceLabel(item.spiceLevel)}
                                {item.selectedAddons.length > 0 && ` • ${item.selectedAddons.map(a => a.name).join(', ')}`}
                              </p>
                            </div>
                            <span className="font-black text-[#1a1a1a]">{item.totalPrice * item.quantity} kr.</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                        <span className="font-bold text-[#1a1a1a]">Total</span>
                        <span className="text-xl font-black text-primary">{cartTotal} kr.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="w-full p-6 md:p-8 bg-white border-t border-black/5 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                  <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 opacity-40">
                      <div className="h-[1px] flex-1 bg-black" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Opsummering</span>
                      <div className="h-[1px] flex-1 bg-black" />
                    </div>
                    <div className="flex justify-between items-center mb-6 px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Totalbeløb</span>
                        <span className="text-2xl font-black text-primary">{cartTotal} kr.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Items</span>
                        <span className="block font-bold text-dark">{cart.length} stk.</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const errors: Record<string, string> = {};
                        if (!checkoutForm.name) errors.name = 'Navn er påkrævet';
                        if (!checkoutForm.email) errors.email = 'E-mail er påkrævet';
                        if (!checkoutForm.phone) errors.phone = 'Telefonnummer er påkrævet';
                        if (!checkoutForm.time) errors.time = 'Afhentningstid er påkrævet';
                        
                        if (Object.keys(errors).length > 0) {
                          setFormErrors(errors);
                          // Scroll to top of form if errors
                          const scrollContainer = document.querySelector('.checkout-scroll-area');
                          if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                          return;
                        }
                        
                        const orderId = 'MM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                        const order: CompletedOrder = {
                          orderId,
                          items: [...cart],
                          total: cartTotal,
                          customer: { ...checkoutForm },
                          timestamp: new Date().toLocaleString('da-DK')
                        };
                        
                        setCart([]);
                        setIsCheckoutOpen(false);
                        setCheckoutForm({ name: '', email: '', phone: '', time: '', notes: '' });
                        setFormErrors({});
                        document.body.style.overflow = 'auto';
                        navigate('/payment', { state: { order } });
                      }}
                      className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-2xl active:scale-[0.97] flex items-center justify-center gap-4"
                    >
                      Generer Bestillingsliste <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Order Confirmation is now handled by PaymentPage */}
      </div>
    </>
  );
}
