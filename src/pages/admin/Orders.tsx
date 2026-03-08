/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  useFetchAllOrders,
  useUpdateOrderStatus,
  useVerifyPayment,
} from "@/services/orderService";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { Check, Eye, Search, X as XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ORDER_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "PENDING", value: OrderStatus.PENDING },
  { label: "CONFIRMED", value: OrderStatus.CONFIRMED },
  { label: "PROCESSING", value: OrderStatus.PROCESSING },
  { label: "SHIPPED", value: OrderStatus.SHIPPED },
  { label: "DELIVERED", value: OrderStatus.DELIVERED },
  { label: "CANCELLED", value: OrderStatus.CANCELLED },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "PENDING", value: PaymentStatus.PENDING },
  { label: "PAID", value: PaymentStatus.PAID },
  { label: "FAILED", value: PaymentStatus.FAILED },
];

const Orders = () => {
  const navigate = useNavigate();

  // filters state (single source of truth)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    order_id: "",
    orderStatus: "all" as string,
    paymentStatus: "all" as string,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const [search, setSearch] = useState(filters.order_id);

  // debounce search -> update filters.order_id
  const debounced = useMemo(
    () =>
      debounce((val: string) => {
        setFilters((s) => ({ ...s, order_id: val, page: 1 }));
      }, 350),
    []
  );

  useEffect(() => {
    debounced(search);
    return () => debounced.cancel();
  }, [search, debounced]);

  // build params for API (map 'all' -> undefined)
  const params = useMemo(() => {
    const p: Record<string, unknown> = {
      page: filters.page,
      limit: filters.limit,
    };
    if (filters.order_id) p.order_id = filters.order_id;
    if (filters.orderStatus && filters.orderStatus !== "all") p.orderStatus = filters.orderStatus;
    if (filters.paymentStatus && filters.paymentStatus !== "all")
      p.paymentStatus = filters.paymentStatus;
    if (filters.startDate) p.startDate = filters.startDate;
    if (filters.endDate) p.endDate = filters.endDate;
    return p;
  }, [filters]);

  const { data, isLoading } = useFetchAllOrders(params);
  const orders = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const updateStatus = useUpdateOrderStatus();
  const verifyPayment = useVerifyPayment();

  const [verifyModalOrder, setVerifyModalOrder] = useState<Order | null>(null);

  const setFilter = <K extends keyof typeof filters, V extends typeof filters[K]>(
    key: K,
    value: V
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // if changing filter other than page, reset to page 1
      page: key === "page" ? (value as unknown as number) : 1,
    }));
  };

  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      accessor: (row) => <div className="font-medium">{row.order_id}</div>,
    },
    {
      header: "Customer",
      accessor: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      header: "Amount",
      accessor: (row) => `BDT ${row.totalAmount.toLocaleString()}`,
      className: "text-right",
    },
    {
      header: "Payment",
      accessor: (row) => (
        <div className="flex items-center gap-2 justify-center">
          <StatusBadge status={row.paymentStatus as any} />
          {row.accountInfo ? (
            <Button variant="ghost" onClick={() => setVerifyModalOrder(row)}>
              <Eye className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      ),
      className: "text-center",
    },
    {
      header: "Status",
      accessor: (row) => (
        <select
          defaultValue={row.orderStatus}
          className="px-2 py-1 text-sm border border-border rounded"
          onChange={async (e) => {
            const newStatus = e.target.value as OrderStatus;
            try {
              await updateStatus.mutateAsync({ id: row.id, payload: { status: newStatus } });
              // optimistic / refetch handled inside hook
            } catch {
              /* handled by hook */
            }
          }}
        >
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
      className: "text-center",
    },
    {
      header: "Date",
      accessor: (row) => format(new Date(row.createdAt), "dd MMM yyyy"),
      className: "text-center",
    },
    {
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" onClick={() => navigate(`/admin/orders/${row.id}`)}>View</Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Orders" subtitle="Manage customer orders" />

       <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Row 1: Search */}
        <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search by order id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm"
          />
        </div>

        {/* Row 1: Filters (aligned right) */}
        <div className="flex items-center gap-2">
          <select
            value={filters.orderStatus}
            onChange={(e) => setFilter("orderStatus", String(e.target.value))}
            className="px-3 py-2 border border-border rounded text-sm"
          >
            {ORDER_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilter("paymentStatus", String(e.target.value))}
            className="px-3 py-2 border border-border rounded text-sm"
          >
            {PAYMENT_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        emptyMessage={isLoading ? "Loading..." : "No orders found"}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
            {meta && <span> &mdash; {meta.total} total</span>}
          </p>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setFilter("page", Math.max(1, filters.page - 1))}
                  className={filters.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - filters.page) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <span className="px-2 text-muted-foreground">…</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={filters.page === p}
                        onClick={() => setFilter("page", p as number)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setFilter("page", Math.min(totalPages, filters.page + 1))}
                  className={filters.page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Verify Payment Modal */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setVerifyModalOrder(null)} />
          <div className="relative bg-background border border-border rounded-2xl p-5 w-full max-w-lg z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Payment Details</h3>
                <p className="text-xs text-muted-foreground">{verifyModalOrder.order_id}</p>
              </div>
              <button className="text-muted-foreground" onClick={() => setVerifyModalOrder(null)}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {verifyModalOrder.accountInfo ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{verifyModalOrder.accountInfo.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium">{verifyModalOrder.accountInfo.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Name</p>
                    <p className="font-medium">{verifyModalOrder.accountInfo.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Screenshot</p>
                    {verifyModalOrder.accountInfo.transactionScreenshot ? (
                      <img
                        src={verifyModalOrder.accountInfo.transactionScreenshot}
                        alt="txn"
                        className="w-full max-h-56 object-contain rounded-md border border-border mt-2"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">No screenshot provided</p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      onClick={async () => {
                        try {
                          await verifyPayment.mutateAsync({
                            id: verifyModalOrder.id,
                            payload: { status: PaymentStatus.PAID },
                          });
                          setVerifyModalOrder(null);
                        } catch {}
                      }}
                      disabled={verifyPayment.isPending}
                    >
                      <Check className="w-4 h-4 mr-2" /> Mark as Paid
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await verifyPayment.mutateAsync({
                            id: verifyModalOrder.id,
                            payload: { status: PaymentStatus.FAILED },
                          });
                          setVerifyModalOrder(null);
                        } catch {}
                      }}
                      disabled={verifyPayment.isPending}
                    >
                      <XIcon className="w-4 h-4 mr-2" /> Mark Failed
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No payment information available for this order.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;