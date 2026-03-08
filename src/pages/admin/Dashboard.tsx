import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStatsCard from "@/components/admin/DashboardStatsCard";
import { AdminStats, useFetchAdminStats } from "@/services/statsService";
import {
  CheckCircle,
  MessageSquareQuote,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Wallet
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatBDT = (n: number) => `BDT ${n.toLocaleString()}`;

const Dashboard = () => {
  const { data: resp, isLoading } = useFetchAdminStats(true);
  const stats: AdminStats | undefined = resp?.data; 

  const monthlyEarnings = stats?.monthlyEarnings ?? Array.from({ length: 12 }, (_, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], revenue: 0 }));
  const monthlyOrdersVsQuotes = stats?.monthlyOrdersVsQuotes ?? monthlyEarnings.map((m) => ({ month: m.month, orders: 0, quotes: 0 }));

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <DashboardStatsCard
          icon={Users}
          label="Total Users"
          value={isLoading ? "..." : String(stats?.totalUsers ?? 0)}
        />
        <DashboardStatsCard
          icon={ShoppingCart}
          label="Total Orders"
          value={isLoading ? "..." : String(stats?.totalOrders ?? 0)}
        />
        <DashboardStatsCard
          icon={Truck}
          label="Active Orders"
          value={isLoading ? "..." : String(stats?.totalActiveOrders ?? 0)}
        />
        <DashboardStatsCard
          icon={CheckCircle}
          label="Completed Orders"
          value={isLoading ? "..." : String(stats?.totalCompletedOrders ?? 0)}
        />
        <DashboardStatsCard
          icon={MessageSquareQuote}
          label="Quote Requests"
          value={isLoading ? "..." : String(stats?.totalQuotes ?? 0)}
        />
        <DashboardStatsCard
          icon={Wallet}
          label="Total Revenue"
          value={isLoading ? "..." : formatBDT(stats?.totalRevenue ?? 0)}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Earnings Chart */}
        <div className="bg-background rounded-xl border border-border p-5">
          <h3 className="text-lg font-semibold mb-1">Total Earnings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Monthly revenue overview
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => formatBDT(value)}
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders vs Quotes Chart */}
        <div className="bg-background rounded-xl border border-border p-5">
          <h3 className="text-lg font-semibold mb-1">Orders Vs Quotes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Orders vs Quotes this year
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOrdersVsQuotes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="quotes" name="Quotes" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-primary/50" />
              <div>
                <p className="text-xs text-muted-foreground">Quote Requests</p>
                <p className="text-xl font-bold">{isLoading ? "..." : stats?.totalQuotes ?? 0}</p>
                <p className="text-xs text-muted-foreground">This year</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-xl font-bold">{isLoading ? "..." : stats?.totalOrders ?? 0}</p>
                <p className="text-xs text-muted-foreground">This year</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="bg-background rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {demoActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <Button size="sm">View Details</Button>
            </div>
          ))}
        </div>
      </div> */}
    </AdminLayout>
  );
};

export default Dashboard;