
import React, { useState, useEffect, useRef } from 'react';
import { FAQ, TeacherQA, ChatGroup } from '../types';

const MOCK_FAQS: FAQ[] = [
  { id: '1', question: 'Sidee loo iibsadaa koorso?', answer: 'Waxaad u iibsan kartaa koorsada adiga oo isticmaalaya EVC Plus, ZAAD ama e-Dahab. Markaad doorato koorsada, guji "Unlock" kadibna raac tilmaamaha bixinta lacagta.' },
  { id: '2', question: 'Ma helayaa shahaado markaan dhameeyo?', answer: 'Haa, koorso kasta oo aad 100% dhameyso waxaad si toos ah ugu helaysaa shahaado aad kala soo degto profile-kaaga.' },
  { id: '3', question: 'Internet-ka ma iga cunayaa badan?', answer: 'Yaaldug waxaa loogu talagalay inay si fiican ugu shaqeyso internet-ka daciifka ah. Video-yada sidoo kale waad yareyn kartaa tayadooda.' },
];

const MOCK_TEACHER_QA: TeacherQA[] = [
  {
    id: 't1',
    teacherName: 'Macalin Ahmed',
    teacherTitle: 'Khabiir Xisaabta',
    question: 'Sideen u fahmi karaa casharada adag?',
    answer: 'Waxaan kugula talinayaa inaad casharka daawato dhowr jeer, kadibna aad isticmaasho "Yaaldug AI" si uu kuugu sharaxo meelaha aad ku dhibtootay.',
    category: 'Habka Barashada',
    likes: 124
  },
  {
    id: 't2',
    teacherName: 'Eng. Sahra',
    teacherTitle: 'Tignoolajiyada',
    question: 'Maxay tahay muhiimada barashada Coding-ka?',
    answer: 'Coding-ka waa luuqadda mustaqbalka. Waxay ku baraysaa sida loo xaliyo dhibaatooyinka iyo sidii aad u abuuri lahayd mustaqbal shaqo oo wanaagsan.',
    category: 'Mustaqbalka',
    likes: 89
  }
];

