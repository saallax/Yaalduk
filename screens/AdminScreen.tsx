
import React, { useState, useMemo } from 'react';
import { Course, Lesson, User, UserRole, Category, Payment, PaymentStatus, AuditLog, PaymentMethod, ContentBlock } from '../types';
import { MOCK_USERS, MOCK_CATEGORIES, MOCK_PAYMENTS, MOCK_AUDIT_LOGS } from '../mockData';

interface AdminScreenProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  onBack: () => void;
}

type AdminTab = 'analytics' | 'builder' | 'finance' | 'security';

const AdminScreen: React.FC<AdminScreenProps> = ({ courses, onUpdateCourses, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  const selectedCourse = courses.find(c => c.courseId === selectedCourseId);

  const addContentBlock = (lessonId: string, type: string) => {
    const updatedCourses = courses.map(c => {
      if (c.courseId === selectedCourseId) {
        const updatedLessons = c.lessons.map(l => {
          if (l.lessonId === lessonId) {
            const newBlock: ContentBlock = {
              id: 'b' + Date.now(),
              type: type as any,
              title: 'New ' + type,
              body: type === 'text' ? 'Gali qoraalka halkan...' : undefined
            };
            return { ...l, contentBlocks: [...l.contentBlocks, newBlock] };
          }
          return l;
        });
        return { ...c, lessons: updatedLessons };
      }
      return c;
    });
    onUpdateCourses(updatedCourses);
  };

  const renderBuilder = () => (
    <div className="space-y-6 animate-fadeIn">
      {!selectedCourseId ? (
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xulo Kursi aad dhiseyso</h2>
          {courses.map(c => (
            <button 
              key={c.courseId} 
              onClick={() => setSelectedCourseId(c.courseId)}
              className="w-full bg-white dark:bg-navy-800 p-5 rounded-3xl flex items-center justify-between border border-gray-100 dark:border-navy-700 shadow-sm"
            >
              <div className="flex items-center gap-4 text-left">
                <img src={c.thumbnail} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div>
                  <h3 className="text-xs font-black dark:text-white uppercase">{c.title}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{c.lessons.length} Lessons</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-300"></i>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8 pb-32">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedCourseId(null)} className="text-somaliGreen-500 text-[10px] font-black uppercase"><i className="fas fa-arrow-left mr-2"></i> Koorsooyinka</button>
            <h2 className="text-xs font-black dark:text-white uppercase truncate max-w-[150px]">{selectedCourse?.title}</h2>
          </div>

          {selectedCourse?.lessons.map(lesson => (
            <div key={lesson.lessonId} className="bg-white dark:bg-navy-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-navy-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black dark:text-white">{lesson.title}</h3>
                <span className="text-[10px] bg-gray-50 dark:bg-navy-900 text-gray-400 font-black px-3 py-1 rounded-lg">Part {lesson.order}</span>
              </div>
              
              <div className="space-y-4 mb-8">
                {lesson.contentBlocks.map(block => (
                  <div key={block.id} className="bg-gray-50 dark:bg-navy-900/50 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-navy-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-900 text-white rounded-lg flex items-center justify-center text-[10px]">
                        <i className={`fas ${block.type === 'video' ? 'fa-video' : block.type === 'text' ? 'fa-font' : block.type === 'quiz' ? 'fa-tasks' : 'fa-paperclip'}`}></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black dark:text-white uppercase">{block.type}</p>
                        <p className="text-[8px] text-gray-400 font-bold truncate max-w-[150px]">{block.title || 'No Title'}</p>
                      </div>
                    </div>
                    <button className="text-red-400 p-2"><i className="fas fa-trash-alt text-xs"></i></button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['video', 'text', 'gallery', 'quiz'].map(t => (
                  <button 
                    key={t}
                    onClick={() => addContentBlock(lesson.lessonId, t)}
                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-700 active:scale-95 transition-all"
                  >
                    <i className={`fas ${t === 'video' ? 'fa-video' : t === 'text' ? 'fa-font' : t === 'quiz' ? 'fa-tasks' : 'fa-image'} text-xs text-somaliGreen-500`}></i>
                    <span className="text-[7px] font-black uppercase tracking-tighter">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full bg-navy-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl"><i className="fas fa-plus mr-2"></i> Add New Lesson</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 pb-20">
      <header className="bg-navy-900 text-white p-6 pt-10 rounded-b-[3.5rem] sticky top-0 z-50 shadow-xl overflow-hidden">
        <div className="relative flex justify-between items-center mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tight uppercase">Admin Panel</h1>
          </div>
          <div className="w-10 h-10"></div>
        </div>
        
        <div className="flex space-x-8 overflow-x-auto no-scrollbar pb-2 px-2">
          {[
            { id: 'analytics', label: 'Summary', icon: 'fa-chart-pie' },
            { id: 'builder', label: 'Builder', icon: 'fa-tools' },
            { id: 'finance', label: 'Payments', icon: 'fa-hand-holding-usd' },
            { id: 'security', label: 'Security', icon: 'fa-lock' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex flex-col items-center min-w-[60px] transition-all ${activeTab === tab.id ? 'opacity-100 scale-110' : 'opacity-40'}`}
            >
              <i className={`fas ${tab.icon} text-sm mb-1.5`}></i>
              <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        {activeTab === 'analytics' && <div className="text-center py-20 opacity-30 text-xs font-black uppercase tracking-widest">Analytics Dashboard...</div>}
        {activeTab === 'builder' && renderBuilder()}
        {activeTab === 'finance' && <div className="text-center py-20 opacity-30 text-xs font-black uppercase tracking-widest">Finance Module...</div>}
        {activeTab === 'security' && <div className="text-center py-20 opacity-30 text-xs font-black uppercase tracking-widest">Security Audit...</div>}
      </main>
    </div>
  );
};

export default AdminScreen;
