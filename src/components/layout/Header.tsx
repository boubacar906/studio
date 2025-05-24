// src/components/layout/Header.tsx
"use client";

import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shrink-0">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search meals, ingredients..."
          className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px] h-9 shadow-sm"
          disabled // Non-functional for now
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="person avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
