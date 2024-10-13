"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for hamburger menu

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle hamburger menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="p-5 flex justify-between items-center border shadow-md relative">
      <Image src="/logo.svg" alt="logo" width={160} height={100} />
      
      {/* Desktop menu for larger screens */}
      <nav className="hidden md:flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="link">Dashboard</Button>
        </Link>
        <Link href="/dashboard/budgets">
          <Button variant="link">Budgets</Button>
        </Link>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <Button className="bg-primary text-white rounded-md">
              Get Started
            </Button>
          </Link>
        )}
      </nav>

      {/* Hamburger menu for small screens */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start p-5 space-y-4 md:hidden z-50">
          <Link href="/dashboard">
            <Button
              variant="link"
              className="w-full text-left"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/budgets">
            <Button
              variant="link"
              className="w-full text-left"
              onClick={() => setMenuOpen(false)}
            >
              Budgets
            </Button>
          </Link>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <Link href="/sign-in">
              <Button
                className="bg-primary text-white w-full rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
