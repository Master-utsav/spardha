'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Laptop, Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (() => {
    setIsMobileMenuOpen(false);
    localStorage.clear();
    signOut();
  })

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'mx-auto w-full bg-white/90 shadow-md backdrop-blur-md dark:bg-navy-blue/90'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex w-fit items-center justify-center">
              <Image
                height={100}
                width={100}
                alt="logo"
                src={'/img/logo.png'}
                className="aspect-square h-8 w-8 bg-no-repeat object-cover"
              />
              <span className="ml-2 text-xl font-bold text-navy-blue dark:text-baby-blue">
                Spardha
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 md:flex">
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                Home
              </Link>
              <Link
                href="/events"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/events'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                Events
              </Link>
              <Link
                href="/about"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/about'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/about'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                Pricing
              </Link>
              {session?.user.isAdmin && (
                <Link
                  href="/admin"
                  className={`text-md rounded-md px-3 py-2 font-medium ${
                    pathname === '/about'
                      ? 'text-blue-grotto'
                      : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              <ModeToggle />
              {session ? (
                <>
                  <Link href="/spardha">
                    <Button
                      variant="default"
                      className="bg-blue-grotto text-white hover:bg-navy-blue"
                    >
                      Spardha
                    </Button>
                  </Link>
                  <Button
                    className="block rounded-md bg-transparent px-3 py-2 text-base font-medium text-navy-blue outline outline-1 outline-navy-blue transition-colors delay-150 duration-300 hover:bg-blue-grotto hover:text-white hover:outline-none dark:text-blue-grotto dark:outline-blue-grotto hover:dark:text-white hover:dark:outline-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    className="bg-blue-grotto font-body text-white hover:bg-navy-blue"
                  >
                    Join
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="bg-white shadow-lg dark:bg-navy-blue md:hidden">
          <div className="flex flex-col items-center justify-center gap-2 space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === '/'
                  ? 'text-blue-grotto'
                  : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === '/events'
                  ? 'text-blue-grotto'
                  : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/about"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === '/about'
                  ? 'text-blue-grotto'
                  : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
                href="/pricing"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/about'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                Pricing
              </Link>
            {session?.user.isAdmin && (
              <Link
                href="/admin"
                className={`text-md rounded-md px-3 py-2 font-medium ${
                  pathname === '/about'
                    ? 'text-blue-grotto'
                    : 'text-gray-700 hover:text-blue-grotto dark:text-gray-300 dark:hover:text-blue-green'
                }`}
              >
                Admin
              </Link>
            )}
            {session ? (
              <>
                <Link
                  href="/spardha"
                  className="block rounded-md bg-blue-grotto px-3 py-2 text-base font-medium text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Spardha
                </Link>
                <Button
                  className="block rounded-md bg-transparent px-3 py-2 text-base font-medium text-navy-blue outline outline-1 outline-navy-blue transition-colors delay-150 duration-300 hover:bg-blue-grotto hover:text-white hover:outline-none dark:text-blue-grotto dark:outline-blue-grotto hover:dark:text-white hover:dark:outline-none"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-md bg-blue-grotto px-3 py-2 font-body font-medium text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
