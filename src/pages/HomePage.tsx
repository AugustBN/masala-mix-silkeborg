/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, UtensilsCrossed, Info, MapPin, Phone, Star, ExternalLink, Clock, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Footer from '../components/Footer';

const DUMMY_REVIEWS = [
  { id: 1, text: "Mega god service og flot indretning. Købte take away uden problemer med god indpakning af maden og det smagte fantastisk :)", author: "Agashe J." },
  { id: 2, text: "I dag bestilte jeg en Butter Chicken take away, det var den bedste jeg har smagt i rigtig langtid, de ser mig 100% igen.", author: "Havin S." },
  { id: 3, text: "Virkelig lækkert mad, og en sød ejer.", author: "Mila S." },
  { id: 4, text: "Maden var fantastisk, har ikke så meget andet end at sige jeg 100% kommer tilbage dertil.", author: "John S." },
  { id: 5, text: "Jeg kom ind i dag og bestilte en vegetarisk ret, det smagte meget godt til en billig pris. Personalet var meget venligt.", author: "Ali" },
  { id: 6, text: "Alt i alt smagte det dejligt, og portionen var stor med rigeligt kød og masser af kærlighed. Servicen var god.", author: "Anis" },
  { id: 7, text: "Servicen er i top, der er altid smil på læberne. Maden er tip top.", author: "Karker M." },
  { id: 8, text: "Virkelig god mad, det anbefales meget, jeg kom og bestilte en butter chicken og mango lassi, hold da op!", author: "Abdel A." },
  { id: 9, text: "Skøn oplevelse, også ved 3. besøg. Veltilberedt, nærværende service og fair priser.", author: "Flemming J." },
];

const FAQ_DATA = [
  {
    question: "Tilbyder I udbringning?",
    answer: "Ja, vi tilbyder udbringning i hele Silkeborg og omegn. Leveringsprisen afhænger af afstanden."
  },
  {
    question: "Er jeres kød halal?",
    answer: "Ja, alt vores kød er 100% halal-certificeret."
  },
  {
    question: "Har I vegetariske retter?",
    answer: "Absolut! Vi har et stort udvalg af vegetariske og veganske retter, herunder vores populære Paneer Butter Masala og Dal Makhani."
  },
  {
    question: "Kan jeg bestille mad til større selskaber?",
    answer: "Ja, vi tilbyder catering til alle typer selskaber. Kontakt os venligst direkte for et uforpligtende tilbud."
  }
];

