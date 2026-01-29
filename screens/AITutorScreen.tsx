
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface AITutorScreenProps {
  onBack: () => void;
  initialMessage?: string;
  onClearInitial?: () => void;
}

const AITutorScreen: React.FC<AITutorScreenProps> = ({ onBack, initialMessage, onClearInitial }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Asc! Magacaygu waa Yaaldug AI. Waxaan ahay macalinkaaga khaaska ah. Maanta maxaan kaa caawiyaa? Ma cashar baan kuu sharaxaa mise homework ayaan kaa caawiyaa?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialMessage) {
      handleSendRaw(initialMessage);
      if (onClearInitial) onClearInitial();
    }
  }, [initialMessage]);

  const handleSendRaw = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Keep chat history relevant but concise for low-bandwidth
      const filteredHistory = messages.filter(m => m.id !== 'welcome').slice(-6);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: filteredHistory.concat(userMessage).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `Waxaad tahay 'Macalin Yaaldug', macalin khabiir ah oo ardayda Soomaaliyeed ka caawiya waxbarashada. 
          
          Qawaaniintaada:
          1. Marka ardaygu yiraahdo 'Sharax', bixi faahfaahin qoto dheer oo sahlan.
          2. Marka lagu yiraahdo 'Soo koob', soo saar 3-5 qodob oo muhiim ah.
          3. Marka ay timaado 'Homework', ha siin jawaabta tooska ah, laakiin tusi qaabka loo xaliyo (Step-by-step).
          4. Had iyo jeer ku hadal Af-Soomaali dhiirigelin leh, saaxiibtinimo ah, oo fudud.
          5. Haddii su'aashu tahay mid ka baxsan waxbarashada, si asluub leh ugu soo celi mawduuca barashada.`,
          temperature: 0.7,
        },
      });

      const modelText = response.text || 'Waan ka xumahay, khalkhal ayaa ku yimid nidaamka. Fadlan mar kale isku day.';
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        text: 'Waan ka xumahay, xiriirka internet-ka ayaa daciif ah. Fadlan isku day markale.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput('');
    handleSendRaw(textToSend);
  };

  const quickActions = [
    { label: 'Sharax', icon: 'fa-chalkboard-teacher', prompt: 'Ma ii sharaxi kartaa casharka: ', color: 'bg-blue-500' },
    { label: 'Soo Koob', icon: 'fa-compress-alt', prompt: 'Fadlan ii soo koob: ', color: 'bg-purple-500' },
    { label: 'Homework', icon: 'fa-pencil-alt', prompt: 'Iga caawi homework-ga: ', color: 'bg-orange-500' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-navy-900 animate-fadeIn">
      {/* Header */}
      <header className="bg-white dark:bg-navy-800 px-6 py-4 border-b border-gray-100 dark:border-navy-700 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-navy-900 text-gray-500 hover:text-somaliGreen-500 transition-colors mr-3">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex items-center">
            <div className="relative">
              <div className="w-11 h-11 bg-somaliGreen-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-somaliGreen-500/20">
                <i className="fas fa-robot text-lg"></i>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-navy-800 rounded-full"></span>
            </div>
            <div className="ml-3">
              <h1 className="text-sm font-black text-navy-800 dark:text-white tracking-tight leading-none mb-1">Macalin Yaaldug</h1>
              <span className="text-[9px] font-black text-somaliGreen-500 uppercase tracking-widest">Active Tutor</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ id: 'welcome', role: 'model', text: 'Asc! Sidee kale ayaan kuu caawiyaa?', timestamp: new Date() }])}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <i className="fas fa-trash-alt text-xs"></i>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-slideUp`}
          >
            <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div 
                className={`max-w-[85%] p-4 rounded-[1.8rem] shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-somaliGreen-500 text-white rounded-br-none font-medium' 
                    : 'bg-white dark:bg-navy-800 text-navy-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-navy-700 font-bold'
                }`}
              >
                {msg.text}
                <div className={`text-[8px] mt-2 opacity-40 font-black uppercase ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-navy-800 p-4 rounded-[1.5rem] rounded-bl-none border border-gray-100 dark:border-navy-700 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-somaliGreen-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-somaliGreen-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-somaliGreen-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Macalinku waa fikirayaa...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Actions & Input */}
      <div className="bg-white dark:bg-navy-800 border-t border-gray-100 dark:border-navy-700 p-4 pb-8 space-y-4">
        {/* Quick Action Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {quickActions.map((action, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(action.prompt); }}
              className="flex items-center gap-2 whitespace-nowrap bg-gray-50 dark:bg-navy-900 border border-gray-100 dark:border-navy-700 px-4 py-2.5 rounded-2xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:border-somaliGreen-500/50 transition-all active:scale-95 shrink-0"
            >
              <div className={`w-6 h-6 ${action.color} rounded-lg flex items-center justify-center text-white text-[8px]`}>
                <i className={`fas ${action.icon}`}></i>
              </div>
              {action.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="relative flex-1">
             <input 
              type="text"
              className="w-full bg-gray-50 dark:bg-navy-900 border border-gray-100 dark:border-navy-700 rounded-2xl py-4.5 pl-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-somaliGreen-500 transition-all dark:text-white placeholder:text-gray-400 font-bold"
              placeholder="Weydii macalinka..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
               <i className="fas fa-microphone text-sm"></i>
            </div>
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl ${
              !input.trim() || isLoading 
                ? 'bg-gray-100 dark:bg-navy-900 text-gray-300' 
                : 'bg-somaliGreen-500 text-white shadow-somaliGreen-500/20'
            }`}
          >
            <i className={`fas ${isLoading ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
        
        <p className="text-[8px] text-center text-gray-400 font-black uppercase tracking-widest">
           Macalinku wuxuu isticmaalayaa Gemini AI • Wixii cilmi ah Eebe ayaa leh
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AITutorScreen;
