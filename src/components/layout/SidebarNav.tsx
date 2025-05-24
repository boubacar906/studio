// src/components/layout/SidebarNav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSeparator,
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
  Utensils,
  Sparkles,
  HelpCircle,
  CloudUpload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/estimate', label: 'Estimate Calories', icon: Camera },
  { href: '/history', label: 'Meal History', icon: History },
  { href: '/nutrient-analysis', label: 'Nutrient Analysis', icon: Sparkles, beta: true },
];

const bottomNavItems = [
  { href: '#', label: 'Settings', icon: Settings }, // Placeholder
  { href: '#', label: 'Help & Support', icon: HelpCircle }, // Placeholder
  { href: '#', label: 'Log Out', icon: LogOut }, // Placeholder
];

export function SidebarNav() {
  const pathname = usePathname();

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
            <Avatar className="h-12 w-12 border-2 border-sidebar-accent">
                <AvatarImage src="https://placehold.co/80x80.png" alt="User Name" data-ai-hint="person avatar" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">UN</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium text-sidebar-foreground">User Name</p>
                <p className="text-xs text-sidebar-foreground/70">user@example.com</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
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
          ))}
        </SidebarMenu>
        
        <div className="mt-auto p-2 group-data-[collapsible=icon]:hidden">
          <Card className="bg-sidebar-accent/10 border-sidebar-accent/30">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle className="text-sm text-sidebar-foreground">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs text-sidebar-foreground/70">
                Unlock more features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>

      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
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
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

// Minimal Card components for the Upgrade section to avoid import cycle / keep it simple
// In a real app, these would be from ui/card
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border shadow-sm", className)} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
