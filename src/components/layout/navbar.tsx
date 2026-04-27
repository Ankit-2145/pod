"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";

import { UserButton } from "@/components/user/user-button";
import { LogOutButton } from "@/components/user/log-out-button";

interface NavItemProps {
  label: string;
  href: string;
}

const navItems: NavItemProps[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full py-3 px-4 md:px-6 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold sm:hidden lg:block">
            <span className="text-brand">Research&nbsp;</span>
            <span className="text-accent-primary">Goal</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive =
              (pathname === "/" && item.href === "/") ||
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Button
                key={item.label}
                variant={isActive ? "default" : "ghost"}
                asChild
                className={cn(
                  "px-5 rounded-full",
                  isActive && "bg-foreground text-white rounded-md",
                )}
              >
                <Link href={item.href} prefetch>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {session?.user ? (
            <UserButton />
          ) : (
            <>
              <Button variant="outline" className="cursor-pointer" asChild>
                <Link href="/login">Log in</Link>
              </Button>

              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu & Auth */}
        <div className="flex items-center space-x-3 md:hidden">
          {session?.user && <UserButton />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Menu className="h-6 w-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              showCloseButton={false}
              side="left"
              className="w-[85vw] max-w-[320px] p-0"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center">
                      <span className="text-lg font-bold">
                        <span className="text-brand">Research</span>
                        <span className="text-accent-primary">Goal</span>
                      </span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </div>
                  <div className="space-y-1 px-2">
                    {navItems.map((item) => {
                      const isActive =
                        (pathname === "/" && item.href === "/") ||
                        pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`);

                      return (
                        <SheetClose asChild key={item.label}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            asChild
                            className={cn(
                              "w-full justify-start rounded-md h-10",

                              isActive && "bg-foreground text-white rounded-md",
                            )}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                            </Link>
                          </Button>
                        </SheetClose>
                      );
                    })}
                  </div>
                </nav>

                {/* Auth Buttons Footer */}
                <SheetFooter className="p-4 border-t mt-auto">
                  {session?.user ? (
                    <LogOutButton>Log out</LogOutButton>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/login">Log in</Link>
                      </Button>

                      <Button
                        asChild
                        className="w-full"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
