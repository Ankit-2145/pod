"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import {
  ChevronRightIcon,
  LogOutIcon,
  ChevronDownIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { LogOutButton } from "@/features/auth/components/log-out-button";
// import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const UserButton = () => {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 gap-2 px-2 hover:bg-muted"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium leading-none">
              {session?.user?.name}
            </div>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Profile Section */}
        <div className="px-2 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          {/* Uncomment if you want the badge */}
          {/* <Badge variant="secondary" className="mt-2 w-fit text-xs">
            Student
          </Badge> */}
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2">
            Account
          </DropdownMenuLabel>
          <Link prefetch href="/profile" className="block">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Profile Settings</span>
              <ChevronRightIcon className="h-3 w-3 ml-auto text-muted-foreground opacity-50" />
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Theme Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2">
            Appearance
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dark Mode</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Logout Section */}
        <LogOutButton>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
            <LogOutIcon className="h-4 w-4" />
            <span className="text-sm">Log out</span>
          </DropdownMenuItem>
        </LogOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
