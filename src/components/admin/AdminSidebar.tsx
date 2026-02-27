import logo from "@/assets/logo.svg";
import useLogout from "@/hooks/useLogout";
import {
  Grid2X2,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  PenTool,
  Settings,
  ShoppingBag,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mainNavItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Categories", path: "/admin/categories", icon: Grid2X2 },
  { label: "Products", path: "/admin/products", icon: ShoppingBag },
  { label: "Orders", path: "/admin/orders", icon: Package },
  { label: "Payments", path: "/admin/payments", icon: Wallet },
  { label: "Quotes", path: "/admin/quotes", icon: MessageSquareQuote },
  { label: "CMS", path: "/admin/cms", icon: PenTool },
  { label: "Delivery Management", path: "/admin/delivery", icon: Truck },
];

const otherNavItems = [
  { label: "Profile", path: "/admin/profile", icon: User },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  const logout = useLogout();

  const handleLogout = () => {
    logout({ redirectTo: '/login', replace: true, showToast: true });
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-background border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link to="/admin">
          <img src={logo} alt="NUPA Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Main
          </span>
        </div>
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Other
          </span>
        </div>
        <ul className="space-y-1">
          {otherNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Minhaz Nokir</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
