'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, BookOpen, Lightbulb } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen pt-16">
          <AboutHeader />
          <MissionSection />
          <TeamSection />
          <ValuesSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

const AboutHeader = () => {
  return (
    <section className="bg-gradient-to-b from-baby-blue/30 to-white py-16 dark:from-navy-blue/5 dark:to-navy-blue/50">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-heading text-3xl font-extrabold text-navy-blue dark:text-baby-blue md:text-6xl"
        >
          About Spardha
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400"
        >
          Empowering students through coding competitions and fostering a
          community of tech enthusiasts.
        </motion.p>
      </div>
    </section>
  );
};

const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

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

  return (
    <section className="bg-white py-8 dark:bg-navy-blue/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="order-2 md:order-1">
            <h2 className="mb-6 font-heading text-2xl font-bold text-navy-blue dark:text-baby-blue md:text-3xl">
              Our Mission
            </h2>
            <p className="mb-4 font-body text-gray-600 dark:text-gray-400">
              Code Spardha is a platform dedicated to fostering a competitive
              and innovative coding culture. Our goal is to challenge
              programmers of all skill levels through a series of engaging and
              thought-provoking coding contests.
            </p>
            <p className="mb-4 font-body text-gray-600 dark:text-gray-400">
              We aim to provide a space where students can enhance their
              problem-solving skills, test their debugging abilities, and
              improve their coding efficiency under time constraints. Our
              competitions are designed to push boundaries, encourage logical
              thinking, and develop real-world coding expertise.
            </p>
            <p className="font-body text-gray-600 dark:text-gray-400">
              {
                "Through Code Spardha, participants will face challenges that simulate real-world scenarios, strengthening their ability to think critically and adapt to dynamic coding problems. Whether it's algorithmic problem-solving, bug fixing, or memory-based coding tasks, every challenge is an opportunity to grow and compete with the best."
              }
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Team Collaboration"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

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

  const team = [
    {
      name: 'Utsav Jaiswal',
      role: 'Designer and Developer',
      image: 'https://masterutsav.in/images/my_picture_logo.jpg',
      portfolio: 'https://masterutsav.in',
    },
  ];

  return (
    <section className="bg-baby-blue/30 py-16 dark:bg-navy-blue/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-2xl font-bold text-navy-blue dark:text-baby-blue md:text-3xl">
              Created By
            </h2>
            <p className="mx-auto max-w-3xl text-gray-600 dark:text-gray-400">
              Utsav Jaiswal 3rd Year CSE student, created this whole Platform.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex items-center justify-center gap-8"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden border-blue-green/20 transition-shadow duration-300 hover:shadow-lg dark:border-blue-green/10">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-bold text-navy-blue dark:text-baby-blue">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                    <Link href={member.portfolio} target="_blank">
                      Portfolio
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

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

  const values = [
    {
      icon: <Users className="h-10 w-10 text-blue-grotto" />,
      title: 'Community',
      description:
        'We believe in the power of community and collaboration to drive innovation and learning.',
    },
    {
      icon: <Award className="h-10 w-10 text-blue-grotto" />,
      title: 'Excellence',
      description:
        'We strive for excellence in everything we do, from competition design to platform development.',
    },
    {
      icon: <BookOpen className="h-10 w-10 text-blue-grotto" />,
      title: 'Education',
      description:
        'We are committed to providing educational opportunities through our competitions and resources.',
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-blue-grotto" />,
      title: 'Innovation',
      description:
        'We encourage innovative thinking and creative problem-solving in all our competitions.',
    },
  ];

  return (
    <section className="bg-white py-16 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-2xl font-bold text-navy-blue dark:text-baby-blue md:text-3xl">
              Our Values
            </h2>
            <p className="mx-auto max-w-3xl text-gray-600 dark:text-gray-400">
              These core values guide everything we do at Spardha.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-blue-green/20 transition-shadow duration-300 hover:shadow-lg dark:border-blue-green/10">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">{value.icon}</div>
                    <h3 className="mb-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
