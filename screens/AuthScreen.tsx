
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USER } from '../mockData';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  onGuest: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onGuest }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    const user: User = {
      ...MOCK_USER,
      email: email || 'student@yaaldug.so',
      name: email ? email.split('@')[0] : 'Arday Yaaldug',
      userId: Math.random().toString(36).substr(2, 9)
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-center items-center p-8 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-somaliGreen-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="w-full max-w-sm z-10 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-somaliGreen-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl rotate-12 transition-transform hover:rotate-0 duration-500">
            <i className="fas fa-graduation-cap text-4xl text-white -rotate-12"></i>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Yaaldug</h1>
          <p className="text-sm text-gray-400 font-medium">Barashada Casriga Ah ee Soomaalida</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Email-ka</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
              <input 
                type="email" 
                required
                className="w-full bg-navy-800 border border-navy-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-somaliGreen-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="Email-kaaga gali"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Password-ka</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
              <input 
                type="password" 
                required
                className="w-full bg-navy-800 border border-navy-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-somaliGreen-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="Password-kaaga"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-somaliGreen-500 hover:bg-somaliGreen-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-4"
          >
            {isRegistering ? 'Sameyso Account' : 'Soo Gal'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isRegistering ? 'Hadaad account leedahay, soo gal' : 'Ma haysatid account? Is-qor halkan'}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-navy-700"></div>
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">ama</span>
            <div className="flex-1 h-px bg-navy-700"></div>
          </div>

          <button 
            onClick={onGuest}
            className="w-full bg-navy-800 border border-navy-700 text-gray-300 font-bold py-3 rounded-2xl hover:bg-navy-700 transition-colors"
          >
            Ugal Marti (Guest)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
