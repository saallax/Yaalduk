
import React, { useState, useEffect } from 'react';
import { User, Course, AppLanguage, Lesson, Payment, Plan } from './types';
import { MOCK_USER, MOCK_COURSES, MOCK_PAYMENTS } from './mockData';

// Screens
import HomeScreen from './screens/HomeScreen';
import CourseListScreen from './screens/CourseListScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import AdminScreen from './screens/AdminScreen';
import AITutorScreen from './screens/AITutorScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PricingScreen from './screens/PricingScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import CommunityScreen from './screens/CommunityScreen';

// Components
import BottomNav from './components/BottomNav';

type Screen = 'home' | 'courses' | 'course-detail' | 'profile' | 'auth' | 'admin' | 'ai-tutor' | 'pricing' | 'history' | 'community';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [checkoutItem, setCheckoutItem] = useState<Course | { title: string, price: number, type: 'subscription' } | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>('Somali');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [aiInitialMessage, setAiInitialMessage] = useState<string | null>(null);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === 'true') {
      setCurrentUser(MOCK_USER);
      setMyPayments(MOCK_PAYMENTS.filter(p => p.userId === MOCK_USER.userId));
      setCurrentScreen('home');
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsGuest(false);
    setMyPayments(MOCK_PAYMENTS.filter(p => p.userId === user.userId));
    setCurrentScreen('home');
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handlePaymentSuccess = (payment: Payment) => {
    if (!currentUser) return;
    
    setMyPayments(prev => [payment, ...prev]);
    
    const updates: Partial<User> = {};
    if (payment.paymentType === 'COURSE_PURCHASE' && payment.courseId) {
      updates.enrolledCourses = [...currentUser.enrolledCourses, payment.courseId];
      if (!currentUser.progress[payment.courseId]) {
        updates.progress = { ...currentUser.progress, [payment.courseId]: 0 };
      }
    } else if (payment.paymentType === 'SUBSCRIPTION') {
      updates.subscription = {
        subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 5),
        userId: currentUser.userId,
        plan: payment.amount > 50 ? 'YEARLY' : 'MONTHLY',
        amount: payment.amount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (payment.amount > 50 ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      };
    }
    
    setCurrentUser({ ...currentUser, ...updates });
    setCheckoutItem(null);
    if (currentScreen !== 'course-detail') {
      setCurrentScreen('profile');
    }
  };

  const navigateToCourse = (id: string) => {
    setSelectedCourseId(id);
    setCurrentScreen('course-detail');
  };

  const handleToggleLesson = (courseId: string, lessonId: string) => {
    if (!currentUser || isGuest) return;
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const isAlreadyCompleted = prevUser.completedLessons.includes(lessonId);
      let updatedCompletedLessons = isAlreadyCompleted ? prevUser.completedLessons.filter(id => id !== lessonId) : [...prevUser.completedLessons, lessonId];
      const course = courses.find(c => c.courseId === courseId);
      if (!course) return prevUser;
      const courseLessons = course.lessons.map(l => l.lessonId);
      const completedInThisCourse = courseLessons.filter(id => updatedCompletedLessons.includes(id)).length;
      const newPercentage = Math.round((completedInThisCourse / courseLessons.length) * 100);
      return { ...prevUser, completedLessons: updatedCompletedLessons, progress: { ...prevUser.progress, [courseId]: newPercentage } };
    });
  };

  const handlePricingPlanSelection = (plan: Plan) => {
    setCheckoutItem({ title: plan.name, price: plan.price, type: 'subscription' });
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} onGuest={() => { setIsGuest(true); setCurrentScreen('home'); }} />;
      case 'home':
        return (
          <HomeScreen 
            courses={courses} 
            user={currentUser}
            onNavigateCourse={navigateToCourse} 
            onNavigateToCourses={() => setCurrentScreen('courses')} 
            onNavigateToAITutor={(msg) => { if (msg) setAiInitialMessage(msg); setCurrentScreen('ai-tutor'); }} 
          />
        );
      case 'courses':
        return <CourseListScreen courses={courses} onNavigateCourse={navigateToCourse} />;
      case 'community':
        return <CommunityScreen />;
      case 'course-detail':
        return (
          <CourseDetailScreen 
            courseId={selectedCourseId || ''} 
            courses={courses}
            user={currentUser} 
            onBack={() => setCurrentScreen('courses')} 
            onToggleLesson={handleToggleLesson}
            onAskAI={(msg) => { setAiInitialMessage(msg); setCurrentScreen('ai-tutor'); }}
            onUnlock={(course) => setCheckoutItem(course)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            user={currentUser} 
            isGuest={isGuest} 
            courses={courses} 
            onLogout={() => { setCurrentUser(null); setCurrentScreen('auth'); }} 
            onToggleTheme={() => setDarkMode(!darkMode)} 
            darkMode={darkMode} 
            onToggleLang={() => setLanguage(language === 'Somali' ? 'English' : 'Somali')} 
            language={language} 
            onNavigateAdmin={() => setCurrentScreen('admin')} 
            onUpdateUser={(u) => setCurrentUser(prev => prev ? {...prev, ...u} : null)} 
            onSubscribe={() => setCurrentScreen('pricing')}
            onViewHistory={() => setCurrentScreen('history')}
          />
        );
      case 'admin':
        return <AdminScreen courses={courses} onUpdateCourses={setCourses} onBack={() => setCurrentScreen('profile')} />;
      case 'ai-tutor':
        return <AITutorScreen onBack={() => setCurrentScreen('home')} initialMessage={aiInitialMessage || undefined} onClearInitial={() => setAiInitialMessage(null)} />;
      case 'pricing':
        return <PricingScreen onSelectPlan={handlePricingPlanSelection} onBack={() => setCurrentScreen('profile')} />;
      case 'history':
        return <TransactionHistoryScreen payments={myPayments} onBack={() => setCurrentScreen('profile')} />;
      default:
        return (
          <HomeScreen 
            courses={courses} 
            user={currentUser}
            onNavigateCourse={navigateToCourse} 
            onNavigateToCourses={() => setCurrentScreen('courses')} 
            onNavigateToAITutor={(msg) => { if (msg) setAiInitialMessage(msg); setCurrentScreen('ai-tutor'); }} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white dark:bg-navy-900 shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-20">
        {checkoutItem && currentUser && (
          <CheckoutScreen 
            item={checkoutItem} 
            onSuccess={handlePaymentSuccess} 
            onCancel={() => setCheckoutItem(null)} 
            userId={currentUser.userId}
            userName={currentUser.name}
            user={currentUser}
          />
        )}
        {renderCurrentScreen()}
      </main>
      
      {!['auth', 'admin', 'pricing', 'history', 'course-detail'].includes(currentScreen) && (
        <BottomNav activeTab={currentScreen === 'course-detail' ? 'courses' : currentScreen} onNavigate={(screen) => setCurrentScreen(screen as any)} />
      )}
    </div>
  );
};

export default App;
