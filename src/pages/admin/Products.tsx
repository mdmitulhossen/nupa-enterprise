import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import ProductViewModal from "@/components/admin/ProductViewModal";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useFetchCategories } from "@/services/categoryService";
import { useDeleteProduct, useFetchProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { Eye, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const { filters, setFilter, toQueryParams, pageSize } = useProductFilters();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const { data: productsResponse, isLoading } = useFetchProducts(toQueryParams());
  const { data: categoriesData } = useFetchCategories({ limit: 200 });
  const deleteProductMutation = useDeleteProduct();

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;
  const totalPages = meta ? Math.ceil(meta.total / pageSize) : 1;
  const categories = categoriesData?.data || [];

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProductMutation.mutateAsync(deleteTargetId);
    } catch {
      // handled in mutation
    } finally {
      setDeleteTargetId(null);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: "Product Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Category",
      accessor: (row) => row.category?.name ?? "—",
    },
    {
      header: "Type",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (row) => row.productType ? <StatusBadge status={row.productType as any} /> : <span>—</span>,
      className: "text-center",
    },
    {
      header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (row) => row.status ? <StatusBadge status={row.status as any} /> : <span>—</span>,
      className: "text-center",
    },
    {
      header: "Featured",
      accessor: (row) =>
        row.isFeature ? (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mx-auto" />
        ) : (
          <span className="text-muted-foreground text-xs mx-auto block text-center">—</span>
        ),
      className: "text-center",
    },
    {
      header: "Active",
      accessor: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.isActive !== false
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
            }`}
        >
          {row.isActive !== false ? "Active" : "Draft"}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Action",
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setViewProduct(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Link to={`/admin/products/${row.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setDeleteTargetId(row.id)}
            disabled={deleteProductMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Products Management"
          subtitle="Manage your product catalog"
        />
        <Link to="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl border border-border p-4 mb-6 space-y-3">
        {/* Row 1: Search */}
        <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search products..."
            defaultValue={filters.searchTerm}
            onChange={(e) => setFilter("searchTerm", e.target.value)}
            className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm"
          />
        </div>

        {/* Row 2: Dropdowns */}
        <div className="flex flex-wrap gap-3">
          {/* Category */}
          <Select value={filters.categoryId} onValueChange={(v) => setFilter("categoryId", v)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={filters.status} onValueChange={(v) => setFilter("status", v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="IN_STOCK">In Stock</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
            </SelectContent>
          </Select>

          {/* Type */}
          <Select value={filters.productType} onValueChange={(v) => setFilter("productType", v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="BUY_ONLINE">Buy Online</SelectItem>
              <SelectItem value="QUOTATION">Quotation</SelectItem>
            </SelectContent>
          </Select>

          {/* Featured */}
          <Select value={filters.isFeature} onValueChange={(v) => setFilter("isFeature", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>

          {/* Active / Draft */}
          <Select value={filters.isActive} onValueChange={(v) => setFilter("isActive", v)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Active & Draft</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Draft Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        emptyMessage={isLoading ? "Loading..." : "No products found"}
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

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        isLoading={deleteProductMutation.isPending}
      />

      {/* Product View Modal */}
      <ProductViewModal
        product={viewProduct}
        isOpen={Boolean(viewProduct)}
        onClose={() => setViewProduct(null)}
      />
    </AdminLayout>
  );
};

export default Products;