interface HomePageProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export default function HomePage({ cartCount, cartTotal, onOpenCart }: HomePageProps) {
  const location = useLocation();
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % DUMMY_REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const id = (location.state as any).scrollTo;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Clear state to avoid scrolling again on back button
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero h-screen min-h-[600px] flex items-center md:items-start md:pt-[10vh] justify-center text-center px-5 relative">
        <div className="max-w-4xl w-full">
          {/* Reviews Ticker */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 md:mb-6 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">4,9 / 5</span>
              <span className="text-white/60 text-xs drop-shadow-md">(101 anmeldelser)</span>
            </div>
            
            <div className="min-h-[3rem] md:min-h-[3.5rem] relative w-full max-w-lg mb-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-white/90 text-sm md:text-base italic font-medium drop-shadow-md px-4 leading-relaxed"
                >
                  "{DUMMY_REVIEWS[currentReviewIdx].text}" — {DUMMY_REVIEWS[currentReviewIdx].author}
                </motion.div>
              </AnimatePresence>
            </div>

            <a 
              href="https://www.google.com/search?q=Masala+Mix+Silkeborg+anmeldelser" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 text-white/40 hover:text-white/80 text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
            >
              Skriv en anmeldelse <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-bold text-white mb-4 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
          >
            Autentisk indisk takeaway
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white mb-8 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] opacity-90"
          >
            Oplev smagen af de ægte indiske krydderier. Frisklavet, varmt og klar til afhentning.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/menu"
              className="bg-primary text-white px-12 py-5 rounded-full text-xl font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Se Menuen
            </Link>
            {cartCount > 0 && (
              <button 
                onClick={onOpenCart}
                className="bg-primary text-white px-12 py-5 rounded-full text-xl font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-2xl flex items-center gap-3 hover:-translate-y-1 active:scale-95"
              >
                <ShoppingBag className="w-6 h-6" />
                Kurv ({cartCount})
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Wrapper */}
      <div className="content-wrapper flex flex-col">
        {/* About Section */}
        <section className="section py-24 px-[5%] max-w-[1200px] mx-auto" id="about-section">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary mb-4">Kærlighed til maden</h2>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white max-w-4xl mx-auto p-12 text-center rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative dashed-gradient-border"
          >
            <img
              src="https://www.masalamix.dk/favicon.png"
              alt="Masala Mix Logo"
              className="h-24 w-auto mx-auto mb-8 opacity-90"
              referrerPolicy="no-referrer"
              width={96}
              height={96}
              loading="lazy"
            />
            
            <h3 className="text-2xl font-bold text-dark mb-6">Velkommen til Masala Mix</h3>
            
            <p className="text-lg text-dark/80 leading-loose max-w-2xl mx-auto">
              Hos <span className="font-bold text-primary">Masala Mix Silkeborg</span> brænder vi for at levere en autentisk smagsoplevelse. 
              Vi bruger kun de friskeste råvarer og traditionelle opskrifter for at sikre, at hver bid er en rejse til Indien. 
              Vores mål er at bringe de ægte indiske krydderier og smage direkte til dit bord i Silkeborg.
            </p>
            
            <div className="mt-10 flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <UtensilsCrossed className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Autentisk</span>
              </div>
              <div className="w-px h-12 bg-black/5 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Kvalitet</span>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Testimonials Section */}
        <section className="section py-24 px-[5%] bg-gray-50/50 relative overflow-hidden" id="reviews-section">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
          
          <div className="max-w-[1200px] mx-auto relative">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-secondary mb-4">Hvad vores kunder siger</h2>
              <div className="w-24 h-1 bg-primary rounded-full mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DUMMY_REVIEWS.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[24px] shadow-sm border border-black/5 flex flex-col h-full hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-dark/80 italic mb-8 flex-grow leading-relaxed">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {review.author[0]}
                    </div>
                    <span className="font-bold text-dark">{review.author}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <a 
                href="https://www.google.com/search?q=Masala+Mix+Silkeborg+anmeldelser" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
              >
                Se alle Google-anmeldelser <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section py-24 px-[5%] max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary mb-4">Ofte stillede spørgsmål</h2>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto"></div>
          </motion.div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button 
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-lg text-secondary">{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 text-primary transition-transform duration-300 ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaqIdx === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="section py-20 px-[5%] max-w-[1200px] mx-auto" id="contact-section">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-4xl font-bold text-secondary mb-12"
          >
            Find os
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-xl shadow-sm border border-black/5 flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Info className="w-6 h-6" /> Kontakt Information
              </h3>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Masala+Mix+Nygade+27A+8600+Silkeborg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 mb-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-dark group-hover:text-primary transition-colors">Adresse</strong>
                  <span className="text-muted">Nygade 27A, 8600 Silkeborg</span>
                </div>
              </a>
              <a 
                href="tel:+4527219237" 
                className="flex items-center gap-4 mb-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-dark group-hover:text-primary transition-colors">Telefon</strong>
                  <span className="text-muted">+45 27 21 92 37</span>
                </div>
              </a>
              <div className="flex items-start gap-4 pt-6 border-t border-black/5">
                <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <strong className="block text-dark mb-2">Åbningstider</strong>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    {[
                      { day: 'Mandag', hours: '15:00 - 20:45', index: 1 },
                      { day: 'Tirsdag', hours: '15:00 - 20:45', index: 2 },
                      { day: 'Onsdag', hours: '15:00 - 20:45', index: 3 },
                      { day: 'Torsdag', hours: '15:00 - 20:45', index: 4 },
                      { day: 'Fredag', hours: '15:00 - 20:45', index: 5 },
                      { day: 'Lørdag', hours: '15:00 - 20:45', index: 6 },
                      { day: 'Søndag', hours: '15:00 - 20:45', index: 0 },
                    ].map((item) => {
                      const isToday = new Date().getDay() === item.index;
                      return (
                        <div key={item.day} className={`contents ${isToday ? 'text-primary font-bold' : 'text-muted'}`}>
                          <span>{item.day}</span>
                          <span>{item.hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="rounded-xl overflow-hidden h-full min-h-[300px] shadow-sm border border-black/5">
              <iframe 
                src="https://maps.google.com/maps?q=Masala+Mix,+Nygade+27A,+8600+Silkeborg&hl=da&z=15&output=embed" 
                className="w-full h-full border-none"
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
        
        <div className="h-24 md:h-32"></div>
        <Footer />
      </div>
    </div>
  );
}
