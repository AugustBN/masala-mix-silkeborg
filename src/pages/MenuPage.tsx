/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, UtensilsCrossed, Plus, ArrowLeft, Star, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Dish, MENU_DATA } from '../types';
import Footer from '../components/Footer';

interface MenuPageProps {
  onSelectDish: (dish: Dish) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export default function MenuPage({ onSelectDish, cartCount, cartTotal, onOpenCart }: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return MENU_DATA;
    
    return MENU_DATA.map(category => ({
      ...category,
      dishes: category.dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.dishes.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-0 content-wrapper flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div className="flex-1">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover font-bold mb-2 md:mb-4 transition-colors text-sm md:text-base">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Tilbage til forsiden
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">Vores Menu</h1>
            <p className="text-muted mt-1 md:text-lg">Udforsk vores udvalg af autentiske indiske retter.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Søg i menuen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {cartCount > 0 && (
              <button 
                onClick={onOpenCart}
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl flex items-center justify-center gap-3 animate-bounce-subtle"
              >
                <ShoppingBag className="w-6 h-6" />
                Se Kurv ({cartCount}) • {cartTotal} kr.
              </button>
            )}
          </div>
        </div>

        <div className="space-y-16 md:space-y-20">
          <AnimatePresence mode="popLayout">
            {filteredMenu.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Ingen retter fundet</h3>
                <p className="text-muted">Prøv at søge efter noget andet eller tjek vores kategorier.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Ryd søgning
                </button>
              </motion.div>
            ) : (
              filteredMenu.map((category, catIdx) => (
                <section key={category.category} className="category-section">
                <div className="flex items-center gap-4 mb-16 md:mb-16">
                  <div className="h-px flex-grow bg-primary/20"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-secondary px-4 whitespace-nowrap flex items-center gap-2 md:gap-3">
                    <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    {category.category}
                  </h2>
                  <div className="h-px flex-grow bg-primary/20"></div>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-16"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
                  }}
                >
                  {category.dishes.map((dish, dishIdx) => {
                    const isFavorite = catIdx === 0 && dishIdx === 0;
                    return (
                      <motion.div
                        key={dish.name}
                        variants={{
                          hidden: { opacity: 0, y: 32 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        whileHover={{ y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
                        className={`relative bg-white rounded-xl md:rounded-2xl shadow-md border overflow-visible hover:shadow-xl transition-shadow group flex flex-col h-full will-change-transform ${
                          isFavorite
                            ? 'border-yellow-400 ring-2 md:ring-4 ring-yellow-400/20 z-10 mt-16 md:mt-0'
                            : 'border-black/5'
                        }`}
                      >
                        {isFavorite && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-dark px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-lg flex items-center gap-1 z-20 whitespace-nowrap">
                            <Star className="w-3 h-3 fill-dark" /> Chef's favorite
                          </div>
                        )}
                        <div className="p-4 md:p-8 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2 md:mb-4">
                            <h3 className="text-lg md:text-2xl font-bold text-secondary group-hover:text-primary transition-colors leading-tight">{dish.name}</h3>
                            <span className="text-base md:text-xl font-bold text-primary whitespace-nowrap ml-2">{dish.price} kr.</span>
                          </div>
                          <p className="text-xs md:text-base text-muted leading-relaxed mb-4 md:mb-8 flex-grow">{dish.description}</p>
                          <motion.button
                            onClick={() => onSelectDish(dish)}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full bg-secondary text-white py-2.5 md:py-4 rounded-lg md:rounded-xl font-bold uppercase tracking-widest text-xs md:text-base hover:bg-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                          >
                            <Plus className="w-3 h-3 md:w-5 md:h-5" />
                            Vælg Ret
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="h-24 md:h-32"></div>
      <Footer />
    </div>
  );
}
