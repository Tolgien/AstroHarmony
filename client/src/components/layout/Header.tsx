import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAstroSubmenuOpen, setMobileAstroSubmenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileAstroSubmenu = () => {
    setMobileAstroSubmenuOpen(!mobileAstroSubmenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileAstroSubmenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path ? "text-accent" : "text-foreground hover:text-accent";
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "header-blur bg-secondary bg-opacity-50" : ""
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-accent text-3xl mr-2">
            <Moon className="h-8 w-8" />
          </span>
          <h1 className="text-2xl font-heading font-bold text-accent">Astro Sight</h1>
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileMenu}
          className="lg:hidden text-foreground"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/" className={`transition-colors font-medium ${isActive("/")}`}>
            Anasayfa
          </Link>
          
          {/* Astrology Dropdown */}
          <div className="relative group">
            <button className={`text-foreground hover:text-accent transition-colors font-medium flex items-center ${location.includes("/zodiac") || location.includes("/birth-chart") || location.includes("/compatibility") ? "text-accent" : ""}`}>
              Astroloji
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-secondary rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link href="/birth-chart" className="block px-4 py-2 text-sm hover:bg-primary hover:text-accent transition-colors rounded-t-md" onClick={closeMobileMenu}>
                Doğum Haritası
              </Link>
              <Link href="/zodiac-signs" className="block px-4 py-2 text-sm hover:bg-primary hover:text-accent transition-colors" onClick={closeMobileMenu}>
                Burçlar
              </Link>
              <Link href="/compatibility" className="block px-4 py-2 text-sm hover:bg-primary hover:text-accent transition-colors rounded-b-md" onClick={closeMobileMenu}>
                Burç Uyumu
              </Link>
            </div>
          </div>
          
          <Link href="/blog" className={`transition-colors font-medium ${isActive("/blog")}`}>
            Blog
          </Link>
          <Link href="/contact" className={`transition-colors font-medium ${isActive("/contact")}`}>
            İletişim
          </Link>
          
          <Link href="/login" className="ml-4 bg-primary hover:bg-opacity-80 text-foreground px-4 py-2 rounded-full transition-all flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>Hesabım</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`lg:hidden bg-secondary absolute w-full left-0 top-full border-t border-gray-800 ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
            Anasayfa
          </Link>
          <button 
            onClick={toggleMobileAstroSubmenu}
            className="w-full text-left py-2 text-foreground hover:text-accent flex justify-between items-center"
          >
            Astroloji
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileAstroSubmenuOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`pl-4 ${mobileAstroSubmenuOpen ? "block" : "hidden"}`}>
            <Link href="/birth-chart" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
              Doğum Haritası
            </Link>
            <Link href="/zodiac-signs" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
              Burçlar
            </Link>
            <Link href="/compatibility" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
              Burç Uyumu
            </Link>
          </div>
          <Link href="/blog" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
            Blog
          </Link>
          <Link href="/contact" className="block py-2 text-foreground hover:text-accent" onClick={closeMobileMenu}>
            İletişim
          </Link>
          <Link href="/login" className="block py-2 text-accent" onClick={closeMobileMenu}>
            <User className="h-4 w-4 inline mr-2" />
            <span>Hesabım</span>
          </Link>
          
          <div className="py-2 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? (
                <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
              ) : (
                <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
