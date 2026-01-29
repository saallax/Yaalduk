
import React, { useState, useRef, useMemo } from 'react';
import { User, UserRole, AppLanguage, Course } from '../types';

interface ProfileScreenProps {
  user: User | null;
  isGuest: boolean;
  courses: Course[];
  onLogout: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
  onToggleLang: () => void;
  language: AppLanguage;
  onNavigateAdmin: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onSubscribe: () => void;
  onViewHistory: () => void;
}

type ModalType = 'none' | 'about' | 'contact' | 'avatar' | 'cert-info' | 'privacy' | 'terms';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  user, isGuest, courses, onLogout, onToggleTheme, darkMode, onToggleLang, language, onNavigateAdmin, onUpdateUser, onSubscribe, onViewHistory 
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avgProgress = useMemo(() => {
    if (!user || Object.keys(user.progress).length === 0) return 0;
    const values = Object.values(user.progress) as number[];
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
  }, [user]);

  const enrolledCoursesData = useMemo(() => {
    if (!user) return [];
    return user.enrolledCourses.map(id => courses.find(c => c.courseId === id)).filter(Boolean) as Course[];
  }, [user, courses]);

  if (isGuest) {
    return (
      <div className="p-8 text-center animate-fadeIn flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-400 mb-6 border-4 border-dashed border-gray-200 dark:border-navy-700">
          <i className="fas fa-user-secret text-4xl opacity-50"></i>
        </div>
        <h2 className="text-xl font-black mb-2 dark:text-white tracking-tight">Marti baad tahay</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-[200px] leading-relaxed">Si aad u raacdo casharradaada iyo horumarkaaga, fadlan soo gal.</p>
        <button 
          onClick={onLogout}
          className="w-full bg-somaliGreen-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-somaliGreen-500/20 transition-transform active:scale-95"
        >
          Soo Gal / Login
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ profileImage: reader.result as string, avatarSeed: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const userAvatarUrl = user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 pb-32 animate-fadeIn">
      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
           <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setActiveModal('none')}></div>
           <div className="relative bg-white dark:bg-navy-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar border border-gray-100 dark:border-navy-700">
              <h2 className="text-xl font-black text-navy-800 dark:text-white mb-6">Xeerka Ilaalinta Xogta</h2>
              <div className="space-y-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">1. Xogta aan aruurino</p>
                 <p>Waxaan aruurinaa magacaaga, email-kaaga, iyo horumarkaaga waxbarasho si aan kuugu adeegno.</p>
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">2. AI iyo Gemini</p>
                 <p>Su'aalaha aad weydiiso AI Tutor-ka waxaa loo diraa Google Gemini si laguugu soo jawaabo.</p>
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">3. Lacag bixinta</p>
                 <p>Ma kaydino PIN-kaaga mobile money-ga. Waxaan kaliya kaydinaa lambarka xaqiijinta (Reference).</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-full mt-8 bg-somaliGreen-500 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Waan Fahmay</button>
           </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
           <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setActiveModal('none')}></div>
           <div className="relative bg-white dark:bg-navy-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar border border-gray-100 dark:border-navy-700">
              <h2 className="text-xl font-black text-navy-800 dark:text-white mb-6">Shuruudaha & Adeegga</h2>
              <div className="space-y-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">1. Akown-kaaga</p>
                 <p>Waxaad mas'uul ka tahay ilaalinta sirta account-kaaga iyo wax kasta oo lagu dhex sameeyo.</p>
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">2. Xuquuqda Daabacaadda</p>
                 <p>Dhammaan casharrada video-ga ah waa hantida Yaaldug. Lama ogola in la duubo ama lala wadaago dad kale.</p>
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">3. AI Tutor</p>
                 <p>Jawaabaha AI Tutor-ka waxaa loogu talagalay caawinaad waxbarasho. Hubi macluumaadka muhiimka ah.</p>
                 <p className="font-bold text-navy-800 dark:text-white uppercase tracking-widest text-[10px]">4. Mamnuuc</p>
                 <p>Lama ogola in la isticmaalo luuqad xun ama account-ka lagu wadaago si lacagta looga dhuunto.</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-full mt-8 bg-navy-900 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Waan Ogolaaday</button>
           </div>
        </div>
      )}

      {/* Header & Profile Info */}
      <div className="bg-white dark:bg-navy-800 p-8 pt-12 rounded-b-[3.5rem] shadow-sm mb-6 border-b border-gray-100 dark:border-navy-700">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 group">
            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-somaliGreen-500/10 shadow-xl">
              <img src={userAvatarUrl} alt="Avatar" className="w-full h-full object-cover bg-gray-50" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-somaliGreen-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform border-4 border-white dark:border-navy-800"><i className="fas fa-camera text-xs"></i></button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
          <h2 className="text-2xl font-black text-navy-800 dark:text-white tracking-tight mb-1">{user?.name}</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">{user?.email}</p>
          
          <div className="w-full bg-navy-900 dark:bg-navy-950 rounded-[2.5rem] p-6 text-white flex items-center gap-6 shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-16 h-16 rounded-full border-4 border-somaliGreen-500/20 flex items-center justify-center relative">
                   <span className="text-lg font-black">{avgProgress}%</span>
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * avgProgress) / 100} className="text-somaliGreen-500" />
                   </svg>
                </div>
             </div>
             <div className="text-left z-10">
                <h3 className="text-xs font-black uppercase tracking-widest mb-1">Horumarka Guud</h3>
                <p className="text-[9px] opacity-60 leading-relaxed max-w-[140px]">Celcelis ahaan waxaad dhameysay {avgProgress}% dhammaan koorsooyinkaaga.</p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-somaliGreen-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-10">
        {/* Subscription Status */}
        <section>
          <div className="bg-white dark:bg-navy-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-navy-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${user?.subscription?.status === 'ACTIVE' ? 'bg-somaliGreen-500 shadow-somaliGreen-500/20' : 'bg-gray-300'}`}>
                  <i className={`fas ${user?.subscription?.status === 'ACTIVE' ? 'fa-crown' : 'fa-gem'}`}></i>
               </div>
               <div>
                  <h4 className="text-xs font-black dark:text-white uppercase tracking-tight">Status-ka Premium</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{user?.subscription?.status === 'ACTIVE' ? `Active: ${user.subscription.plan}` : 'Ma lihid Premium'}</p>
               </div>
            </div>
            <button onClick={onSubscribe} className="px-5 py-2.5 bg-gray-50 dark:bg-navy-900 text-[9px] font-black uppercase tracking-widest rounded-xl text-navy-800 dark:text-gray-300 border border-gray-100 dark:border-navy-700 active:scale-95 transition-all">{user?.subscription?.status === 'ACTIVE' ? 'Manage' : 'Upgrade'}</button>
          </div>
        </section>

        {/* My Enrolled Courses */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-navy-800 dark:text-white tracking-tight">Koorsooyinkayga</h2>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{enrolledCoursesData.length} Courses</span>
          </div>
          <div className="space-y-4">
            {enrolledCoursesData.length > 0 ? enrolledCoursesData.map(course => (
              <div key={course.courseId} className="bg-white dark:bg-navy-800 p-4 rounded-[2rem] border border-gray-100 dark:border-navy-700 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md"><img src={course.thumbnail} alt="" className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-xs font-black text-navy-800 dark:text-white truncate mb-1">{course.title}</h3>
                   <div className="flex items-center justify-between mb-1.5"><span className="text-[8px] text-gray-400 font-bold uppercase">{user?.progress[course.courseId]}% Dhameeyey</span></div>
                   <div className="w-full bg-gray-50 dark:bg-navy-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-somaliGreen-500 h-full transition-all duration-1000" style={{ width: `${user?.progress[course.courseId] || 0}%` }}></div>
                   </div>
                </div>
              </div>
            )) : <div className="text-center py-10 opacity-30"><p className="text-[10px] font-black uppercase tracking-widest">Wali koorso maadan bilaabin</p></div>}
          </div>
        </section>

        {/* Settings Group */}
        <section>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Settings & App</h2>
          <div className="bg-white dark:bg-navy-800 rounded-[2.5rem] border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
            <button onClick={onToggleLang} className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-50 dark:border-navy-900/50 active:bg-gray-50 dark:active:bg-navy-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center"><i className="fas fa-globe"></i></div>
                <div className="text-left"><p className="text-xs font-black dark:text-white">Luuqadda / Language</p><p className="text-[9px] text-gray-400 font-bold uppercase">{language}</p></div>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
            </button>

            <button onClick={onToggleTheme} className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-50 dark:border-navy-900/50 active:bg-gray-50 dark:active:bg-navy-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center"><i className={`fas ${darkMode ? 'fa-moon' : 'fa-sun'}`}></i></div>
                <div className="text-left"><p className="text-xs font-black dark:text-white">Qaabka Screen-ka</p><p className="text-[9px] text-gray-400 font-bold uppercase">{darkMode ? 'Dark Mode' : 'Light Mode'}</p></div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-somaliGreen-500' : 'bg-gray-200'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`}></div></div>
            </button>

            <button onClick={() => setActiveModal('privacy')} className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-50 dark:border-navy-900/50 active:bg-gray-50 dark:active:bg-navy-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-somaliGreen-500 rounded-xl flex items-center justify-center"><i className="fas fa-user-lock"></i></div>
                <p className="text-xs font-black dark:text-white">Xeerka Ilaalinta (Privacy)</p>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
            </button>

            <button onClick={() => setActiveModal('terms')} className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-50 dark:border-navy-900/50 active:bg-gray-50 dark:active:bg-navy-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-xl flex items-center justify-center"><i className="fas fa-file-contract"></i></div>
                <p className="text-xs font-black dark:text-white">Shuruudaha Adeegga (Terms)</p>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
            </button>

            {user?.role === UserRole.ADMIN && (
               <button onClick={onNavigateAdmin} className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-50 dark:border-navy-900/50 active:bg-gray-50 dark:active:bg-navy-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center"><i className="fas fa-user-shield"></i></div>
                  <p className="text-xs font-black dark:text-white">Admin Dashboard</p>
                </div>
                <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
              </button>
            )}

            <button onClick={onLogout} className="w-full px-6 py-6 flex items-center justify-center gap-3 text-red-500 active:bg-red-50 dark:active:bg-red-900/10 transition-colors">
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-xs font-black uppercase tracking-widest">Kabax Account-ka</span>
            </button>
          </div>
        </section>

        <div className="text-center py-10 opacity-30">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Yaaldug Version 2.4.0 • Abdisalam Yusuf</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProfileScreen;
