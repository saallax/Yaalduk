
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-navy-800 rounded-xl overflow-hidden border border-gray-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isPremium ? (
            <span className="bg-yellow-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
              Premium
            </span>
          ) : (
            <span className="bg-somaliGreen-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
              Bilaash
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-black text-somaliGreen-500 uppercase tracking-tighter">{course.category}</span>
          <div className="flex items-center text-[9px] text-yellow-500 font-bold">
            <i className="fas fa-star mr-1"></i> 4.9
          </div>
        </div>
        <h3 className="text-sm font-black text-navy-800 dark:text-gray-100 line-clamp-2 leading-tight h-10 mb-2 tracking-tight">
          {course.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center font-bold">
            <i className="fas fa-user-circle mr-1.5 opacity-40"></i> {course.instructor}
            <i className="fas fa-check-circle ml-1.5 text-blue-500 text-[8px]" title="Verified Macalin"></i>
          </p>
          <span className="text-[9px] text-gray-300 font-black">{course.lessons.length} Lns</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
