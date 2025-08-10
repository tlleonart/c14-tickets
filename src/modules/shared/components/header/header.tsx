"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { NavigationBar } from "./navigation-bar";
import { cn } from "@/modules/shared/lib/utils";
// import { HeaderSearch } from "./header-search-bar";

export const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // const pathname = usePathname();

  // Show search on homepage and events pages
  // const showSearch = pathname === "/" || pathname.startsWith("/events");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* const handleSearch = (query: string) => {
    // Navigate to search results or handle search logic
    console.log("Searching for:", query);
    // You can implement navigation to search results page here
    // router.push(`/events?search=${encodeURIComponent(query)}`);
  };
  */

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "border-b border-border/50",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg"
          : "bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="container-fluid">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">
                CARBONO
              </span>
              <span className="text-xl font-bold tracking-wider text-primary ml-1">
                14
              </span>
            </div>
          </Link>

          {/* Search (Desktop) - Only on certain pages 
          {showSearch && (
            <div className="hidden lg:flex flex-1 justify-center max-w-md mx-8">
              <HeaderSearch onSearch={handleSearch} className="w-full" />
            </div>
          )}
*/}
          {/* Navigation 
          <NavigationBar />*/}
        </div>
      </div>
    </header>
  );
};
