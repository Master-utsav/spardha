'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Calendar } from 'lucide-react';
import { UPCOMING_EVENTS } from '@/constants';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-b from-baby-blue/30 to-white pb-16 pt-16 dark:from-navy-blue/20 dark:to-navy-blue/70">
          <EventsHeader />
          <EventsList />
        </div>
      </main>
      <Footer />
    </>
  );
}

const EventsHeader = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-heading text-3xl font-extrabold text-navy-blue dark:text-baby-blue md:text-6xl"
        >
          Upcoming Events
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400"
        >
          Discover and participate in our exciting coding competitions and
          events. Mark your calendar and prepare to showcase your skills!
        </motion.p>
      </div>
    </section>
  );
};

const EventsList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {UPCOMING_EVENTS.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Card className="overflow-hidden border-[1px] border-blue-green/40 shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-blue-green/40">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center text-blue-grotto">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                    {event.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={event.readmore_link as string}
                      target={event.target_blank ? '_blank' : '_self'}
                    >
                      <Button
                        variant="outline"
                        className="border-blue-grotto text-blue-grotto hover:bg-blue-grotto/10"
                      >
                        Learn More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={event.register_link as string} target="_blank">
                      <Button className="bg-blue-grotto text-white hover:bg-navy-blue">
                        Register
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
