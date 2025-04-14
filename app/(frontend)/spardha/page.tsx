'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Code, Bug, Eye } from 'lucide-react';
import { COMPETITIONS } from '@/constants';
import Navbar from '@/components/Navbar';

export default function SpardhaPage() {
  const { data: session } = useSession();

  useEffect(() => {
    // This effect can be used for analytics or loading user-specific data
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="h-10 w-10 text-blue-grotto" />;
      case 'Bug':
        return <Bug className="h-10 w-10 text-blue-grotto" />;
      case 'Eye':
        return <Eye className="h-10 w-10 text-blue-grotto" />;
      default:
        return <Code className="h-10 w-10 text-blue-grotto" />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mb-12 text-center"
            >
              <motion.h1
                variants={itemVariants}
                className="mb-4 font-heading text-3xl font-bold text-navy-blue dark:text-baby-blue md:text-4xl"
              >
                Welcome to Spardha, {session?.user?.name}!
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400"
              >
                Choose a competition to participate in and showcase your coding
                skills.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {COMPETITIONS.map((competition) => (
                <motion.div key={competition.id} variants={itemVariants}>
                  <Card className="h-full border-blue-green/20 transition-shadow duration-300 hover:shadow-lg dark:border-blue-green/10">
                    <CardContent className="p-6">
                      <div className="mb-4">{getIcon(competition.icon)}</div>
                      <h3 className="mb-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                        {competition.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {competition.description}
                      </p>
                      <Link href={competition.route}>
                        <Button className="bg-blue-grotto text-white hover:bg-navy-blue">
                          View all Competitions
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Need help or have questions about the competitions?
              </p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-blue-grotto text-blue-grotto hover:bg-blue-grotto/10"
                >
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
