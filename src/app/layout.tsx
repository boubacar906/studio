
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Header } from '@/components/layout/Header'; 

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CalorieCam - Snap, Estimate, Track',
  description: 'Your personal calorie tracking and meal analysis tool.',
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
          {/* The SidebarProvider and its children will wrap all pages.
              For the landing page, the sidebar will be minimal if not logged in.
              For other pages, it will show the full navigation.
              If a truly distinct layout is needed for the landing page (e.g. no sidebar at all),
              Next.js route groups or conditional rendering in this layout would be options.
              For now, this setup should be fine as SidebarNav adapts to auth state.
           */}
          <SidebarProvider defaultOpen={true}>
            <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r-0">
              <SidebarNav />
            </Sidebar>
            <SidebarInset className="flex flex-col">
              {/* The Header will appear on all pages, including landing, unless conditional logic is added */}
              <Header /> 
              <main className="flex-grow overflow-auto"> {/* Removed default padding, landing page handles its own */}
                {children}
              </main>
              {/* Footer is removed here as landing page has its own, and dashboard might not need a duplicate */}
            </SidebarInset>
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
}