const MOCK_GROUPS: ChatGroup[] = [
  { id: 'g1', name: 'Ardayda coding-ka', description: 'Wada hadalka ardayda baranaysa programming-ka.', icon: 'fa-code', membersCount: 1250, isLocked: false },
  { id: 'g2', name: 'Imtixaanaadka Qaranka', description: 'U diyaar garowga imtixaanka fasalka 12-aad.', icon: 'fa-book-open', membersCount: 840, isLocked: false },
  { id: 'g3', name: 'Ganacsiga & Maalgalinta', description: 'Kooxda dooda ganacsiga casriga ah.', icon: 'fa-chart-line', membersCount: 520, isLocked: true },
];

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'groups' | 'qa' | 'support'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [supportMsg, setSupportMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', text: 'Asc! Ku soo dhowaw taageerada Yaaldug. Sideen kuu caawin karnaa?', sender: 'support', time: '10:00 AM' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: supportMsg,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMsg]);
    setSupportMsg('');

    // Simulated reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Mahadsanid fariintaada. Kooxdayada ayaa ku soo jawaabi doona dhowaan.',
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 animate-fadeIn pb-32">
      {/* Header */}
      <div className="bg-white dark:bg-navy-800 p-6 pt-12 rounded-b-[3.5rem] shadow-sm mb-6 border-b border-gray-100 dark:border-navy-700">
        <h1 className="text-2xl font-black text-navy-800 dark:text-white tracking-tight text-center mb-6">Bulshada Yaaldug</h1>
        
        <div className="flex bg-gray-100 dark:bg-navy-900 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'faq', label: 'Su\'aalo' },
            { id: 'groups', label: 'Kooxaha' },
            { id: 'qa', label: 'Talooyin' },
            { id: 'support', label: 'Caawimo' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-navy-800 text-somaliGreen-500 shadow-sm' : 'text-gray-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-slideUp">
            {MOCK_FAQS.map(faq => (
              <div 
                key={faq.id} 
                className="bg-white dark:bg-navy-800 rounded-3xl border border-gray-100 dark:border-navy-700 overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-bold text-navy-800 dark:text-white leading-tight pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedFaq === faq.id ? 'bg-somaliGreen-500 text-white rotate-180' : 'bg-gray-50 dark:bg-navy-900 text-gray-400'}`}>
                    <i className="fas fa-chevron-down text-[10px]"></i>
                  </div>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-5 pb-5 animate-fadeIn">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-navy-700 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-4 animate-slideUp">
            <div className="bg-navy-900 rounded-3xl p-6 text-white mb-6">
              <h3 className="text-sm font-black mb-2">Kooxaha Ardayda (Phase 2)</h3>
              <p className="text-[10px] opacity-60">Kooxahani waa meesha aad kula kulmi lahayd ardayda kale.</p>
            </div>
            {MOCK_GROUPS.map(group => (
              <div key={group.id} className="bg-white dark:bg-navy-800 p-5 rounded-3xl border border-gray-100 dark:border-navy-700 shadow-sm flex items-center gap-4 relative group">
                <div className="w-12 h-12 bg-somaliGreen-50 dark:bg-somaliGreen-900/20 rounded-2xl flex items-center justify-center text-somaliGreen-500">
                  <i className={`fas ${group.icon} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black dark:text-white truncate">{group.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{group.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest"><i className="fas fa-users mr-1"></i> {group.membersCount} Arday</span>
                  </div>
                </div>
                {group.isLocked ? (
                  <i className="fas fa-lock text-gray-300"></i>
                ) : (
                  <button className="text-[10px] font-black text-somaliGreen-500 uppercase tracking-widest bg-somaliGreen-50 dark:bg-somaliGreen-900/20 px-4 py-2 rounded-xl active:scale-95 transition-all">
                    Ku biir
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-6 animate-slideUp">
            {MOCK_TEACHER_QA.map(qa => (
              <div key={qa.id} className="bg-white dark:bg-navy-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-navy-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-somaliGreen-500 rounded-xl flex items-center justify-center text-white">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black dark:text-white leading-none">{qa.teacherName}</h4>
                    <p className="text-[9px] text-somaliGreen-500 font-bold uppercase tracking-widest mt-1">{qa.teacherTitle}</p>
                  </div>
                  <span className="ml-auto text-[8px] bg-gray-50 dark:bg-navy-900 text-gray-400 font-black px-2 py-1 rounded-lg uppercase tracking-tight">
                    {qa.category}
                  </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-navy-900 rounded-2xl p-4 mb-4 border border-gray-100 dark:border-navy-700/50">
                  <p className="text-xs font-black text-navy-800 dark:text-white italic mb-2">"{qa.question}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-gray-400">
                  <button className="flex items-center gap-1.5 hover:text-somaliGreen-500 transition-colors">
                    <i className="far fa-heart text-xs text-red-400"></i>
                    <span className="text-[10px] font-black">{qa.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-navy-500 transition-colors ml-auto">
                    <i className="far fa-share-square text-xs"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="animate-fadeIn flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 no-scrollbar">
              {chatHistory.map(chat => (
                <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${chat.sender === 'user' ? 'bg-somaliGreen-500 text-white rounded-br-none' : 'bg-white dark:bg-navy-800 text-navy-800 dark:text-white rounded-bl-none border border-gray-100 dark:border-navy-700'}`}>
                    <p className="text-xs font-bold leading-relaxed">{chat.text}</p>
                    <span className={`text-[8px] mt-2 block opacity-50 font-black ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>{chat.time}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendSupport} className="bg-white dark:bg-navy-800 p-3 rounded-3xl border border-gray-100 dark:border-navy-700 shadow-xl flex items-center gap-2">
              <input 
                className="flex-1 bg-transparent border-none py-3 px-4 text-sm outline-none dark:text-white font-bold"
                placeholder="Ku qor halkan..."
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!supportMsg.trim()}
                className="w-12 h-12 bg-somaliGreen-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CommunityScreen;
