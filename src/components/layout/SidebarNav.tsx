
// src/components/layout/SidebarNav.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Camera,
  History,
  Settings,
  LogOut,
  LogIn, 
  UserPlus, 
  Utensils,
  Sparkles,
  HelpCircle,
  Loader2, 
  Home, // Added Home icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; 

// Minimal Card components for the Upgrade section
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border shadow-sm", className)} {...props} />
);
const CardHeaderCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => ( 
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitleCard = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => ( 
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescriptionCard = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => ( 
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
const CardContentCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => ( 
  <div className={cn("p-6 pt-0", className)} {...props} />
);


const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true }, // Updated href
  { href: '/estimate', label: 'Estimate Calories', icon: Camera, authRequired: true },
  { href: '/history', label: 'Meal History', icon: History, authRequired: true },
  { href: '/nutrient-analysis', label: 'Nutrient Analysis', icon: Sparkles, beta: true, authRequired: true },
];

const unauthNavItems = [
    { href: '/login', label: 'Login', icon: LogIn, authRequired: false },
    { href: '/signup', label: 'Sign Up', icon: UserPlus, authRequired: false },
];

const bottomPlaceholderNavItems = [
  { href: '#', label: 'Settings', icon: Settings, authRequired: true }, 
  { href: '#', label: 'Help & Support', icon: HelpCircle, authRequired: true },
];


export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isLoading: authIsLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login'); 
  };

  // Determine which nav items to display based on auth state
  // Add "Home" for unauthenticated users or if not on landing page
  let displayedNavItems = [];
  if (user) {
    displayedNavItems = mainNavItems;
  } else {
    // For unauthenticated users, show a Home link to the landing page
     displayedNavItems.push({ href: '/', label: 'Home', icon: Home, authRequired: false });
  }
  
  const displayedBottomNavItems = user ? bottomPlaceholderNavItems : unauthNavItems;

  // Hide sidebar completely on the landing page for non-authenticated users
  // This is a simple way; more complex scenarios might use route groups or layout HOCs
  if (pathname === '/' && !user && !authIsLoading) {
    return null; // Don't render sidebar content on landing page for guests
  }


  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <Utensils className="h-7 w-7 text-sidebar-accent" />
            <span>CalorieCam</span>
          </Link>
        </div>
        <div className="mt-4 flex flex-col items-start gap-2">
            {authIsLoading ? (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-12 w-12 border-2 border-sidebar-accent">
                            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-sidebar-foreground/50">Loading...</p>
                        </div>
                    </div>
                </div>
            ) : user ? (
                <>
                    <Avatar className="h-12 w-12 border-2 border-sidebar-accent">
                        <AvatarImage src={user.photoURL || "https://placehold.co/80x80.png?text=U"} alt={user.displayName || user.email || "User"} data-ai-hint="person avatar" />
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[150px]">{user.displayName || user.email?.split('@')[0] || "User"}</p>
                        <p className="text-xs text-sidebar-foreground/70 truncate max-w-[150px]">{user.email}</p>
                    </div>
                </>
            ) : (
                 <>
                    <Avatar className="h-12 w-12 border-2 border-sidebar-accent">
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">?</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-sidebar-foreground">Guest</p>
                         <p className="text-xs text-sidebar-foreground/70">Welcome!</p>
                    </div>
                 </>
            )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {displayedNavItems.map((item) => {
            // Skip authRequired items if no user, unless item.authRequired is false
            if (item.authRequired && !user) return null;
            if (!item.authRequired && user && (item.href === '/login' || item.href === '/signup')) return null; // Hide login/signup if logged in

            return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(
                    "justify-start",
                    pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden flex items-center">
                      {item.label}
                      {item.beta && <Badge variant="outline" className="ml-2 text-xs border-sidebar-accent text-sidebar-accent group-data-[collapsible=icon]:hidden">Beta</Badge>}
                    </span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            );
        })}
        </SidebarMenu>
        
        {user && (
            <div className="mt-auto p-2 group-data-[collapsible=icon]:hidden">
            <Card className="bg-sidebar-accent/10 border-sidebar-accent/30">
                <CardHeaderCard className="p-2 pt-0 md:p-4">
                <CardTitleCard className="text-sm text-sidebar-foreground">Upgrade to Pro</CardTitleCard>
                <CardDescriptionCard className="text-xs text-sidebar-foreground/70">
                    Unlock more features and get unlimited access to our support team.
                </CardDescriptionCard>
                </CardHeaderCard>
                <CardContentCard className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                    Upgrade
                </Button>
                </CardContentCard>
            </Card>
            </div>
        )}

      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          {displayedBottomNavItems.map((item) => {
             if (item.authRequired && !user) return null;
             if (!item.authRequired && user && (item.href === '/login' || item.href === '/signup')) return null;
            return (
            <SidebarMenuItem key={item.label}>
               <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className="justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            );
        })}
          {user && !authIsLoading && (
            <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  tooltip="Log Out"
                  className="justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
                  disabled={authIsLoading}
                >
                  {authIsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
                  <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {authIsLoading && (
             <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Loading..."
                  className="justify-start w-full"
                  disabled={true}
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="group-data-[collapsible=icon]:hidden">Loading...</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
