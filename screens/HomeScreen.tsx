
import React, { useState, useMemo } from 'react';
import { Course, User } from '../types';
import CourseCard from '../components/CourseCard';

interface HomeScreenProps {
  courses: Course[];
  user: User | null;
  onNavigateCourse: (id: string) => void;
  onNavigateToCourses: () => void;
  onNavigateToAITutor: (message?: string) => void;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'lesson' | 'cert' | 'promo';
  unread: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ courses, user, onNavigateCourse, onNavigateToCourses, onNavigateToAITutor }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickQuestion, setQuickQuestion] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const mockNotifications: Notification[] = [
    { id: '1', title: 'Cashar Cusub!', desc: 'Cashar cusub ayaa lagu daray koorsada "Xisaabta".', time: '2h ago', type: 'lesson', unread: true },
    { id: '2', title: 'Shahaado Diyaar ah', desc: 'Hambalyo! Shahaadadaada Tignoolajiyada waa diyaar.', time: '1d ago', type: 'cert', unread: false },
    { id: '3', title: 'Qiimo Dhimis', desc: 'Hel 20% dhimis koorsooyinka Ganacsiga toddobaadkan.', time: '2d ago', type: 'promo', unread: false },
  ];

  const continueCourse = useMemo(() => {
    if (!user || !user.enrolledCourses.length) return null;
    const inProgress = (Object.entries(user.progress) as [string, number][])
      .filter(([id, p]) => p > 0 && p < 100)
      .sort((a, b) => b[1] - a[1]);
    
    const targetId = inProgress.length > 0 ? inProgress[0][0] : user.enrolledCourses[0];
    return courses.find(c => c.courseId === targetId);
  }, [user, courses]);

  const popularCourses = useMemo(() => courses.slice().reverse().slice(0, 4), [courses]);
  const recommendedCourses = useMemo(() => {
    if (!user) return courses.slice(0, 4);
    return courses.filter(c => !user.completedLessons.some(lId => c.lessons.some(cl => cl.lessonId === lId))).slice(0, 4);
  }, [user, courses]);

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      onNavigateToAITutor(quickQuestion);
      setQuickQuestion('');
      setIsModalOpen(false);
    }
  };

  const categories = [
    { name: 'Koorsooyin', icon: 'fa-graduation-cap', color: 'bg-blue-100 text-blue-600' },
    { name: 'Dugsi', icon: 'fa-mosque', color: 'bg-green-100 text-green-600' },
    { name: 'Xirfado', icon: 'fa-lightbulb', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Ganacsi', icon: 'fa-chart-line', color: 'bg-purple-100 text-purple-600' }
  ];

  const partners = [
    { name: 'SIMAD University', icon: 'fa-university' },
    { name: 'Mogadishu Uni', icon: 'fa-school' },
    { name: 'Somali Tech Hub', icon: 'fa-microchip' },
    { name: 'EDNA Hospital', icon: 'fa-hospital' }
  ];

  const testimonials = [
    { name: 'Khaalid Bile', quote: 'Yaaldug waxay iga caawisay inaan barto Coding anigoo jooga gurigayga. Aad ayaan ugu mahadnaqayaa.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaalid' },
    { name: 'Hani Yusuf', quote: 'Casharada xisaabta ee Macalin Ahmed waa kuwa ugu cad ee aan abid arkay. Yaaldug waa mustaqbalka.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hani' }
  ];

  return (
    <div className="animate-fadeIn pb-32 bg-gray-50 dark:bg-navy-900 min-h-screen overflow-x-hidden">
      
      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-[110] animate-fadeIn">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-navy-800 shadow-2xl animate-slideInRight flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-navy-700 flex justify-between items-center">
              <h3 className="font-black text-navy-800 dark:text-white uppercase tracking-widest text-xs">Ogeysiisyada</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-navy-900"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockNotifications.map(n => (
                <div key={n.id} className={`p-4 rounded-2xl border ${n.unread ? 'bg-somaliGreen-50/50 border-somaliGreen-100 dark:bg-somaliGreen-900/10 dark:border-somaliGreen-900/30' : 'bg-gray-50 dark:bg-navy-900/50 border-transparent'} transition-all`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-somaliGreen-600 uppercase tracking-widest">{n.title}</span>
                    <span className="text-[8px] text-gray-400 font-bold">{n.time}</span>
                  </div>
                  <p className="text-xs font-medium text-navy-900 dark:text-gray-200 leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center animate-fadeIn">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-navy-800 rounded-t-[3rem] p-8 shadow-2xl animate-slideUp">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-navy-700 rounded-full mx-auto mb-8"></div>
            <h3 className="text-xl font-black text-navy-800 dark:text-white mb-6 text-center">Sifee Raadinta</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Qaybta (Category)</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Skills', 'Dugsi', 'Ganacsi'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilterCategory(c)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${filterCategory === c ? 'bg-somaliGreen-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-navy-900 text-gray-500'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nooca (Type)</label>
                <div className="flex gap-2">
                  {['All', 'Free', 'Premium'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${filterType === t ? 'bg-navy-900 text-white shadow-lg' : 'bg-gray-100 dark:bg-navy-900 text-gray-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full bg-somaliGreen-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-somaliGreen-500/20 active:scale-95 transition-all mt-4"
              >
                Codso Filter-ka
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-navy-800 p-6 pt-10 rounded-b-[3rem] shadow-sm mb-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-navy-800 dark:text-white tracking-tighter">Yaaldug</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Learning Hub</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative w-12 h-12 rounded-2xl bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-navy-800 dark:text-white shadow-sm active:scale-90 transition-transform"
            >
              <i className="fas fa-bell"></i>
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-navy-800"></span>
            </button>
          </div>
        </header>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-somaliGreen-500 transition-colors"></i>
            <input 
              type="text"
              placeholder="Maxaad rabtaa inaad barato?..."
              className="w-full bg-gray-50 dark:bg-navy-900 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-somaliGreen-500 transition-all outline-none shadow-inner dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${filterCategory !== 'All' || filterType !== 'All' ? 'bg-somaliGreen-500 text-white shadow-somaliGreen-500/20' : 'bg-gray-50 dark:bg-navy-900 text-gray-400'}`}
          >
            <i className="fas fa-sliders-h"></i>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-10">
        
        {/* Trust Stats Section */}
        <section className="bg-navy-900 rounded-[2.5rem] p-6 text-white grid grid-cols-3 gap-2 shadow-xl">
          <div className="text-center">
            <span className="block text-xl font-black text-somaliGreen-400">12K+</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Arday</span>
          </div>
          <div className="text-center border-x border-white/10">
            <span className="block text-xl font-black text-somaliGreen-400">450+</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Koorso</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-black text-somaliGreen-400">100+</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Macalin</span>
          </div>
        </section>

        {/* Continue Learning - Conditional */}
        {user && continueCourse && (
          <section className="animate-slideUp">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-play-circle mr-2 text-somaliGreen-500"></i> Sii wad Barashada
            </h2>
            <div className="bg-white dark:bg-navy-800 p-5 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-navy-700 relative overflow-hidden group">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                  <img src={continueCourse.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-navy-800 dark:text-white truncate mb-1">{continueCourse.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">{user.progress[continueCourse.courseId]}% Dhameeyey</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-navy-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-somaliGreen-500 h-full transition-all duration-1000" 
                      style={{ width: `${user.progress[continueCourse.courseId]}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateCourse(continueCourse.courseId)}
                  className="w-10 h-10 bg-somaliGreen-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <i className="fas fa-play text-xs"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        <section>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => { setFilterCategory(cat.name === 'Koorsooyin' ? 'All' : (cat.name === 'Xirfado' ? 'Skills' : cat.name)); onNavigateToCourses(); }}
                className="flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-[1.5rem] ${cat.color} flex items-center justify-center mb-2 shadow-sm transition-all group-active:scale-90 group-hover:shadow-md`}>
                  <i className={`fas ${cat.icon} text-lg`}></i>
                </div>
                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended For You */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-navy-800 dark:text-white tracking-tight">Adiga kuu gaar ah</h2>
            <button className="text-somaliGreen-500 text-[10px] font-black uppercase tracking-widest" onClick={onNavigateToCourses}>Arag Dhammaan</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
            {recommendedCourses.map(course => (
              <div key={course.courseId} className="min-w-[240px]">
                <CourseCard course={course} onClick={() => onNavigateCourse(course.courseId)} />
              </div>
            ))}
          </div>
        </section>

        {/* Partner Institutions Section */}
        <section>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">La-hawlgalayaasha</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {partners.map((partner, i) => (
              <div key={i} className="flex items-center gap-2 bg-white dark:bg-navy-800 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-navy-700 shrink-0">
                <i className={`fas ${partner.icon} text-somaliGreen-500 text-xs`}></i>
                <span className="text-[10px] font-black text-navy-800 dark:text-white whitespace-nowrap">{partner.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Banner */}
        <div 
          onClick={() => onNavigateToAITutor()}
          className="bg-navy-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-2xl cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="z-10 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-somaliGreen-500 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black uppercase tracking-widest text-somaliGreen-400">AI Tutor Available</span>
            </div>
            <h3 className="font-black text-2xl mb-2 tracking-tight">Weydii su'aal kasta</h3>
            <p className="text-[11px] opacity-60 mb-6 font-medium max-w-[160px] leading-relaxed">Barashada maanta waa mid sahlan oo ku hadlaysa Afkaaga Hooyo.</p>
            <div className="flex items-center gap-3">
               <div className="bg-white text-navy-900 text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest shadow-xl">Bilaaw</div>
               <div className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center">
                  <i className="fas fa-microphone text-xs"></i>
               </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-10">
             <i className="fas fa-robot text-[180px] rotate-12"></i>
          </div>
        </div>

        {/* Student Testimonials */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-navy-800 dark:text-white tracking-tight">Maxay Ardaydu leeyihiin?</h2>
            <i className="fas fa-quote-right text-somaliGreen-500/30"></i>
          </div>
          <div className="space-y-4">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white dark:bg-navy-800 p-5 rounded-[2rem] border border-gray-100 dark:border-navy-700 shadow-sm relative">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-300 italic mb-4 leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={test.avatar} className="w-8 h-8 rounded-full bg-gray-100" alt={test.name} />
                  <div>
                    <h4 className="text-[10px] font-black text-navy-800 dark:text-white uppercase">{test.name}</h4>
                    <span className="text-[8px] text-somaliGreen-500 font-black uppercase tracking-widest">Verified Student</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Courses */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-navy-800 dark:text-white tracking-tight">Koorsooyinka ugu Sareeya</h2>
            <i className="fas fa-fire text-orange-500"></i>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularCourses.map(course => (
              <CourseCard 
                key={course.courseId} 
                course={course} 
                onClick={() => onNavigateCourse(course.courseId)} 
              />
            ))}
          </div>
        </section>

        <div className="text-center py-10 opacity-30">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Yaaldug Learning • Trusted by 12,000+ Somali Students</p>
        </div>

      </div>

      <div className="fixed bottom-24 right-6 flex flex-col items-end gap-3 z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-somaliGreen-500 text-white rounded-[1.5rem] shadow-2xl shadow-somaliGreen-500/40 flex items-center justify-center text-2xl active:scale-90 transition-transform animate-bounce-subtle"
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-navy-800 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-bounceIn border border-gray-100 dark:border-navy-700">
            <div className="w-16 h-16 bg-somaliGreen-50 dark:bg-somaliGreen-900/20 rounded-2xl flex items-center justify-center text-somaliGreen-500 mx-auto mb-6">
              <i className="fas fa-robot text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-navy-800 dark:text-white mb-2 text-center">Weydii Yaaldug AI</h3>
            <p className="text-[10px] text-gray-500 text-center mb-6 uppercase tracking-widest font-black">Expert Teacher Assistance</p>
            
            <form onSubmit={handleQuickQuestionSubmit} className="space-y-4">
              <textarea 
                className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-100 dark:border-navy-700 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-somaliGreen-500 transition-all dark:text-white resize-none font-bold"
                placeholder="Maxaad rabtaa in lagu sharaxo?..."
                rows={4}
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={!quickQuestion.trim()}
                  className="flex-1 bg-somaliGreen-500 text-white font-black py-4 rounded-xl shadow-lg shadow-somaliGreen-500/20 disabled:opacity-50 active:scale-95 transition-all"
                >
                  Dir / Send
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-300 font-bold py-4 rounded-xl active:scale-95 transition-all"
                >
                  Xir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
        @keyframes bounceIn { 0% { transform: scale3d(.3, .3, .3); opacity: 0; } 20% { transform: scale3d(1.1, 1.1, 1.1); } 40% { transform: scale3d(.9, .9, .9); } 60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); } 80% { transform: scale3d(.97, .97, .97); } 100% { opacity: 1; transform: scale3d(1, 1, 1); } }
        .animate-bounceIn { animation: bounceIn 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000); }
      `}</style>

    </div>
  );
};

export default HomeScreen;
