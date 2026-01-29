import React, { useState } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';

interface CourseListScreenProps {
  courses: Course[];
  onNavigateCourse: (id: string) => void;
}

const CourseListScreen: React.FC<CourseListScreenProps> = ({ courses, onNavigateCourse }) => {
  const [activeFilter, setActiveFilter] = useState('Dhammaan');

  const filters = ['Dhammaan', 'Dugsi', 'Skills', 'Ganacsi'];
  
  const filteredCourses = courses.filter(c => 
    activeFilter === 'Dhammaan' || c.category === activeFilter
  );

  return (
    <div className="p-5 animate-fadeIn">
      <h1 className="text-2xl font-black text-navy-800 dark:text-white mb-6 tracking-tight">Koorsooyinka</h1>

      {/* Filters */}
      <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === f 
                ? 'bg-somaliGreen-500 text-white shadow-lg shadow-somaliGreen-500/20 transform scale-105' 
                : 'bg-gray-100 dark:bg-navy-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-navy-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard 
              key={course.courseId} 
              course={course} 
              onClick={() => onNavigateCourse(course.courseId)} 
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-32 text-gray-400">
            <div className="w-20 h-20 bg-gray-50 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-folder-open text-3xl opacity-20"></i>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Wax koorso ah lagama helin halkan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListScreen;