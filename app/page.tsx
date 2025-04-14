'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ChevronRight,
  Code,
  Bug,
  Eye,
  Calendar,
  Users,
  Trophy,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingPage from '@/components/PricingPageComponent';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[100vw] overflow-x-hidden">
        <div className="pt-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Events Section */}
          <EventsSection />
           
           {/* Payment section */}
           <PricingPage/>
           
          {/* Event Slideshow */}
          <EventSlideshow />

          {/* About Section */}
          <AboutSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

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
    <section className="relative w-[100vw] bg-gradient-to-b from-baby-blue/30 to-white py-20 dark:from-navy-blue/5 dark:to-navy-blue/50 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={mainControls}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
        >
          <div>
            <motion.h1
              variants={itemVariants}
              className="mb-6 font-heading text-4xl font-extrabold text-navy-blue dark:text-baby-blue md:text-5xl lg:text-6xl"
            >
              Unleash Your Coding Potential
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mb-8 text-lg text-gray-700 dark:text-gray-300 md:text-xl"
            >
              Join Spardha, the premier platform for college coding
              competitions. Showcase your skills, solve challenging problems,
              and compete with the best minds across campuses.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link href="/token-auth" target="_blank">
                <Button
                  size="lg"
                  className="bg-blue-grotto text-white hover:bg-navy-blue"
                >
                  Join by Token
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-grotto text-blue-grotto hover:bg-blue-grotto/10"
                >
                  Explore Events
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Coding Competition"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid grid-cols-1 gap-8 rounded-xl bg-white p-8 shadow-lg dark:bg-navy-blue/50 md:grid-cols-3"
        >
          <div className="text-center">
            <div className="flex justify-center">
              <Calendar className="mb-4 h-10 w-10 text-blue-grotto" />
            </div>
            <h3 className="text-3xl font-bold text-navy-blue dark:text-baby-blue">
              20+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Events Per Year</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Users className="mb-4 h-10 w-10 text-blue-grotto" />
            </div>
            <h3 className="text-3xl font-bold text-navy-blue dark:text-baby-blue">
              5,000+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Active Participants
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Trophy className="mb-4 h-10 w-10 text-blue-grotto" />
            </div>
            <h3 className="text-3xl font-bold text-navy-blue dark:text-baby-blue">
              ₹50,000+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Prize Pool</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const [code, setCodeChange] = useState<string>('');
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

  const events = [
    {
      id: 1,
      title: 'Code Clash',
      description:
        'Compete in real-time coding battles against other programmers. Solve challenges swiftly and efficiently.',
      icon: <Code className="h-10 w-10 text-blue-grotto" />,
      link: '/spardha/platform/select-competition/code-clash',
    },
    {
      id: 2,
      title: 'Bug Bash',
      description:
        'Hunt and fix hidden bugs in existing code. Put your debugging expertise to the test and more.',
      icon: <Bug className="h-10 w-10 text-blue-grotto" />,
      link: '/spardha/platform/select-competition/bug-bash',
    },
    {
      id: 3,
      title: 'Code Mirage',
      description:
        'View a code snippet for a few seconds and then recreate it from memory. Test your recall and accuracy.',
      icon: <Eye className="h-10 w-10 text-blue-grotto" />,
      link: '/spardha/platform/select-competition/code-mirage',
    },
  ];

  return (
    <section className="bg-white py-20 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold text-navy-blue dark:text-baby-blue md:text-4xl">
              Upcoming Competitions
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              Participate in our exciting coding competitions and showcase your
              skills. Each event is designed to challenge different aspects of
              your programming abilities.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Card className="h-full border-blue-green/20 transition-shadow duration-300 hover:shadow-lg dark:border-blue-green/10">
                  <CardContent className="p-6">
                    <div className="mb-4">{event.icon}</div>
                    <h3 className="mb-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                      {event.title}
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                    <Link href={event.link}>
                      <Button
                        variant="outline"
                        className="border-blue-grotto text-blue-grotto hover:bg-blue-grotto/10"
                      >
                        Learn More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-blue-grotto text-white hover:bg-navy-blue"
              >
                View All Events
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const EventSlideshow = () => {
  const events = [
    {
      id: 1,
      title: 'Code Clash',
      date: 'April 7, 2025',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Bug Bash',
      date: 'April 7, 2025',
      image:
        'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      title: 'Code Mirage',
      date: 'April 7, 2025',
      image:
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 4,
      title: 'Hackathon',
      date: 'April 7, 2025',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 5,
      title: 'Roborace',
      date: 'April 7, 2025',
      image:
        'https://images.unsplash.com/photo-1678225867994-e7a5b071ebfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <section className="bg-baby-blue/30 py-20 dark:bg-navy-blue/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-navy-blue dark:text-baby-blue md:text-4xl">
            Event Highlights
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            Take a look at our featured events and mark your calendar for these
            exciting opportunities.
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {events.map((event) => (
              <CarouselItem
                key={event.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className="overflow-hidden border-blue-green/20 dark:border-blue-green/10">
                    <div className="relative h-48">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {event.date}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex justify-center">
            <CarouselPrevious className="mr-2" />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

const AboutSection = () => {
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
    <section className="bg-white py-20 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="order-2 md:order-1">
            <h2 className="mb-6 font-heading text-3xl font-bold text-navy-blue dark:text-baby-blue md:text-4xl">
              About Spardha
            </h2>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
              Spardha is a platform dedicated to fostering coding excellence
              among college students across the country. We believe in creating
              opportunities for students to showcase their skills, learn from
              peers, and grow as developers.
            </p>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Our competitions are designed to challenge different aspects of
              programming abilities, from logical thinking to debugging and
              memory skills. Join us to be part of a vibrant community of coders
              and tech enthusiasts.
            </p>
            <Link href="/about">
              <Button className="bg-blue-grotto text-white hover:bg-navy-blue">
                Learn More About Us
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
