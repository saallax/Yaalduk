
import React, { useState, useEffect } from 'react';
import { Course, PaymentMethod, PaymentStatus, Payment, User } from '../types';

interface CheckoutScreenProps {
  item: Course | { title: string, price: number, type: 'subscription' };
  onSuccess: (payment: Payment) => void;
  onCancel: () => void;
  userId: string;
  userName: string;
  user: User | null;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ item, onSuccess, onCancel, userId, userName, user }) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.EVC_PLUS);
  const [step, setStep] = useState<'selection' | 'processing' | 'verification'>('selection');
  const [reference, setReference] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  const isCourse = 'courseId' in item;
  const price = isCourse ? (item as Course).price || 10 : item.price;

  useEffect(() => {
    if (isCourse && user?.enrolledCourses.includes((item as Course).courseId)) {
      setIsDuplicate(true);
    }
  }, [item, user, isCourse]);

  const handleStartPayment = () => {
    if (isDuplicate) return;
    setStep('processing');
    setTimeout(() => {
      setStep('verification');
    }, 2000);
  };

  const handleVerify = () => {
    if (!reference.trim()) return;
    
    const newPayment: Payment = {
      paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      courseId: isCourse ? (item as Course).courseId : undefined,
      amount: price,
      currency: 'USD',
      paymentMethod: method,
      paymentType: isCourse ? 'COURSE_PURCHASE' : 'SUBSCRIPTION',
      status: PaymentStatus.SUCCESS,
      reference: reference,
      createdAt: new Date().toISOString()
    };
    onSuccess(newPayment);
  };

  if (isDuplicate) {
    return (
      <div className="fixed inset-0 bg-navy-900 z-[100] flex flex-col animate-fadeIn items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-somaliGreen-500 rounded-3xl flex items-center justify-center text-white text-3xl mb-6 shadow-2xl">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="text-white text-xl font-black mb-2 tracking-tight">Hore ayaad u iibsatay!</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Kursigan (<strong>{item.title}</strong>) horey ayaad u iibsatay. Uma baahnid inaad mar kale lacag ka bixiso.
        </p>
        <button onClick={onCancel} className="w-full bg-white text-navy-900 font-black py-4 rounded-2xl active:scale-95 transition-all">
          Xir / Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-navy-900 z-[100] flex flex-col animate-fadeIn">
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <button onClick={onCancel} className="text-white opacity-50"><i className="fas fa-times text-xl"></i></button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">Bixinta Lacagta</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10">
          <span className="text-[10px] font-black text-somaliGreen-500 uppercase tracking-widest block mb-1">Dahabkaagu waa</span>
          <h2 className="text-white text-2xl font-black mb-1">{item.title}</h2>
          <p className="text-somaliGreen-400 text-3xl font-black">${price}.00</p>
        </div>

        {step === 'selection' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Xulo Habka Bixinta</h3>
            {[
              { id: PaymentMethod.EVC_PLUS, name: 'EVC Plus', icon: 'fa-mobile-alt', color: 'bg-orange-500' },
              { id: PaymentMethod.ZAAD, name: 'ZAAD Service', icon: 'fa-phone', color: 'bg-somaliGreen-500' },
              { id: PaymentMethod.EDAHAB, name: 'e-Dahab', icon: 'fa-wallet', color: 'bg-yellow-500' },
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all ${method === m.id ? 'border-somaliGreen-500 bg-white/10' : 'border-white/5 bg-white/5'}`}
              >
                <div className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center text-white mr-4`}>
                  <i className={`fas ${m.icon}`}></i>
                </div>
                <span className="text-white font-bold">{m.name}</span>
                {method === m.id && <i className="fas fa-check-circle text-somaliGreen-500 ml-auto text-xl"></i>}
              </button>
            ))}
            <button 
              onClick={handleStartPayment}
              className="w-full bg-somaliGreen-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-somaliGreen-500/20 mt-8 active:scale-95 transition-all"
            >
              Bixi Lacagta (${price})
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn text-center">
            <div className="w-20 h-20 border-4 border-somaliGreen-500 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-white text-xl font-black mb-2">Is-gaarsiinta Mobile-ka...</h2>
            <p className="text-gray-400 text-sm max-w-[240px]">Fadlan ka eeg moobaylkaaga fariinta "Confirm Payment".</p>
          </div>
        )}

        {step === 'verification' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-somaliGreen-500/10 border border-somaliGreen-500/30 p-6 rounded-3xl text-center">
              <i className="fas fa-receipt text-somaliGreen-500 text-4xl mb-4"></i>
              <h3 className="text-white font-black text-lg mb-2">Gali Reference Number</h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">Fadlan halkan ku qor lambarka xaqiijinta (Reference ID) ee fariinta kuugu yimid.</p>
              <input 
                type="text" 
                placeholder="Tusaale: TX992831"
                className="w-full bg-navy-800 border border-white/10 rounded-2xl py-4 px-6 text-center text-white text-xl font-black tracking-widest outline-none focus:border-somaliGreen-500"
                value={reference}
                onChange={e => setReference(e.target.value.toUpperCase())}
              />
            </div>
            <button 
              onClick={handleVerify}
              disabled={!reference.trim()}
              className="w-full bg-somaliGreen-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-somaliGreen-500/20 disabled:opacity-50 active:scale-95 transition-all"
            >
              Xaqiiji Bixinta
            </button>
          </div>
        )}
      </main>

      <footer className="p-8 text-center mt-auto">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Secured by Yaaldug Pay • Anti-Fraud Active</p>
      </footer>
    </div>
  );
};

export default CheckoutScreen;
