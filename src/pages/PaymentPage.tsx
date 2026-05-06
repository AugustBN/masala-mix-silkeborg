/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, CreditCard, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CompletedOrder, spiceLabel } from '../types';
import { paymentProvider } from '../lib/payment';

const RESTAURANT_PHONE = '+4527219237';
const RESTAURANT_PHONE_DISPLAY = '+45 27 21 92 37';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as CompletedOrder;
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) {
      navigate('/menu');
    }
  }, [order, navigate]);

  if (!order) return null;

  const vat = order.total - order.total / 1.25;

  async function handleOnlinePayment() {
    setPayLoading(true);
    setPayError(null);
    const result = await paymentProvider.initiatePayment({
      amountDKK: order.total,
      orderId: order.orderId,
      customerEmail: order.customer.email,
      customerName: order.customer.name,
      description: `Masala Mix bestilling #${order.orderId}`,
    });
    setPayLoading(false);
    if (result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      setPayError(result.error ?? 'Betaling mislykkedes. Prøv igen eller ring til os.');
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-5 md:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Top Navbar Simulation */}
        <div className="flex justify-start mb-8">
          <Link 
            to="/menu"
            className="flex items-center gap-2 bg-[#1b7a4d] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#15613d] transition-all shadow-md group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            Tilbage
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-black/5 relative">
          {/* Logo overlay like in screenshot */}
          <div className="absolute top-10 right-10 hidden md:block">
            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center p-2">
              <img
                src="https://www.masalamix.dk/favicon.png"
                alt="Masala Mix Logo"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
                width={96}
                height={96}
                loading="lazy"
              />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-dark mb-2">Hej {order.customer.name},</h2>
              <p className="text-muted mb-8">Tjek at din bestilling er korrekt — ring derefter til os for at bekræfte</p>

              {/* Call Alert Box */}
              <div className="bg-[#f0fdf4] border border-green-100 p-4 rounded-xl mb-12 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-green-900 font-bold text-sm md:text-base">
                  Din bestilling er ikke bekræftet før du har ringet til os på {RESTAURANT_PHONE_DISPLAY}
                </p>
              </div>

              {/* Order Table */}
              <div className="mb-12 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-[#1a1a1a] border-b border-black/10 pb-4">
                      <th className="pb-4 font-black">Antal</th>
                      <th className="pb-4 font-black">Vare(r)</th>
                      <th className="pb-4 text-right font-black">Pris i DKK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {order.items.map((item) => (
                      <tr key={item.cartId}>
                        <td className="py-6 font-bold text-dark">{item.quantity}</td>
                        <td className="py-6">
                          <div className="font-bold text-dark">{item.dish.name}</div>
                          <div className="text-xs text-muted mt-1">
                            {spiceLabel(item.spiceLevel)}
                            {item.selectedAddons.length > 0 && ` • ${item.selectedAddons.map(a => a.name).join(', ')}`}
                          </div>
                        </td>
                        <td className="py-6 text-right font-bold text-dark">
                          {(item.totalPrice * item.quantity).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex flex-col items-end mb-16 space-y-2 border-t border-black/10 pt-6">
                <div className="flex justify-between w-full md:w-64">
                   <span className="font-bold text-dark text-xl underline decoration-2 underline-offset-4">Total: DKK {order.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="text-xs text-muted">Heraf moms: {vat.toFixed(2).replace('.', ',')}</div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-sm text-dark font-medium mb-16">
                <div className="flex gap-2">
                  <span className="font-bold">Din E-mail adresse:</span>
                  <span className="text-muted">{order.customer.email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Dit telefonnummer:</span>
                  <span className="text-muted">{order.customer.phone}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Din ordre kan afhentes d.:</span>
                  <span className="text-muted">I dag kl. {order.customer.time}</span>
                </div>
              </div>

              <div className="border-t border-black/5 pt-12">
                <h3 className="text-2xl font-black text-[#1a1a1a] mb-3 tracking-tight">Bekræft din bestilling</h3>
                <p className="text-muted mb-8">Betal online eller ring til os med dit ordrenummer <span className="font-bold text-dark">#{order.orderId}</span>.</p>

                {/* --- Online payment button (swap VITE_PAYMENT_PROVIDER to enable) --- */}
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <motion.button
                    onClick={handleOnlinePayment}
                    disabled={payLoading}
                    whileHover={{ scale: payLoading ? 1 : 1.02 }}
                    whileTap={{ scale: payLoading ? 1 : 0.98 }}
                    className="w-full md:w-auto bg-[#1b7a4d] text-white px-12 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#15613d] transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {payLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                    {payLoading ? 'Behandler...' : 'Betal Online'}
                  </motion.button>

                  <motion.a
                    href={`tel:${RESTAURANT_PHONE}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto bg-[#1b7a4d] text-white px-12 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#15613d] transition-all shadow-xl flex items-center justify-center gap-4"
                  >
                    <Phone className="w-6 h-6" />
                    Ring til os — {RESTAURANT_PHONE_DISPLAY}
                  </motion.a>
                </div>

                {payError && (
                  <p className="mt-4 text-sm text-red-600 font-medium">{payError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer of the main card */}
          <div className="bg-[#fcfaf7] px-8 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-black/5">
            <div className="flex flex-col md:flex-row gap-6 text-sm text-muted text-center md:text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Masala Mix Silkeborg, Nygade 27A, 8600 Silkeborg
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +45 27 21 92 37
              </div>
            </div>
            <div className="flex items-center gap-1 font-bold text-xl">
              <span className="text-primary">Masala</span>
              <span className="text-dark">Mix</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
