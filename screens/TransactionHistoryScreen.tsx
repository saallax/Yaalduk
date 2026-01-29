
import React from 'react';
import { Payment } from '../types';

interface TransactionHistoryScreenProps {
  payments: Payment[];
  onBack: () => void;
}

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({ payments, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 animate-fadeIn">
      <header className="p-6 pt-10 flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-navy-900 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-navy-800 shadow-sm flex items-center justify-center text-gray-500">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest dark:text-white">Dhaqdhaqaaqa Lacagta</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6">
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.paymentId} className="bg-white dark:bg-navy-800 p-5 rounded-3xl border border-gray-100 dark:border-navy-700 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[9px] font-black text-somaliGreen-500 uppercase tracking-widest block mb-1">
                      {payment.paymentType === 'SUBSCRIPTION' ? 'Subscription' : 'Course Buy'}
                    </span>
                    <h3 className="text-sm font-bold dark:text-white">
                      {payment.paymentType === 'SUBSCRIPTION' ? 'Yaaldug Premium' : 'Specialized Course'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-navy-800 dark:text-somaliGreen-500">${payment.amount}</p>
                    <span className="text-[8px] font-black uppercase bg-somaliGreen-50 dark:bg-somaliGreen-900/30 text-somaliGreen-600 px-2 py-0.5 rounded">
                      Guulaystay
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-navy-700 text-[10px] text-gray-400 font-bold">
                  <div className="flex items-center">
                    <i className="fas fa-receipt mr-2"></i>
                    {payment.reference}
                  </div>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-30">
            <i className="fas fa-history text-6xl mb-4"></i>
            <p className="text-xs font-black uppercase tracking-widest">Wali ma jiro dhaqdhaqaaq lacageed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryScreen;
