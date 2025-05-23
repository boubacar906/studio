import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { AppProviders } from '@/components/providers/AppProviders';
import { SidebarProvider } from '@/components/ui/sidebar'; // Keep SidebarProvider as it's part of the scaffold

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CalorieCam - Estimate Food Calories',
  description: 'Upload a picture of your food and get an estimate of its calorie content.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <SidebarProvider defaultOpen={false}> {/* Default to closed or manage state if sidebar is used */}
          <AppProviders>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-card border-t border-border py-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} CalorieCam. All rights reserved.
            </footer>
          </AppProviders>
        </SidebarProvider>
      </body>
    </html>
  );
}
