import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";
import { useFetchCategories } from "@/services/categoryService";
import { useFetchIndustries } from "@/services/industryService";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "TESTIMONIALS", path: "/testimonials" },
  { label: "ABOUT US", path: "/about" },
  { label: "CONTACT US", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { totalItems } = useCartStore();
  const cartCount = totalItems();
  const { data: categoriesData } = useFetchCategories({ limit: 100 });
  const { data: industriesData } = useFetchIndustries({ limit: 100 });

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
    logout({ redirectTo: "/login", replace: true, showToast: true });
  };

  const initials = user
    ? `${(user.name || "").charAt(0) || ""}`.toUpperCase()
    : "";

  const categories = categoriesData?.data || [];
  const industries = industriesData?.data || [];
  const isProductsActive = location.pathname === "/products";
  const isIndustriesActive = location.pathname === "/industries";

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary" : "text-foreground"
    }`;

  const buildProductsUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    return `/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  };

  const goToProducts = (params: Record<string, string> = {}) => {
    navigate(buildProductsUrl(params));
  };

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
            <Link to="/" className={navLinkClass("/")}>HOME</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isProductsActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  PRODUCTS <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
                <DropdownMenuItem onSelect={() => goToProducts()}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onSelect={() => goToProducts({ cat: category.id })}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/testimonials" className={navLinkClass("/testimonials")}>TESTIMONIALS</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isIndustriesActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  INDUSTRIES <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">            
                <DropdownMenuItem onSelect={() => navigate("/industries")}>
                  All Industries
                </DropdownMenuItem>
                 <DropdownMenuLabel>Industries</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {industries.map((industry) => (
                  <DropdownMenuItem
                    key={industry.id}
                    onSelect={() => goToProducts({ industry: industry.id })}
                  >
                    {industry.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/about" className={navLinkClass("/about")}>ABOUT US</Link>
            <Link to="/contact" className={navLinkClass("/contact")}>CONTACT US</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="hidden sm:inline-flex">
              <Link to="/request-quote">Request a Quote</Link>
            </Button>
            {!user && (
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Cart Icon with badge */}
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

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
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-medium hover:brightness-95"
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  {initials || "U"}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-md py-1 z-50">
               {
                user?.role === 'ADMIN' && (     <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Dashboard
                    </Link>)
               }
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/track-order"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/track-quote"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      My Requested Quotes
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
              {navLinks?.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted ${
                    location.pathname === link.path ? "text-primary bg-muted" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-2">
                <Button variant="default" size="sm" className="flex-1">
                 <Link to="/request-quote">Request a Quote</Link>
                </Button>
                {
                  !user ? (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/signup">Register</Link>
                </Button> ) :null
                }
                
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
