import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
import MainProvider from './provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SEOData from '@/components/SEOData';

const salsa = localFont({
  src: './fonts/Salsa-Regular.ttf',
  variable: '--font-salsa',
  weight: '100 900',
});

const mavenPro = localFont({
  src: './fonts/MavenPro-VariableFont_wght.ttf',
  variable: '--font-maven-pro',
  weight: '100 900',
});

const assistant = localFont({
  src: './fonts/Assistant-VariableFont_wght.ttf',
  variable: '--font-assistant',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Code Spardha',
  description:
    'Code Spardha is the ultimate platform for college-level programming competitions. Participate in thrilling challenges like Code Clash, Bug Bash, and Code Mirage to test and enhance your coding skills. Designed for fairness and security, our platform ensures a cheat-proof environment for all participants.',
  keywords: [
    'Code Spardha',
    'Programming Competitions',
    'Code Clash',
    'Bug Bash',
    'Code Mirage',
    'College Coding Events',
    'Secure Coding Contests',
    'LNCT Code Spardha',
    'Competitive Programming',
    'Hackathons',
    'Tech Quizzes',
    'Coding Challenges',
  ],
  verification: {
    google: 'UCXi1Cjwp3J0OMwafKDmgsznHtdR0JQVGhmnmKbrkVk',
  },
  openGraph: {
    title: 'Code Spardha - Ultimate Coding Competition Platform',
    description:
      'Join Code Spardha to experience the thrill of competitive coding. Engage in secure, college-level programming contests like Code Clash, Bug Bash, and Code Mirage.',
    url: 'https://codespardha.vercel.app',
    images: [
      {
        url: 'https://codespardha.vercel.app/img/code_spardha.png',
        width: 1200,
        height: 630,
        alt: 'Code Spardha - Ultimate Coding Competition Platform',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@CodeSpardha',
    title: 'Code Spardha - Ultimate Coding Competition Platform',
    description:
      'Test your coding skills with Code Spardha! Join exciting contests like Code Clash, Bug Bash, and Code Mirage in a secure and fair coding environment.',
    images: 'https://codespardha.vercel.app/img/code_spardha.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${salsa.variable} ${assistant.variable} box-border overflow-x-hidden ${mavenPro.variable} flex min-h-screen flex-col font-body`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainProvider session={session}>{children}</MainProvider>
          <Toaster />
        </ThemeProvider>
        <SEOData />
      </body>
    </html>
  );
}
