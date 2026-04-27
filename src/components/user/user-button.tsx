"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import {
  ChevronRight,
  UserRound,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react";
import { LogOutButton } from "@/components/user/log-out-button";
import { Badge } from "@/components/ui/badge";
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

export const UserButton = () => {
  const { data: session } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-4 transition-all duration-200 focus:outline-none"
        >
          {" "}
          <div className="relative">
            <div className="size-10 rounded-full">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Avatar className="h-9 w-9 border-2 border-transparent">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/30 text-brand font-semibold">
                    {session?.user?.name ? (
                      session?.user.name.charAt(0).toUpperCase()
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {session?.user?.name}{" "}
              <ChevronDownIcon className="inline-block size-4 text-muted-foreground" />
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2 rounded-2xl">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
          <Avatar className="h-12 w-12 border border-muted">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/30 text-brand font-semibold">
              {session?.user?.name ? (
                session?.user?.name.charAt(0).toUpperCase()
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>

            <Badge
              variant="outline"
              className="mt-1 text-xs px-1.5 py-0 border-brand/20 text-brand"
            >
              Student
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 pb-1">
            Account
          </DropdownMenuLabel>

          <Link prefetch href="/profile" className="block">
            <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer rounded-md">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              <span>Profile Settings</span>
              <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <LogOutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="size-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Log out
            </span>
          </DropdownMenuItem>
        </LogOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
