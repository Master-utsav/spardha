import Navbar from '@/components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`flex min-h-screen w-full flex-col font-body`}>
      <Navbar />
      <section className="relative mt-16">{children}</section>
    </main>
  );
}
