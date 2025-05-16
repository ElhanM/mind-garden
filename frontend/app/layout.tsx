import { Navbar } from '@/components/navbar/navbar';
import { PageContainer } from '@/components/page-container';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SessionGuard } from '@/components/auth/session-guard';
import { Toaster } from '@/components/ui/toaster';
import { WPProvider } from './wpProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindGarden',
  description: 'Nurture your mental wellness journey',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionGuard>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
              <WPProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <footer className="border-t bg-white py-6">
                  <PageContainer>
                    <p className="text-center text-sm text-gray-500">
                      MindGarden - Nurture your mental wellness journey
                    </p>
                    <Toaster />
                  </PageContainer>
                </footer>
              </WPProvider>
            </div>
          </SessionGuard>
        </Providers>
      </body>
    </html>
  );
}
