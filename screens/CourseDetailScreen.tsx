
import React, { useState, useRef, useEffect } from 'react';
import { User, Lesson, Course, UserRole, ContentBlock } from '../types';

interface CourseDetailScreenProps {
  courseId: string;
  courses: Course[];
  user: User | null;
  onBack: () => void;
  onToggleLesson: (courseId: string, lessonId: string) => void;
  onAskAI: (message: string) => void;
  onUnlock: (course: Course) => void;
}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ courseId, courses, user, onBack, onToggleLesson, onAskAI, onUnlock }) => {
  const course = courses.find(c => c.courseId === courseId);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<Record<string, number | null>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  if (!course || course.lessons.length === 0) {
    return (
      <div className="p-10 text-center dark:text-white flex flex-col items-center justify-center min-h-screen">
        <i className="fas fa-exclamation-circle text-6xl text-gray-200 mb-6"></i>
        <h2 className="text-xl font-black mb-2">Kursiga lama helin</h2>
        <button onClick={onBack} className="bg-navy-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest mt-6">Ku laabo</button>
      </div>
    );
  }

  const hasPaid = user?.enrolledCourses.includes(course.courseId) || user?.role === UserRole.ADMIN;
  const currentLesson = course.lessons[activeLessonIndex];
  const isLessonLocked = course.isPremium && !hasPaid && !currentLesson.isPreview;
  const progress = user?.progress[courseId] || 0;

  // Handle Resuming Video
  useEffect(() => {
    if (user?.lessonResumes?.[currentLesson.lessonId]) {
      // Find video block if any and seek
      const videoBlock = currentLesson.contentBlocks.find(b => b.type === 'video');
      if (videoBlock && videoRefs.current[videoBlock.id]) {
        videoRefs.current[videoBlock.id]!.currentTime = user.lessonResumes[currentLesson.lessonId];
      }
    }
  }, [currentLesson.lessonId, user]);

  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'video':
        return (
          <div key={block.id} className="mb-8 overflow-hidden rounded-[2rem] bg-black shadow-2xl">
            <video 
              ref={el => videoRefs.current[block.id] = el}
              src={block.videoUrl} 
              poster={block.thumbnail}
              controls 
              className="w-full aspect-video"
              onTimeUpdate={(e) => {
                // In a real app, we would debounced-save this to the server/localStorage
                // localStorage.setItem(`resume-${currentLesson.lessonId}`, e.currentTarget.currentTime.toString());
              }}
            />
            <div className="p-4 bg-navy-900 flex justify-between items-center text-white">
               <span className="text-[10px] font-black uppercase tracking-widest">{block.title || 'Cashar Video'}</span>
               <div className="flex gap-2">
                  {block.resolutions?.map(res => (
                    <button key={res} className="text-[8px] border border-white/20 px-2 py-0.5 rounded uppercase hover:bg-white/10">{res}</button>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={block.id} className={`mb-8 p-6 rounded-3xl ${block.isNote ? 'bg-somaliGreen-50 dark:bg-somaliGreen-900/10 border-l-4 border-somaliGreen-500' : 'bg-white dark:bg-navy-800 shadow-sm'}`}>
            {block.title && <h3 className="text-sm font-black text-navy-800 dark:text-white mb-3 uppercase tracking-tight">{block.title}</h3>}
            <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
               {block.body}
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div key={block.id} className="mb-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{block.title}</h3>
            <div className="grid grid-cols-2 gap-3">
              {block.images?.map((img, idx) => (
                <div key={idx} className="relative group cursor-pointer" onClick={() => setShowLightbox(img.url)}>
                  <img src={img.url} className="w-full h-32 object-cover rounded-2xl shadow-sm group-hover:opacity-90 transition-opacity" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                    <i className="fas fa-search-plus text-white text-lg"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'file':
        return (
          <div key={block.id} className="mb-8 bg-navy-900 rounded-3xl p-5 flex items-center justify-between text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-pdf text-red-400"></i>
              </div>
              <div>
                <p className="text-xs font-black truncate max-w-[150px]">{block.fileName}</p>
                <p className="text-[9px] opacity-60 uppercase tracking-widest">{block.fileSize} • {block.fileType}</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-somaliGreen-500 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
               <i className="fas fa-download text-xs"></i>
            </button>
          </div>
        );
      case 'quiz':
        return (
          <div key={block.id} className="mb-8 bg-white dark:bg-navy-800 rounded-[2rem] p-6 border border-gray-100 dark:border-navy-700 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white"><i className="fas fa-tasks text-xs"></i></div>
               <h3 className="text-xs font-black dark:text-white uppercase tracking-tight">{block.title || 'Kedis Sugan'}</h3>
             </div>
             {block.questions?.map((q, qIdx) => (
               <div key={qIdx} className="space-y-3">
                  <p className="text-xs font-bold dark:text-gray-200 mb-4">{q.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button 
                        key={oIdx} 
                        onClick={() => setQuizResults({ ...quizResults, [block.id]: oIdx })}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${quizResults[block.id] === oIdx ? (oIdx === q.correct ? 'bg-somaliGreen-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-50 dark:bg-navy-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-900/50'}`}
                      >
                        {quizResults[block.id] === oIdx && <i className={`fas ${oIdx === q.correct ? 'fa-check' : 'fa-times'} mr-2`}></i>}
                        {opt}
                      </button>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-navy-900 min-h-screen pb-44 animate-fadeIn">
      
      {showLightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6" onClick={() => setShowLightbox(null)}>
           <img src={showLightbox} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" alt="" />
           <button className="mt-8 text-white font-black uppercase tracking-widest text-[10px] border-b border-white/20 pb-1">Xir / Close</button>
        </div>
      )}

      {/* Lesson Progress View */}
      <div className="bg-white dark:bg-navy-800 p-8 pt-12 rounded-b-[3.5rem] shadow-sm mb-6 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-navy-900 flex items-center justify-center"><i className="fas fa-arrow-left"></i></button>
          <div className="text-center">
            <h2 className="text-sm font-black dark:text-white truncate max-w-[180px]">{currentLesson.title}</h2>
            <p className="text-[8px] font-black text-somaliGreen-500 uppercase tracking-widest mt-1">Casharka {activeLessonIndex + 1} ee {course.lessons.length}</p>
          </div>
          <button onClick={() => onAskAI(`Ma ii sharaxi kartaa casharkan: ${currentLesson.title}`)} className="w-10 h-10 rounded-full bg-somaliGreen-50 dark:bg-somaliGreen-900/20 text-somaliGreen-500 flex items-center justify-center"><i className="fas fa-robot text-sm"></i></button>
        </div>
        <div className="w-full bg-gray-100 dark:bg-navy-900 h-1.5 rounded-full overflow-hidden">
           <div className="h-full bg-somaliGreen-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="px-6">
        {isLessonLocked ? (
          <div className="py-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center text-white text-3xl mb-6 shadow-2xl animate-pulse"><i className="fas fa-lock"></i></div>
             <h2 className="text-xl font-black dark:text-white mb-2">Si aad u barato...</h2>
             <p className="text-xs text-gray-500 mb-8 px-8">Casharkan waa mid Premium ah. Fadlan ku biir ardayda Premium-ka ah si aad u hesho dhammaan casharada.</p>
             <button onClick={() => onUnlock(course)} className="bg-somaliGreen-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">Unlock Course</button>
          </div>
        ) : (
          <div className="animate-slideUp">
            {currentLesson.contentBlocks.map(renderContentBlock)}
            
            <div className="pt-10 pb-20">
               <button 
                 onClick={() => onToggleLesson(courseId, currentLesson.lessonId)}
                 className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-[0.98] ${user?.completedLessons.includes(currentLesson.lessonId) ? 'bg-white dark:bg-navy-800 text-somaliGreen-500 border border-somaliGreen-500/20' : 'bg-somaliGreen-500 text-white shadow-somaliGreen-500/20'}`}
               >
                 <i className={`fas ${user?.completedLessons.includes(currentLesson.lessonId) ? 'fa-check-double' : 'fa-check'} mr-3`}></i>
                 {user?.completedLessons.includes(currentLesson.lessonId) ? 'Casharku waa dhameystiran yahay' : 'Calaamadi inuu dhamaaday'}
               </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Dhammaan Casharada</h3>
           {course.lessons.map((lesson, idx) => (
             <button 
               key={lesson.lessonId}
               onClick={() => setActiveLessonIndex(idx)}
               className={`w-full flex items-center p-4 rounded-[1.5rem] border transition-all ${idx === activeLessonIndex ? 'bg-navy-900 text-white border-navy-900 shadow-xl scale-[1.02]' : 'bg-white dark:bg-navy-800 border-transparent dark:text-gray-300'}`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black ${idx === activeLessonIndex ? 'bg-somaliGreen-500 text-white' : 'bg-gray-100 dark:bg-navy-900 text-gray-400'}`}>
                   {user?.completedLessons.includes(lesson.lessonId) ? <i className="fas fa-check text-[10px]"></i> : lesson.order}
                </div>
                <div className="flex-1 text-left min-w-0">
                   <h4 className="text-xs font-bold truncate uppercase">{lesson.title}</h4>
                   <span className="text-[9px] opacity-60 font-black tracking-widest">{lesson.duration} • {lesson.isPreview ? 'Bilaash' : 'Xubnaha'}</span>
                </div>
             </button>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CourseDetailScreen;
