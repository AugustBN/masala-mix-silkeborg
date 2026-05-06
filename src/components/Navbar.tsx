/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LiquidButton } from './ui/liquid-glass-button';

interface NavbarProps {
  scrolled: boolean;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export default function Navbar({ scrolled, cartCount, cartTotal, onOpenCart }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleScrollTo = (id: string) => {
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header 
      initial={{ y: -120 }}
      animate={{ y: scrolled ? 0 : -120 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="navbar fixed top-0 left-0 w-full flex justify-between items-center px-[5%] py-2 md:py-3 !z-[100] bg-white/40 backdrop-blur-md border-b border-white/30 shadow-lg"
    >
      <Link to="/" className="logo-container">
        <img src="https://www.masalamix.dk/favicon.png" alt="Masala Mix Logo" className="h-[50px] md:h-[70px] w-auto block drop-shadow-md" />
      </Link>
      <nav className="hidden md:flex gap-4 items-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <LiquidButton asChild size="default" className="font-bold uppercase tracking-widest">
            <Link to="/menu">Menu</Link>
          </LiquidButton>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <LiquidButton 
            size="default" 
            className="font-bold uppercase tracking-widest"
            onClick={() => handleScrollTo('about-section')}
          >
            Om os
          </LiquidButton>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <LiquidButton 
            size="default" 
            className="font-bold uppercase tracking-widest"
            onClick={() => handleScrollTo('contact-section')}
          >
            Kontakt
          </LiquidButton>
        </motion.div>
        <div className="w-px h-6 bg-dark/10 mx-2"></div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <LiquidButton 
            variant="primary"
            size="default"
            onClick={onOpenCart} 
            className="font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Kurv ({cartCount}) • {cartTotal} kr.
          </LiquidButton>
        </motion.div>
      </nav>
      <div className="md:hidden flex items-center gap-2">
        <LiquidButton
          variant="primary"
          size="icon"
          onClick={onOpenCart}
          className="rounded-full"
        >
          <ShoppingBag className="w-6 h-6" />
        </LiquidButton>
        <LiquidButton
          size="icon"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="rounded-full"
          aria-label={mobileMenuOpen ? 'Luk menu' : 'Åbn menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </LiquidButton>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-white/30 shadow-lg py-6 flex flex-col items-center gap-4"
          >
            <Link
              to="/menu"
              className="font-bold uppercase tracking-widest text-dark hover:text-primary transition-colors text-lg py-2"
            >
              Menu
            </Link>
            <button
              onClick={() => { handleScrollTo('about-section'); setMobileMenuOpen(false); }}
              className="font-bold uppercase tracking-widest text-dark hover:text-primary transition-colors text-lg py-2"
            >
              Om os
            </button>
            <button
              onClick={() => { handleScrollTo('contact-section'); setMobileMenuOpen(false); }}
              className="font-bold uppercase tracking-widest text-dark hover:text-primary transition-colors text-lg py-2"
            >
              Kontakt
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
