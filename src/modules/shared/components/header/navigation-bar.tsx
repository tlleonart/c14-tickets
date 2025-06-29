"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { FC, useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { Menu, X, Plus, Ticket } from "lucide-react";
import { cn } from "@/modules/shared/lib/utils";

const navigation = [
  {
    title: "Explorar eventos",
    href: "/events",
    icon: Ticket,
  },
  {
    title: "Vender entradas",
    href: "/organizer/register-organizer",
    icon: Plus,
    highlight: true,
  },
];

export const NavigationBar: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <ul className="flex items-center space-x-6">
          {navigation.map(({ title, href, icon: Icon, highlight }, index) => (
            <li key={index}>
              <Link
                href={href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors",
                  highlight
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Section */}
        <div className="flex items-center space-x-4 border-l border-border/50 pl-6">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "bg-popover border border-border",
                  userButtonPopoverActionButton:
                    "text-foreground hover:bg-accent",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </SignInButton>
            <Button size="sm" className="btn-gradient">
              Registrarse
            </Button>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-2">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </SignedIn>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
          <nav className="container-fluid py-4">
            <ul className="space-y-4">
              {navigation.map(
                ({ title, href, icon: Icon, highlight }, index) => (
                  <li key={index}>
                    <Link
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-md transition-colors",
                        highlight
                          ? "text-primary bg-primary/10 hover:bg-primary/20"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{title}</span>
                    </Link>
                  </li>
                )
              )}

              <SignedOut>
                <li className="pt-4 border-t border-border/50">
                  <div className="space-y-3">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Iniciar sesión
                      </Button>
                    </SignInButton>
                    <Button className="w-full btn-gradient">Registrarse</Button>
                  </div>
                </li>
              </SignedOut>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};
