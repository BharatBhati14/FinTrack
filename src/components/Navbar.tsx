"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SignOutButton } from "@/components/auth/SignOutButton";

type NavbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const routes = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Transactions",
    href: "/transactions",
  },
  {
    name: "Accounts",
    href: "/accounts",
  },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const displayName = user.name || "User";
  const email = user.email || "";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">FinTrack</SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-1">
                {routes.map((route) => {
                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(`${route.href}/`);

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {route.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* App name */}
        <Link
          href="/"
          className="shrink-0 text-[25px] font-semibold tracking-tight"
        >
          FinTrack
        </Link>

        {/* Desktop navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {routes.map((route) => {
            const isActive =
              pathname === route.href || pathname.startsWith(`${route.href}/`);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={`relative py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="ml-auto">
          <ProfileDropdown
            user={user}
            displayName={displayName}
            email={email}
            initials={initials}
          />
        </div>
      </div>
    </header>
  );
}

type ProfileDropdownProps = {
  user: NavbarProps["user"];
  displayName: string;
  email: string;
  initials: string;
};

function ProfileDropdown({
  user,
  displayName,
  email,
  initials,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9 cursor-pointer">
          {user.image ? (
            <AvatarImage src={user.image} alt={displayName} />
          ) : null}

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                {user.image ? (
                  <AvatarImage src={user.image} alt={displayName} />
                ) : null}

                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-black">{displayName}</p>

                {email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="px-1 py-1 text-red-600 [&_button]:w-full [&_button]:justify-start [&_button]:text-red-600 [&_button:hover]:bg-red-50 [&_button:hover]:text-red-700">
          <SignOutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
