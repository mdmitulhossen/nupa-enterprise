/* eslint-disable react-hooks/exhaustive-deps */
import EmptyState from "@/components/layout/EmptyState";
import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchProducts } from "@/services/productService";
import {
  CreateQuoteItemPayload,
  CreateQuotePayload,
  QuoteItemSpecifications,
  useCreateQuote,
} from "@/services/quoteService";
import { useUserStore } from "@/store/userStore";
import { Product } from "@/types/product";
import {
  Check,
  ChevronRight,
  PackageSearch,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpecEntry {
  key: string;
  value: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  specEntries: SpecEntry[];
}

interface QuoteFormValues {
  message: string;
  phoneNumber: string;
  email: string;
  items: {
    productId: string;
    quantity: number;
    name: string;
  }[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const entriesToSpec = (entries: SpecEntry[]): QuoteItemSpecifications => {
  const result: QuoteItemSpecifications = {};
  entries
    .filter((e) => e.key.trim() && e.value.trim())
    .forEach((e) => {
      result[e.key.trim()] = e.value.trim();
    });
  return result;
};

// ─── Spec Builder ─────────────────────────────────────────────────────────────

const SpecBuilder = ({
  entries,
  onChange,
}: {
  entries: SpecEntry[];
  onChange: (entries: SpecEntry[]) => void;
}) => {
  const addEntry = () => onChange([...entries, { key: "", value: "" }]);
  const removeEntry = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const updateEntry = (i: number, field: "key" | "value", val: string) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)));

  const inputBase =
    "flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-muted-foreground/60";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-muted-foreground">
          Specifications
        </label>
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Spec
        </button>
      </div>

      {entries.length === 0 ? (
        <button
          type="button"
          onClick={addEntry}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add specification (color, size, material…)
        </button>
      ) : (
        <div className="space-y-1.5">
          {/* Column headers */}
          <div className="flex items-center gap-2 px-0.5">
            <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Key
            </span>
            <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Value
            </span>
            <span className="w-6" />
          </div>

          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={entry.key}
                onChange={(e) => updateEntry(i, "key", e.target.value)}
                placeholder="e.g. color"
                className={inputBase}
              />
              <input
                value={entry.value}
                onChange={(e) => updateEntry(i, "value", e.target.value)}
                placeholder="e.g. red"
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Live preview badges */}
          {entries.some((e) => e.key.trim() && e.value.trim()) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {entries
                .filter((e) => e.key.trim() && e.value.trim())
                .map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5"
                  >
                    <span className="text-muted-foreground">{e.key}:</span>
                    {e.value}
                  </span>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({
  product,
  selected,
  onToggle,
  onViewDetails,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}) => (
  <div
    className={`relative border rounded-xl overflow-hidden transition-all cursor-pointer group ${
      selected
        ? "border-primary ring-2 ring-primary/20 shadow-sm"
        : "border-border hover:border-primary/40 hover:shadow-sm"
    }`}
    onClick={onToggle}
  >
    {selected && (
      <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow">
        <Check className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
    )}

    <button
      onClick={(e) => {
        e.stopPropagation();
        onViewDetails();
      }}
      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border border-border rounded-lg p-1.5 hover:bg-muted"
      title="View product details"
    >
      <ChevronRight className="w-3.5 h-3.5" />
    </button>

    <div className="aspect-square bg-muted overflow-hidden">
      <img
        src={product.mainProductImage}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div className="p-3">
      <p className="text-xs text-muted-foreground mb-0.5">#{product.p_id}</p>
      <p className="text-sm font-medium line-clamp-2 leading-snug">{product.name}</p>
      {product.category && (
        <p className="text-xs text-muted-foreground mt-1">{product.category.name}</p>
      )}
    </div>
  </div>
);

// ─── Selected Item Row ────────────────────────────────────────────────────────
const SelectedItemRow = ({
  item,
  onRemove,
  onQuantityChange,
  onSpecChange,
}: {
  item: SelectedProduct;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
  onSpecChange: (entries: SpecEntry[]) => void;
}) => (
  <div className="border border-border rounded-xl p-4 space-y-3">
    <div className="flex items-center gap-3">
      <img
        src={item.product.mainProductImage}
        alt={item.product.name}
        className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold line-clamp-1">{item.product.name}</p>
        <p className="text-sm text-muted-foreground">#{item.product.p_id}</p>
      </div>

      {/* Quantity input */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Pieces
        </label>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 1) onQuantityChange(val);
          }}
          className="w-20 px-2.5 py-1.5 text-sm font-semibold text-center border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition tabular-nums"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <SpecBuilder entries={item.specEntries} onChange={onSpecChange} />
  </div>
);

// ─── Product Grid Skeleton ────────────────────────────────────────────────────

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="border border-border rounded-xl overflow-hidden">
        <Skeleton className="aspect-square w-full" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RequestQuote = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const createQuoteMutation = useCreateQuote();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useFetchProducts({
    page: 1,
    limit: 40,
    searchTerm: debouncedSearch || undefined,
    productType: ["ALL","QUOTE_ONLY"],
  });

  const products = data?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    defaultValues: {
      message: "",
      phoneNumber: "",
      email: user?.email ?? "",
      items: [],
    },
  });

  const { append, remove } = useFieldArray({ control, name: "items" });

  // ── product selection ──────────────────────────────────────────────────────

  const toggleProduct = (product: Product) => {
    const idx = selectedProducts.findIndex((s) => s.product.id === product.id);
    if (idx !== -1) {
      setSelectedProducts((prev) => prev.filter((_, i) => i !== idx));
      remove(idx);
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { product, quantity: 1, specEntries: [] },
      ]);
      append({ productId: product.id, quantity: 1,name: product.name });
    }
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    setSelectedProducts((prev) =>
      prev.map((s) => (s.product.id === productId ? { ...s, quantity: qty } : s))
    );
  };

  const handleSpecChange = (productId: string, entries: SpecEntry[]) => {
    setSelectedProducts((prev) =>
      prev.map((s) => (s.product.id === productId ? { ...s, specEntries: entries } : s))
    );
  };

  const handleRemove = (productId: string) => {
    const idx = selectedProducts.findIndex((s) => s.product.id === productId);
    setSelectedProducts((prev) => prev.filter((s) => s.product.id !== productId));
    remove(idx);
  };

  const isProductSelected = (id: string) =>
    selectedProducts.some((s) => s.product.id === id);

  // ── categories ────────────────────────────────────────────────────────────

  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category?.name)
      .filter((c): c is string => Boolean(c));
    return [...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category?.name === activeCategory);
  }, [products, activeCategory]);

  // ── proceed / submit ──────────────────────────────────────────────────────

  const handleProceed = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const onSubmit = async (formData: QuoteFormValues) => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    const quoteItems: CreateQuoteItemPayload[] = selectedProducts.map((s) => ({
      productId: s.product.id,
      quantity: s.quantity,
      name: s.product.name,
      specifications: entriesToSpec(s.specEntries),
    }));

    const payload: CreateQuotePayload = {
      quoteItems,
      message: formData.message,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
    };

    try {
      await createQuoteMutation.mutateAsync(payload);
      setSelectedProducts([]);
      setShowForm(false);
      navigate("/track-quote");
    } catch {
      // handled in service
    }
  };

  // ── shared classes ────────────────────────────────────────────────────────

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const labelClass = "block text-sm font-medium mb-1.5";
  const errorClass = "text-xs text-destructive mt-1";

  const totalUnits = selectedProducts.reduce((s, p) => s + p.quantity, 0);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <MainLayout>
      <PageBanner
        title="Request a Quote"
        subtitle="Select products, specify requirements & get the best price"
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Request Quote" }]} />
      </div>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">

            {/* ── LEFT: Product Browser ────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold">Browse Products</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Click a product card to add it to your quote
                  </p>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="hidden xl:flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-3 py-2 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    {selectedProducts.length} selected
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by name or SKU…"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category chips */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      !activeCategory
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground/40"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setActiveCategory(activeCategory === cat ? null : cat)
                      }
                      className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid */}
              {isLoading ? (
                <ProductGridSkeleton />
              ) : filteredProducts.length === 0 ? (
                <div className="border border-border rounded-2xl">
                  <EmptyState
                    icon={PackageSearch}
                    title="No Products Found"
                    description={
                      search
                        ? `No products matched "${search}". Try a different keyword.`
                        : "No products available right now."
                    }
                    actionLabel={search ? "Clear Search" : undefined}
                    onAction={search ? () => setSearch("") : undefined}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={isProductSelected(product.id)}
                      onToggle={() => toggleProduct(product)}
                      onViewDetails={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Quote Builder ─────────────────────────────────── */}
            <div className="xl:w-[420px] flex-shrink-0">
              <div className="sticky top-24 space-y-4">

                {/* Selected items card */}
                <div className="border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-base">Your Quote</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedProducts.length === 0
                          ? "No products selected yet"
                          : `${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""} · ${totalUnits} unit${totalUnits > 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {selectedProducts.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                        <PackageSearch className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click on a product from the grid to add it here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-0.5">
                      {selectedProducts.map((item) => (
                        <SelectedItemRow
                          key={item.product.id}
                          item={item}
                          onRemove={() => handleRemove(item.product.id)}
                          onQuantityChange={(qty) =>
                            handleQuantityChange(item.product.id, qty)
                          }
                          onSpecChange={(entries) =>
                            handleSpecChange(item.product.id, entries)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {selectedProducts.length > 0 && !showForm && (
                    <Button className="w-full mt-4" onClick={handleProceed}>
                      Continue to Request Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Request Details Form */}
                {showForm && (
                  <div ref={formRef} className="border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base">Request Details</h3>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Phone */}
                      <div>
                        <label className={labelClass}>
                          Phone Number <span className="text-destructive">*</span>
                        </label>
                        <input
                          {...register("phoneNumber", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^(\+?880|0)1[3-9]\d{8}$/,
                              message: "Enter a valid BD phone number",
                            },
                          })}
                          placeholder="+8801XXXXXXXXX"
                          className={inputClass}
                        />
                        {errors.phoneNumber && (
                          <p className={errorClass}>{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelClass}>
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            },
                          })}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                        {errors.email && (
                          <p className={errorClass}>{errors.email.message}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className={labelClass}>
                          Message / Requirements{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <textarea
                          {...register("message", {
                            required: "Please describe your requirements",
                            minLength: {
                              value: 10,
                              message: "Message must be at least 10 characters",
                            },
                          })}
                          rows={4}
                          placeholder="e.g. Please provide best price for bulk order. We need delivery within 2 weeks…"
                          className={`${inputClass} resize-none`}
                        />
                        {errors.message && (
                          <p className={errorClass}>{errors.message.message}</p>
                        )}
                      </div>

                      {/* Summary strip */}
                      <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground border border-border/60">
                        Requesting quote for{" "}
                        <span className="font-semibold text-foreground">
                          {selectedProducts.length} product
                          {selectedProducts.length > 1 ? "s" : ""}
                        </span>{" "}
                        ·{" "}
                        <span className="font-semibold text-foreground">
                          {totalUnits} unit{totalUnits > 1 ? "s" : ""}
                        </span>{" "}
                        total
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={createQuoteMutation.isPending}
                      >
                        {createQuoteMutation.isPending
                          ? "Submitting…"
                          : "Submit Quote Request"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTASection />
    </MainLayout>
  );
};

export default RequestQuote;