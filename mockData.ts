
import { Course, User, UserRole, Category, Payment, PaymentMethod, PaymentStatus, AuditLog } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Skills', icon: 'fa-lightbulb' },
  { id: 'cat2', name: 'Dugsi', icon: 'fa-mosque' },
  { id: 'cat3', name: 'Ganacsi', icon: 'fa-chart-line' },
];

export const MOCK_COURSES: Course[] = [
  {
    courseId: 'c1',
    title: 'Ku Hordhaca Tignoolajoyadda',
    description: 'Baro aasaaska tignoolajiyada, sida ay u shaqeyso, iyo muhiimadda ay u leedahay nolosha casriga ah.',
    category: 'Skills',
    instructor: 'Eng. Ahmed Ali',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    isPremium: true,
    isPublished: true,
    price: 7,
    createdAt: '2023-10-01',
    lessons: [
      {
        lessonId: 'l1',
        title: 'Maxay tahay Tignoolajiyadu?',
        duration: '15:45',
        order: 1,
        isPreview: true,
        contentBlocks: [
          {
            id: 'b1',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
            resolutions: ['480p', '720p', '1080p']
          },
          {
            id: 'b2',
            type: 'text',
            title: 'Qoraalka Casharka',
            body: 'Tignoolajiyadu waa isticmaalka aqoonta sayniska si loo xaliyo dhibaatooyinka nolosha dhabta ah. Waxay ka kooban tahay qalabka (hardware) iyo barnaamijyada (software).',
            isNote: false
          },
          {
            id: 'b3',
            type: 'gallery',
            title: 'Qalabka Hardware-ka',
            images: [
              { url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400', caption: 'Laptop Casri ah' },
              { url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400', caption: 'Processor (Maskaxda computerka)' }
            ]
          },
          {
            id: 'b4',
            type: 'file',
            fileName: 'Aasaaska_Tignoolajiyada.pdf',
            fileUrl: '#',
            fileSize: '1.2 MB',
            fileType: 'PDF'
          }
        ]
      }
    ]
  },
  {
    courseId: 'c2',
    title: 'Xisaabta Aljebra 1',
    description: 'Baro Aljebra bilow ilaa dhamaad.',
    category: 'Dugsi',
    instructor: 'Macalin Maryan',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd486490e?auto=format&fit=crop&q=80&w=400',
    isPremium: true,
    isPublished: true,
    price: 15,
    createdAt: '2023-11-15',
    lessons: [
      {
        lessonId: 'l2',
        title: 'Variables iyo Equations',
        duration: '20:00',
        order: 1,
        isPreview: true,
        contentBlocks: [
          {
            id: 'b5',
            type: 'text',
            body: 'Variables waa xarfo matalaya lambar aan la garanayn. Tusaale: x + 5 = 10.',
            isNote: true
          },
          {
            id: 'b6',
            type: 'quiz',
            title: 'Isku day fahamkaaga',
            questions: [
              { question: 'Haddii x + 2 = 5, waa imisa x?', options: ['2', '3', '7', '1'], correct: 1 }
            ]
          }
        ]
      }
    ]
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    paymentId: 'pay_1',
    userId: 'u125',
    userName: 'Jaamac Faarax',
    courseId: 'c2',
    amount: 15,
    currency: 'USD',
    paymentMethod: PaymentMethod.EVC_PLUS,
    paymentType: 'COURSE_PURCHASE',
    status: PaymentStatus.SUCCESS,
    reference: 'TX992831',
    createdAt: '2023-12-01 10:20:00'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { logId: 'a1', action: 'PAYMENT_VERIFIED', adminName: 'Admin Abdisalam', details: 'Manually verified payment TX992831', timestamp: '2023-12-05 14:20:00', ipAddress: '197.234.1.10' }
];

export const MOCK_USER: User = {
  userId: 'u123',
  name: 'Abdisalam Yusuf',
  email: 'abdisalam@yaaldug.so',
  role: UserRole.ADMIN,
  isActive: true,
  avatarSeed: 'Abdisalam',
  enrolledCourses: ['c1'],
  progress: { 'c1': 25 },
  completedLessons: ['l1'],
  lessonResumes: { 'l1': 45 },
  createdAt: '2023-09-20'
};

export const MOCK_USERS: User[] = [
  MOCK_USER,
  {
    userId: 'u124',
    name: 'Sahra Ahmed',
    email: 'sahra@yaaldug.so',
    role: UserRole.TEACHER,
    isActive: true,
    avatarSeed: 'Sahra',
    enrolledCourses: [],
    progress: {},
    completedLessons: [],
    createdAt: '2023-10-05'
  }
];
