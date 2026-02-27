import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteProduct, useFetchProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: productsResponse, isLoading } = useFetchProducts({
    searchTerm: searchQuery || undefined,
    productType: typeFilter !== "all" ? typeFilter : undefined,
  });

  const deleteProductMutation = useDeleteProduct();
  const products = productsResponse?.data || [];

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

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
          <Link to={`/admin/products/${row.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => handleDeleteClick(row.id)}
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
      <div className="bg-background rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <SearchFilter
              searchPlaceholder="Search products..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="BUY_ONLINE">Buy Online</SelectItem>
              <SelectItem value="QUOTATION">Quotation</SelectItem>
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

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        isLoading={deleteProductMutation.isPending}
      />
    </AdminLayout>
  );
};

export default Products;
