import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const metadata = {
  title: 'ResumeCraft AI — Admin Portal',
  description: 'Enterprise dashboard for ResumeCraft AI administration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#F7F8FA] text-[#111827]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
