import { link } from 'node:fs';

// Navigation
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
];

// Authentication
export const AUTH_ROUTES = {
  login: '/login',
  signupOutsider: '/signup-as-outsider',
  signupCollege: '/signup-as-college',
  spardha: '/spardha',
};

// Competitions
export const COMPETITIONS = [
  {
    id: 'code-clash',
    title: 'Code Clash',
    description:
      'A fast-paced coding quiz testing your knowledge of programming, algorithms, and logi',
    icon: 'Code',
    route: '/spardha/platform/select-competition/code-clash',
    link: '/spardha/platform/select-competition/code-clash',
  },
  {
    id: 'bug-bash',
    title: 'Bug bash',
    description:
      'Find and fix bugs in existing code. Sharpen your debugging skills and attention to detail. & more',
    icon: 'Bug',
    route: '/spardha/platform/select-competition/bug-bash',
    link: '/spardha/platform/select-competition/bug-bash',
  },
  {
    id: 'code-mirage',
    title: 'Code Mirage',
    description:
      'Recreate code from memory after viewing it briefly. Test your memory and coding accuracy.',
    icon: 'Eye',
    route: '/spardha/platform/select-competition/code-mirage',
    link: '/spardha/platform/select-competition/code-mirage',
  },
];

export const COMPETITION_GUIDELINES = [
  {
    event: 'code-clash',
    title: 'Code Clash',
    icon: 'Code',
    description_large:
      "In Code Clash, you'll be presented with competitive programming challenges that test your problem-solving skills under time pressure. Solve algorithmic problems efficiently and beat the clock!",
    description:
      "In Code Clash, you'll solve competitive programming problems within a time limit.",
    duration: '45 minutes',
    difficulty: 'Intermediate',
    skills: ['Logic', 'Problem-solving'],
    rules: [
      'You must complete the competition within the allocated time (45 minutes).',
      '+4 for each question and -0.5 as a negative marking.',
      'You may use any programming language supported by the platform.',
      'External resources, libraries, or AI tools are not allowed during the competition.',
      'Do not refresh the tab when quiz started.',
      'Do not switch the tab or away for more than 30 seconds, otherwise test will autosubmit',
      'You can submit your solution multiple times, but only your first submission will be considered.',
      'In case of technical issues, contact the support team immediately.',
      'If score clashes then judge on quiz submission time.',
    ],
    link: '/spardha',
  },
  {
    event: 'bug-bash', // 🔹 Updated Name
    title: 'Bug Bash',
    icon: 'Bug',
    description_large:
      "Bug Bash is a high-intensity debugging challenge where you'll battle against tricky code bugs. From syntax errors to hidden logic flaws, your mission is to squash them all as fast as possible!",
    description:
      'Bug Bash challenges you to find and fix bugs in existing code.',
    duration: '45 minutes',
    difficulty: 'Advanced',
    skills: ['Debugging', 'Attention to detail'],
    rules: [
      'You will be given faulty code that you must fix.',
      'Plagiarism will result in immediate disqualification.',
      'You can submit multiple solutions, but only your final submission will be scored.',
      'Automated and manual evaluation will be used to check your solutions.',
      "The judges' decision is final and binding.",
    ],
    link: '/spardha',
  },
  {
    event: 'code-mirage', // 🔹 Updated Name
    title: 'Code Mirage',
    icon: 'Eye',
    description_large:
      "Code Mirage is a test of memory and precision. You'll get a brief look at a code snippet, and then it vanishes! Can you recreate it exactly as it was, or will it fade like an illusion?",
    description:
      'Code Mirage tests your memory and coding accuracy. Recreate a given snippet from memory.',
    duration: '30 minutes',
    difficulty: 'Beginner',
    skills: ['Memory', 'Coding Precision'],
    rules: [
      'You will be shown a code snippet for 30 seconds before it disappears.',
      'Your task is to recreate the snippet as accurately as possible.',
      'Scores are based on accuracy and speed.',
      'No external tools, IDEs, or resources are allowed.',
      "The judges' decision is final and binding.",
    ],
    link: '/spardha',
  },
];

// Events
export const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Code Clash',
    date: 'April 7, 2025',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description:
      'A high-intensity coding competition where developers battle it out to solve complex algorithmic challenges.',
    readmore_link: '/spardha',
    target_blank: false,
    register_link: '/events',
  },
  {
    id: 2,
    title: 'Code Mirage',
    date: 'April 7, 2025',
    image:
      'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description:
      'A mind-bending coding contest that tests logical thinking, problem-solving, and code optimization skills.',
    readmore_link: '/spardha',
    target_blank: false,
    register_link: '/events',
  },
  {
    id: 3,
    title: 'Bug Bash',
    date: 'April 7, 2025',
    image:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description:
      'A debugging marathon where developers hunt and fix critical bugs under time pressure.',
    readmore_link: '/spardha',
    target_blank: false,
    register_link: '/events',
  },
  {
    id: 4,
    title: 'Mini Hackathon',
    date: 'April 7, 2025',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description:
      'A fast-paced hackathon where participants must implement specific features within a limited timeframe.',
    readmore_link: 'https://tejanta.vercel.app/tech-spardha/hackathon',
    target_blank: true,
    register_link: '/events',
  },
  {
    id: 5,
    title: 'Robo Race',
    date: 'April 7, 2025',
    image:
      'https://images.unsplash.com/photo-1678225867994-e7a5b071ebfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'An exciting competition where participants build and race autonomous robots on a challenging track.',
    readmore_link: 'https://tejanta.vercel.app/tech-spardha/robo-race',
    target_blank: true,
    register_link: '/events',
  },
];

// Theme Colors
export const THEME_COLORS = {
  navyBlue: '#05445e',
  blueGrotto: '#189ab4',
  blueGreen: '#75e6da',
  babyBlue: '#d4f1f4',
};

// Contact Information
export const CONTACT_INFO = {
  address: 'Indore, Madhya Pradesh, India',
  phone: '+91 98765 43210',
  email: 'lnct.spardha.tech@gmail.com',
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: '#',
  twitter: '#',
  instagram: '#',
  github: '#',
};

// Footer Links
export const FOOTER_LINKS = {
  quickLinks: [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About Us' },
    { href: '/login', label: 'Login' },
    { href: '/signup-as-outsider', label: 'Sign Up' },
  ],
  competitions: [
    { href: '/spardha/platform/select-competition/code-clash', label: 'Code Clash' },
    { href: '/spardha/platform/select-competition/bug-bash', label: 'Bug Bash' },
    { href: '/spardha/platform/select-competition/code-mirage', label: 'Code Mirage' },
  ],
};
