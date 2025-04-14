import Image from 'next/image';

export default function SEOData() {
  return (
    <div className="hidden">
      {/* Essential Metadata for SEO */}
      <meta
        name="title"
        content="Code Spardha 2025 | The Ultimate Coding Challenge"
      />
      <meta
        name="description"
        content="Join Code Spardha 2025 at LNCT Indore – the ultimate coding showdown! Compete in competitive programming, hackathons, and coding challenges to showcase your skills."
      />
      <meta
        name="keywords"
        content="Code Spardha, LNCT Code Fest, Coding Competition, Hackathon, LNCT Indore, Competitive Programming, Utsav Jaiswal, Master Utsav"
      />
      <meta name="author" content="Utsav Jaiswal / Master Utsav" />
      <meta
        property="og:title"
        content="Code Spardha 2025 | The Ultimate Coding Challenge"
      />
      <meta
        property="og:description"
        content="Compete in Code Spardha 2025 at LNCT Indore! Take part in competitive programming, hackathons, and coding challenges to prove your skills."
      />
      <meta
        property="og:image"
        content="https://codespardha.vercel.app/img/code_spardha.png"
      />
      <meta property="og:url" content="https://codespardha.vercel.app" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Code Spardha 2025" />
      <meta
        name="twitter:description"
        content="Join Code Spardha 2025 and challenge yourself in competitive programming, hackathons, and AI-based problem-solving competitions."
      />
      <meta name="twitter:image" content="/img/code_spardha.png" />

      {/* Structured Data for Better Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Code Spardha 2025',
            startDate: '2025-04-10',
            endDate: '2025-04-12',
            location: {
              '@type': 'Place',
              name: 'LNCT Indore',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'LNCT Campus',
                addressLocality: 'Indore',
                addressCountry: 'India',
              },
            },
            image: 'https://codespardha.vercel.app/img/code_spardha.png',
            description:
              'Join the biggest coding event of the year - Code Spardha 2025! Participate in programming challenges, hackathons, and algorithmic competitions.',
            organizer: {
              '@type': 'Person',
              name: 'Utsav Jaiswal',
              url: 'https://codespardha.vercel.app',
            },
            eventCategory: ['Technology', 'Programming', 'Hackathon'],
          }),
        }}
      />

      {/* Visible Image for SEO & Indexing */}
      <Image
        width={1600}
        height={900}
        src="https://codespardha.vercel.app/img/logo.png"
        alt="Code Spardha 2025 - The Ultimate Coding Challenge"
        loading="lazy"
        className="hidden"
      />

      {/* Site & Developer Info */}
      <p>
        Code Spardha 2025 - Organized by LNCT. Developed by{' '}
        <strong>Utsav Jaiswal / Master Utsav</strong>.
      </p>
    </div>
  );
}
