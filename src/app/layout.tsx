import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Header } from '@/components/layout/Header'; // This will be the new content header

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CalorieCam Dashboard',
  description: 'Your personal calorie tracking and meal analysis dashboard.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <SidebarProvider defaultOpen={true}>
            <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r-0">
              <SidebarNav />
            </Sidebar>
            <SidebarInset className="flex flex-col">
              <Header /> 
              <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-auto">
                {children}
              </main>
              <footer className="bg-card border-t border-border py-3 px-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} CalorieCam. All rights reserved.
              </footer>
            </SidebarInset>
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
}
