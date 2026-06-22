import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Landmark, Info, CircleCheck, Check, AlertCircle, Copy, Wallet } from 'lucide-react';
import { Plan, PaymentMethod } from '../types';

interface PaymentWizardProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: (method: PaymentMethod, durationMonths: number, finalPrice: number) => void;
}

export default function PaymentWizard({ plan, onClose, onSuccess }: PaymentWizardProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('elimran499@gmail.com');
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT'>('USDT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [cryptoCopied, setCryptoCopied] = useState(false);
  const [cryptoConfirmedCount, setCryptoConfirmedCount] = useState(0);
  const [isCryptoVerifying, setIsCryptoVerifying] = useState(false);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [enableAutoBilling, setEnableAutoBilling] = useState(true);

  // Prices calculation
  const months = billingCycle === 'monthly' ? plan.periodMonths : 12;
  const rawPrice = plan.price * (billingCycle === 'monthly' ? 1 : 1.8); // bulk deal annually
  const discountAmount = rawPrice * (plan.discountPercent / 100);
  const finalPrice = Number((rawPrice - discountAmount).toFixed(2));

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    // Group by 4
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCVC(val);
  };

  // Process checkout payments
  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgressPercent(0);

    const intv = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(intv);
          setIsProcessing(false);
          setStep('success');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Crypto verification simulation
  const triggerCryptoVerification = () => {
    setIsCryptoVerifying(true);
    setCryptoConfirmedCount(0);
    const verifyLogs = setInterval(() => {
      setCryptoConfirmedCount((prev) => {
        if (prev >= 3) {
          clearInterval(verifyLogs);
          setIsCryptoVerifying(false);
          // Success
          setIsProcessing(true);
          setProgressPercent(90);
          setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
          }, 300);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);
  };

  // Success confirm callback
  const handleFinished = () => {
    onSuccess(paymentMethod, months, finalPrice);
    onClose();
  };

  // Wallet address catalog
  const CRYPTO_CONFIGS = {
    BTC: {
      address: 'bc1qpst39y6rcf30f5k278cl6vhyc0g9gsw9u9xtm8',
      name: 'Bitcoin (BTC)',
      rate: 0.000016, // approximate exchange rates
      qrSvg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:bc1qpst39y6rcf30f5k278cl6vhyc0g9gsw9u9xtm8?amount=0.0008'
    },
    ETH: {
      address: '0x3E53Bc969dBdf6b04D386Fd32A02847d8b5847B0',
      name: 'Ethereum (ETH)',
      rate: 0.00031,
      qrSvg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ethereum:0x3E53Bc969dBdf6b04D386Fd32A02847d8b5847B0'
    },
    USDT: {
      address: 'TLR7LgQxPyvE1XF8hM9g4mAnuHeD1j9XbU',
      name: 'Tether TRC-20 (USDT)',
      rate: 1.07 * finalPrice,
      qrSvg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TLR7LgQxPyvE1XF8hM9g4mAnuHeD1j9XbU'
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" id="checkout-portal-parent">
      <div className="bg-slate-950 border border-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl relative overflow-hidden" id="checkout-card-layout">
        
        {/* PROGRESS LOADER INDICATOR */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin" />
              <div className="text-sm font-mono font-bold text-white">{progressPercent}%</div>
            </div>
            <h4 className="font-display font-medium text-white mb-1.5 text-base">Securing Payment Channel...</h4>
            <p className="text-xs text-slate-400 font-sans max-w-sm">Generating instant IPTV activation credentials. Do not refresh or exit the checkout portal.</p>
          </div>
        )}

        {step === 'checkout' ? (
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* LEFT FORM FIELDS COLUMN */}
            <div className="p-6 md:p-8 md:col-span-7 border-r border-slate-900">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest font-bold uppercase">PAYMENT PORTAL</span>
                  <h3 className="text-white font-display font-semibold text-lg mt-0.5">Secure Checkout</h3>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-slate-400 hover:text-white font-sans text-xs bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-850 cursor-pointer"
                >
                  Cancel Order
                </button>
              </div>

              {/* CHOOSE PLAN DETAILS / CYCLE */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between pointer-events-none">
                  <div>
                    <h4 className="text-xs font-bold text-white">{plan.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{plan.periodMonths} Months IPTV access license</p>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">€{plan.price}</span>
                </div>

                <div className="border-t border-slate-900 my-3.5" />

                {/* Billing cycle check */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase font-mono">Billed Cycle Options</label>
                  <div className="grid grid-cols-2 gap-2" id="billing-cycle-btns">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`py-2 px-3 rounded-lg text-left border text-xs cursor-pointer transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 border-cyan-500/50 text-white' : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'}`}
                    >
                      <div className="font-semibold text-xs">Standard Term</div>
                      <div className="text-[10px] text-slate-400 capitalize">{plan.periodMonths} Months access</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annually')}
                      className={`relative py-2 px-3 rounded-lg text-left border text-xs cursor-pointer transition-all ${billingCycle === 'annually' ? 'bg-slate-900 border-cyan-500/50 text-white' : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'}`}
                    >
                      <span className="absolute -top-2 -right-1.5 bg-cyan-400 text-slate-950 font-bold text-[8px] font-mono tracking-widest px-1 py-0.5 rounded leading-none">HOT</span>
                      <div className="font-semibold text-xs">Pay Annually</div>
                      <div className="text-[10px] text-cyan-400">Save extra 25%</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTOR SECTIONS */}
              <div className="mb-6">
                <label className="text-[10px] text-slate-400 font-semibold block uppercase font-mono mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2" id="payment-methods-tab">
                  {/* Credit Card Button */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('card'); }}
                    className={`py-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-slate-900 border-cyan-500/50 text-white shadow-lg shadow-indigo-500/5' : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'}`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-medium font-sans">Credit Card</span>
                  </button>

                  {/* PayPal Button */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('paypal'); }}
                    className={`py-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'bg-slate-900 border-indigo-500/40 text-white shadow-lg' : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'}`}
                  >
                    <span className="font-display font-black text-indigo-400 italic text-xs leading-none">P<span className="text-cyan-400">P</span></span>
                    <span className="text-[10px] font-medium font-sans">PayPal Link</span>
                  </button>

                  {/* Crypto Button */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('crypto'); }}
                    className={`py-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${paymentMethod === 'crypto' ? 'bg-slate-900 border-emerald-500/40 text-white shadow-lg' : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200'}`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-medium font-sans">Crypto Pay</span>
                  </button>
                </div>
              </div>

              {/* PAYMENT FORMS PANEL */}
              <form onSubmit={handleConfirmCheckout} className="space-y-4">
                
                {/* 1. CREDIT CARD FORM */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">CARDHOLDER NAME</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Jane Smith"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50"
                          id="card-holder-input"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">CARD NUMBER</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                          id="card-number-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">EXPIRY DATE (MM/YY)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                          id="card-expiry-input"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">CVC CODE (CVV)</label>
                        <input
                          type="password"
                          required
                          value={cardCVC}
                          onChange={handleCVCChange}
                          placeholder="***"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                          id="card-cvc-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PAYPAL INTEGRATION VIEW */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-slate-900/30 border border-slate-850/80 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-950/60 flex items-center justify-center border border-indigo-900 text-indigo-400 font-bold font-display text-base">P</div>
                      <div>
                        <h5 className="text-xs font-semibold text-white">PayPal Instant Account Express</h5>
                        <p className="text-[10px] text-slate-400">Log in with your existing credit card or checking account.</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">PAYPAL REGISTERED EMAIL</label>
                      <input
                        type="email"
                        required
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full text-xs text-white bg-slate-900/60 border border-slate-850 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                        id="paypal-email-input"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CRYPTO ADDRESS PORTAL */}
                {paymentMethod === 'crypto' && (
                  <div className="space-y-4 bg-slate-900/30 border border-slate-850/80 rounded-xl p-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">PAY BY SECURED LEDGER CODES</span>
                      <div className="flex gap-1.5" id="crypto-tab-selector">
                        {(['BTC', 'ETH', 'USDT'] as const).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => { setSelectedCrypto(curr); setCryptoConfirmedCount(0); }}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${selectedCrypto === curr ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 hover:bg-slate-850'}`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Generates placeholder QR payload */}
                      <div className="w-32 h-32 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        <img 
                          src={CRYPTO_CONFIGS[selectedCrypto].qrSvg} 
                          alt="Crypto wallet QR" 
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div>
                          <p className="text-[10px] text-slate-400 font-sans">Send exact amount to address below:</p>
                          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-900 mt-1">
                            <span className="text-[10px] text-white font-mono select-all truncate">{CRYPTO_CONFIGS[selectedCrypto].address}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(CRYPTO_CONFIGS[selectedCrypto].address);
                                setCryptoCopied(true);
                                setTimeout(() => setCryptoCopied(false), 2000);
                              }}
                              className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                              title="Copy code"
                            >
                              {cryptoCopied ? <span className="text-[9px] text-emerald-400 font-mono">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Total Due Rate:</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {selectedCrypto === 'USDT' 
                              ? `$${(finalPrice * 1.08).toFixed(2)} USDT` 
                              : selectedCrypto === 'ETH' 
                                ? `${(finalPrice * 0.00031).toFixed(5)} ETH` 
                                : `${(finalPrice * 0.000016).toFixed(6)} BTC`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Block countdown validation */}
                    <div className="border-t border-slate-900 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Validation blocks confirmations: {cryptoConfirmedCount}/3</span>
                        </div>
                        {isCryptoVerifying && (
                          <p className="text-[9px] text-cyan-400 font-mono mt-0.5">Tracking blockchain transaction ledger...</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={triggerCryptoVerification}
                        disabled={isCryptoVerifying}
                        className={`text-[10px] font-mono py-1.5 px-3.5 rounded-lg border cursor-pointer font-bold ${isCryptoVerifying ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'}`}
                        id="verify-blockchain-btn"
                      >
                        {isCryptoVerifying ? 'Verifying transaction...' : 'Check payment status'}
                      </button>
                    </div>
                  </div>
                )}

                {/* AUTOMATED BILLING SECURE TOGGLE */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-3 flex items-start gap-2.5 select-none mt-2">
                  <input
                    type="checkbox"
                    id="billing-secure-check"
                    checked={enableAutoBilling}
                    onChange={(e) => setEnableAutoBilling(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-850 accent-cyan-500 shrink-0 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="billing-secure-check" className="text-xs font-semibold text-white block cursor-pointer">
                      Enable Automated Billing Security Link
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                      Safe automated recurring payments protocol. Cancels automatically if no devices stream for more than 45 days. No hidden contract conditions.
                    </p>
                  </div>
                </div>

                {/* CHECKOUT SUBMIT BUTTON */}
                {paymentMethod !== 'crypto' && (
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold py-3 text-xs shadow-lg shadow-cyan-500/15 group flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer transition-all mt-4"
                    id="submit-payment-wizard"
                  >
                    <Shield className="w-4 h-4 text-slate-950" />
                    <span>Authorize Secure Payment: €{finalPrice} EUR</span>
                  </button>
                )}
              </form>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-500">●</span> 256-bit AES Point-to-point Secure Decryption Cryptography active.
              </div>
            </div>

            {/* RIGHT SIDEBAR ORDER COST COLUMN */}
            <div className="p-6 md:p-8 bg-slate-950/60 md:col-span-5 flex flex-col justify-between">
              
              {/* Dynamic Interactive Credit Card graphics layout */}
              {paymentMethod === 'card' ? (
                <div className="relative w-full aspect-[1.586/1] rounded-2xl p-5 border border-white/10 overflow-hidden bg-gradient-to-br from-indigo-900/60 via-purple-950/40 to-slate-950 shadow-2xl flex flex-col justify-between" id="virtual-credit-card-panel">
                  {/* holographic orb backgrounds */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] text-cyan-400 font-mono tracking-widest leading-none font-bold">SECURE CHIP GATEWAY</p>
                      <div className="w-8 h-6 bg-amber-400/85 rounded-md border border-amber-500/30 mt-2.5 shadow-sm" />
                    </div>
                    {/* card logo */}
                    <div className="text-right">
                      <span className="text-white italic font-bold text-xs">{cardNumber.startsWith('4') ? 'VISA' : 'MASTERCARD'}</span>
                      <p className="text-[8px] text-slate-400 font-mono leading-none mt-0.5">PREMIUM PORTAL</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-mono text-white tracking-widest truncate">{cardNumber || '•••• •••• •••• ••••'}</p>
                    <div className="flex items-center justify-between mt-3.5">
                      <div>
                        <p className="text-[8px] text-slate-400 font-mono leading-none">CARDHOLDER</p>
                        <p className="text-[10px] font-mono text-white tracking-wider mt-0.5 uppercase truncate max-w-[120px]">{cardName || 'Jane Smith'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-mono leading-none">EXPIRES</p>
                        <p className="text-[10px] font-mono text-white tracking-wider mt-0.5">{cardExpiry || 'MM/YY'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-mono leading-none">CVC</p>
                        <p className="text-[10px] font-mono text-white tracking-wider mt-0.5">{cardCVC || '•••'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[1.586/1] rounded-2xl p-5 border border-slate-900 bg-slate-950 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h5 className="text-xs font-semibold text-white">Encrypted Direct Terminal</h5>
                  <p className="text-[10px] text-slate-500 font-sans max-w-[200px] mt-1">SSL Encrypted digital transaction directly channeled to our bank server.</p>
                </div>
              )}

              {/* PAYMENT RECEIPT SUMMARY DETAILS */}
              <div className="mt-6 space-y-3.5 text-xs">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Receipt summary</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Base monthly pricing rate:</span>
                    <span className="font-mono">€{plan.price} EUR</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-400">
                    <span>Active License Terms Duration:</span>
                    <span>{months} Months</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount applied ({plan.discountPercent}% OFF):</span>
                    <span className="font-mono">-€{discountAmount.toFixed(2)} EUR</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Fast Setup Activation Provision:</span>
                    <span className="text-emerald-400 font-bold uppercase text-[9px] font-mono bg-emerald-950 px-2 py-0.5 rounded">FREE</span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-3 mt-3 flex items-baseline justify-between">
                  <span className="font-semibold text-white text-sm">TOTAL AMOUNT:</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white font-mono">€{finalPrice}</span>
                    <p className="text-[9px] text-slate-500 font-sans leading-none mt-0.5 font-mono">Includes VAT tax</p>
                  </div>
                </div>

                {/* Secured badge */}
                <div className="glass-pill p-3 border border-white/5 rounded-xl flex gap-1.5 items-start text-[10px] text-slate-400">
                  <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
                  <p className="leading-snug">
                    Secured by Stripe Billing, PayPal Sandbox, & BTC SegWit validators. Refunds guaranteed up to 14 days if the IPTV service suffers channels downtime.
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* SUCCESS PAGE SCREEN */
          <div className="p-8 text-center max-w-lg mx-auto py-12 space-y-5 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-bold uppercase">PROVIONING ACTIVE</span>
              <h3 className="text-white font-display font-medium text-xl mt-1 leading-normal">Billing Processed, stream codes active!</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                A securing code has been successfully allocated. Your new IPTV active subscription is loaded inside your Secure Dashboard cabinet.
              </p>
            </div>

            {/* Generated Stream specs for client box */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 text-left space-y-2.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Allocated Service Package:</span>
                <span className="font-semibold text-white">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stream Line Username:</span>
                <span className="font-mono font-semibold text-cyan-400">aura_{Math.floor(1000 + Math.random() * 9000)}_active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Streaming Portal Server URL:</span>
                <span className="font-mono text-slate-300 select-all">http://aura-iptv.net:3000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fast Active Access Code:</span>
                <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded select-all border border-slate-800">
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinished}
              className="w-full rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold py-3 text-xs shadow-lg shadow-cyan-400/10 transition-colors cursor-pointer"
            >
              Access Secure Dashboard Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
