import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import { useUserStore } from "@/store/userStore";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "PRODUCTS", path: "/products" },
  { label: "TESTIMONIALS", path: "/testimonials" },
  { label: "INDUSTRIES", path: "/industries" },
  { label: "ABOUT US", path: "/about" },
  { label: "CONTACT US", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { user } = useUserStore();
  const profileRef = useRef<HTMLDivElement | null>(null);

  const logout = useLogout();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout({ redirectTo: '/login', replace: true, showToast: true });
  };


  const initials = user
    ? `${(user.name || "").charAt(0) || ""}`.toUpperCase()
    : "";

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="NUPA Logo" className="h-10 lg:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="hidden sm:inline-flex">
              Request a Quote
            </Button>
            {!user && (
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
            <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-sm w-24"
              />
            </div>
            {/* Profile / Auth area */}
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-medium hover:brightness-95"
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  {initials || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-md py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted ${location.pathname === link.path ? "text-primary bg-muted" : "text-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-2">
                <Button variant="default" size="sm" className="flex-1">
                  Request a Quote
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/signup">Register</Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
