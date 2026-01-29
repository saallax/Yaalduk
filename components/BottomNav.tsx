
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (screen: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: 'fa-home', label: 'Hore' },
    { id: 'courses', icon: 'fa-book-open', label: 'Koorso' },
    { id: 'community', icon: 'fa-users', label: 'Bulsho' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-navy-800 border-t border-gray-200 dark:border-navy-700 flex justify-around py-2 px-4 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === tab.id 
              ? 'text-somaliGreen-500' 
              : 'text-gray-400 dark:text-gray-500 hover:text-navy-500 dark:hover:text-navy-400'
          }`}
        >
          <i className={`fas ${tab.icon} text-xl mb-1`}></i>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
