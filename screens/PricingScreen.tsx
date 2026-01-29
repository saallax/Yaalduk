
import React from 'react';
import { Plan } from '../types';

interface PricingScreenProps {
  onSelectPlan: (plan: Plan) => void;
  onBack: () => void;
}

const PLANS: Plan[] = [
  {
    id: 'plan_monthly',
    name: 'Bille (Monthly)',
    price: 10,
    duration: 'MONTHLY',
    features: ['AI Tutor (Had iyo goor)', 'Certificates (Shahaado)', 'Dhammaan Koorsooyinka', 'Live Sessions'],
  },
  {
    id: 'plan_yearly',
    name: 'Sanadle (Yearly)',
    price: 100,
    duration: 'YEARLY',
    features: ['AI Tutor (Priority)', 'Certificates included', 'Offline Access', '2 Months Free', 'Support direct'],
    isPopular: true
  }
];

const PricingScreen: React.FC<PricingScreenProps> = ({ onSelectPlan, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 animate-fadeIn pb-20">
      <header className="p-6 pt-10 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-navy-800 shadow-sm flex items-center justify-center text-gray-500">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest dark:text-white">Qorshaha Yaaldug</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 text-center mb-8">
        <h2 className="text-3xl font-black text-navy-800 dark:text-white mb-2 tracking-tight">Kordhi aqoontaada</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Upgrade to Premium</p>
      </div>

      <div className="px-6 space-y-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all ${plan.isPopular ? 'border-somaliGreen-500 bg-white dark:bg-navy-800 shadow-2xl scale-105' : 'border-transparent bg-white dark:bg-navy-800 opacity-90'}`}
          >
            {plan.isPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-somaliGreen-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Loogu jecelyahay
              </span>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-navy-800 dark:text-white mb-1">{plan.name}</h3>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-black text-somaliGreen-500">${plan.price}</span>
                <span className="text-xs text-gray-400 font-bold ml-1 uppercase">/ {plan.duration === 'YEARLY' ? 'Sanad' : 'Bil'}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-xs font-bold text-gray-600 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-somaliGreen-50 dark:bg-somaliGreen-900/20 text-somaliGreen-500 flex items-center justify-center mr-3 shrink-0">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${plan.isPopular ? 'bg-somaliGreen-500 text-white shadow-xl shadow-somaliGreen-500/20' : 'bg-navy-900 dark:bg-navy-700 text-white shadow-lg'}`}
            >
              Dooro Qorshahan
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center px-10">
        <p className="text-[10px] text-gray-400 uppercase font-black leading-relaxed">
          Bixinta lacagta waxaa lagu samayn karaa ZAAD, EVC Plus, ama e-Dahab. Xubinnimadu waxay si toos ah u bilaabanaysaa xaqiijinta kadib.
        </p>
      </div>
    </div>
  );
};

export default PricingScreen;
