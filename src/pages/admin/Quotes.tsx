/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quote, QuoteStatus, useFetchAllQuotes, useRespondToQuote, useUpdateQuoteStatus } from "@/services/quoteService";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { Eye, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "PENDING", value: QuoteStatus.PENDING },
  { label: "RESPONDED", value: QuoteStatus.RESPONDED },
  { label: "ACCEPTED", value: QuoteStatus.ACCEPTED },
  { label: "REJECTED", value: QuoteStatus.REJECTED },
  { label: "PROCESSING", value: QuoteStatus.PROCESSING },
  { label: "SHIPPED", value: QuoteStatus.SHIPPED },
  { label: "DELIVERED", value: QuoteStatus.DELIVERED },
  { label: "CANCELLED", value: QuoteStatus.CANCELLED },
];

const Quotes = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    quote_id: "",
    status: "all" as string,
  });
  const [search, setSearch] = useState(filters.quote_id);

  const debounced = useMemo(
    () =>
      debounce((q: string) => {
        setFilters((s) => ({ ...s, quote_id: q, page: 1 }));
      }, 350),
    []
  );

  useEffect(() => {
    debounced(search);
    return () => debounced.cancel();
  }, [search, debounced]);

  const params = useMemo(() => {
    const p: Record<string, unknown> = { page: filters.page, limit: filters.limit };
    if (filters.quote_id) p.quote_id = filters.quote_id;
    if (filters.status && filters.status !== "all") p.status = filters.status;
    return p;
  }, [filters]);

  const { data, isLoading } = useFetchAllQuotes(params);
  const quotes = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const respondMutation = useRespondToQuote();
  const updateStatus = useUpdateQuoteStatus();

  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const [respondingQuote, setRespondingQuote] = useState<Quote | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [quotedPrice, setQuotedPrice] = useState<string>("");

  const setFilter = <K extends keyof typeof filters, V extends typeof filters[K]>(key: K, value: V) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as unknown as number) : 1 }));
  };

  useEffect(() => {
    if (respondingQuote) {
      setAdminResponse(respondingQuote.adminResponse ?? "");
      setQuotedPrice(respondingQuote.quotedPrice ? String(respondingQuote.quotedPrice) : "");
    } else {
      setAdminResponse("");
      setQuotedPrice("");
    }
  }, [respondingQuote]);

  const columns: Column<Quote>[] = [
    { header: "Quote ID", accessor: (r) => <div className="font-medium">{r.quote_id}</div> },
    { header: "Customer", accessor: (r) => r.user?.firstName ?? r.email },
    {
      header: "Items",
      accessor: (r) => `${r.quoteItems.length} item${r.quoteItems.length > 1 ? "s" : ""}`,
      className: "text-center",
    },
    // {
    //   header: "Admin Response",
    //   accessor: (r) => (
    //     <div className="text-sm">
    //       {r.adminResponse ? (
    //         <>
    //           <div className="line-clamp-2 text-muted-foreground">{r.adminResponse}</div>
    //           {r.quotedPrice != null && <div className="text-xs font-semibold mt-1">BDT {r.quotedPrice.toLocaleString()}</div>}
    //         </>
    //       ) : (
    //         <div className="text-xs text-muted-foreground">No response</div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      header: "Status",
      accessor: (r) => (
        <div className="flex items-center gap-2 justify-center">
          <StatusBadge status={r.status as any} />
          <select
            defaultValue={r.status}
            className="px-2 py-1 text-sm border border-border rounded"
            onChange={async (e) => {
              const status = e.target.value as QuoteStatus;
              try {
                await updateStatus.mutateAsync({ id: r.id, payload: { status } });
              } catch {}
            }}
          >
            {Object.values(QuoteStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ),
      className: "text-center",
    },
    { header: "Date", accessor: (r) => format(new Date(r.createdAt), "dd MMM yyyy"), className: "text-center" },
    {
      header: "Action",
      accessor: (r) => (
        <div className="flex items-center gap-2 justify-center">
          <Button size="sm" variant="ghost" onClick={() => setViewQuote(r)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={() => setRespondingQuote(r)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Quote Management" subtitle="Manage customer quote requests and send proposals" />

      {/* Filters bar */}
      <div className="bg-background rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 flex-1">
            <Input placeholder="Search by quote id, email or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm" />
          </div>

          {/* Status select */}
          <div className="flex items-center gap-2">
            <Select value={filters.status} onValueChange={(v) => setFilter("status", String(v))}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* simple page size / refresh area (optional) */}
            <div className="text-sm text-muted-foreground">Total: {total}</div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={quotes} emptyMessage={isLoading ? "Loading..." : "No quotes found"} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages} — {total} total
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setFilter("page", Math.max(1, filters.page - 1))} disabled={filters.page <= 1}>
              Prev
            </Button>
            <div className="px-3 py-1 border border-border rounded text-sm">{filters.page}</div>
            <Button size="sm" variant="ghost" onClick={() => setFilter("page", Math.min(totalPages, filters.page + 1))} disabled={filters.page >= totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Quote Dialog */}
      <Dialog open={!!viewQuote} onOpenChange={() => setViewQuote(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewQuote && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewQuote.quote_id}</h3>
                  <p className="text-xs text-muted-foreground">{format(new Date(viewQuote.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
                {/* <button className="text-muted-foreground" onClick={() => setViewQuote(null)}>
                  <XIcon className="w-4 h-4" />
                </button> */}
              </div>

              <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
                <p className="text-xs text-muted-foreground uppercase">Customer</p>
                <p className="font-medium">{viewQuote.user?.firstName ?? viewQuote.email}</p>
                <p className="text-xs text-muted-foreground">{viewQuote.phoneNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase">Items</p>
                {viewQuote.quoteItems.map((it, i) => (
                  <div key={i} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{it.name ?? it.productId}</p>
                        <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Object.keys(it.specifications).length > 0 && (
                          <div className="space-y-1 text-right">
                            {Object.entries(it.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="font-medium">{k}:</span> {String(v)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {viewQuote.adminResponse && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase">Admin Response</p>
                  <p className="text-sm text-muted-foreground mt-1">{viewQuote.adminResponse}</p>
                  {viewQuote.quotedPrice != null && <p className="text-sm font-semibold mt-2">BDT {viewQuote.quotedPrice.toLocaleString()}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog open={!!respondingQuote} onOpenChange={() => setRespondingQuote(null)}>
        <DialogContent className="max-w-lg">
          {respondingQuote && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Respond to {respondingQuote.quote_id}</h3>
                  <p className="text-xs text-muted-foreground">{respondingQuote.user?.firstName ?? respondingQuote.email}</p>
                </div>
                {/* <button className="text-muted-foreground" onClick={() => setRespondingQuote(null)}>
                  <XIcon className="w-4 h-4" />
                </button> */}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Message</label>
                <textarea value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} rows={4} className="w-full px-3 py-2 border border-border rounded" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Quoted Price (BDT)</label>
                <input value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" onClick={() => setRespondingQuote(null)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!respondingQuote) return;
                    const price = quotedPrice ? Number(quotedPrice) : 0;
                    try {
                      await respondMutation.mutateAsync({ id: respondingQuote.id, payload: { adminResponse: adminResponse.trim(), quotedPrice: price } });
                      setRespondingQuote(null);
                    } catch {}
                  }}
                  disabled={respondMutation.isPending}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Quotes;