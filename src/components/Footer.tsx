/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-12 px-[5%] mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://www.masalamix.dk/favicon.png"
            alt="Masala Mix Logo"
            className="h-16 w-auto mb-6 grayscale hover:grayscale-0 transition-all cursor-pointer"
            referrerPolicy="no-referrer"
            width={64}
            height={64}
            loading="lazy"
          />
          <p className="text-muted text-sm leading-relaxed text-center md:text-left max-w-xs">
            Autentisk indisk madlavning med kærlighed og tradition. Oplev de ægte smage fra Indien i hjertet af Silkeborg.
          </p>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">Kontakt</h4>
          <div className="space-y-4">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Masala+Mix+Nygade+27A+8600+Silkeborg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm"
            >
              <MapPin className="w-4 h-4" />
              Nygade 27A, 8600 Silkeborg
            </a>
            <a 
              href="tel:+4527219237" 
              className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              +45 27 21 92 37
            </a>
          </div>
        </div>

        {/* Social Column */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">Følg os</h4>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/masala_mix_025/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/MasalaMixSilkeborg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-all">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
        <p>© 2026 Masala Mix Silkeborg. Alle rettigheder forbeholdes.</p>
        <div className="flex gap-6">
          <span className="opacity-40">Masala Mix Silkeborg</span>
        </div>
      </div>
    </footer>
  );
}
