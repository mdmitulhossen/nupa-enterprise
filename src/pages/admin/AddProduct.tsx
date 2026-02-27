import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFetchCategories } from "@/services/categoryService";
import { useFetchIndustries } from "@/services/industryService";
import {
  useCreateProduct,
  useFetchProduct,
  useUpdateProduct,
} from "@/services/productService";
import {
  CreateProductPayload,
  ProductStatus,
  ProductType,
} from "@/types/product";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

interface VariationRow {
  id: string;
  depth: string;
  width: string;
  height: string;
  price: string;
  stock: string;
  sku: string;
}

interface ProductFormData {
  name: string;
  categoryId: string;
  industryId: string;
  productType: string;
  shortDescription: string;
  status: string;
  isFeature: boolean;
  isShowInSearch: boolean;
  minimumOrderQuantity: number;
  offer: number;
}

const AddProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<ProductFormData>({
      defaultValues: {
        productType: "BUY_ONLINE",
        status: "IN_STOCK",
        isFeature: false,
        isShowInSearch: true,
        minimumOrderQuantity: 1,
        offer: 0,
      },
    });

  const [detailedDescription, setDetailedDescription] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInputUrl, setGalleryInputUrl] = useState("");
  const [variations, setVariations] = useState<VariationRow[]>([]);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [pendingPublishData, setPendingPublishData] =
    useState<ProductFormData | null>(null);

  const { data: productData } = useFetchProduct(id, isEditMode);
  const { data: categoriesData } = useFetchCategories({ limit: 100 });
  const { data: industriesData } = useFetchIndustries({ limit: 100 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const categories = categoriesData?.data || [];
  const industries = industriesData?.data || [];

  // Populate form in edit mode
  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      reset({
        name: p.name,
        categoryId: p.categoryId,
        industryId: p.industryId,
        productType: p.productType || "BUY_ONLINE",
        shortDescription: p.shortDescription || "",
        status: p.status || "IN_STOCK",
        isFeature: p.isFeature ?? false,
        isShowInSearch: p.isShowInSearch ?? true,
        minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
        offer: p.offer ?? 0,
      });
      setDetailedDescription(p.detailedDescription || "");
      setMainImageUrl(p.mainProductImage || "");
      setGalleryImages(p.galleryProductImages || []);
      if (p.productVariations?.length) {
        setVariations(
          p.productVariations.map((v, i) => ({
            id: i.toString(),
            depth: v.depth?.toString() ?? "",
            width: v.width?.toString() ?? "",
            height: v.height?.toString() ?? "",
            price: v.price.toString(),
            stock: v.stock.toString(),
            sku: v.sku,
          }))
        );
      }
    }
  }, [productData, reset]);

  const buildPayload = (
    data: ProductFormData,
    isActive: boolean
  ): CreateProductPayload => ({
    name: data.name,
    categoryId: data.categoryId,
    industryId: data.industryId,
    productType: data.productType as ProductType,
    shortDescription: data.shortDescription || undefined,
    detailedDescription: detailedDescription || undefined,
    mainProductImage: mainImageUrl || undefined,
    galleryProductImages: galleryImages.length > 0 ? galleryImages : undefined,
    minimumOrderQuantity: data.minimumOrderQuantity,
    productVariations:
      variations.length > 0
        ? variations.map((v) => ({
          depth: v.depth ? parseFloat(v.depth) : undefined,
          width: v.width ? parseFloat(v.width) : undefined,
          height: v.height ? parseFloat(v.height) : undefined,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0,
          sku: v.sku,
        }))
        : undefined,
    status: data.status as ProductStatus,
    isActive,
    isFeature: data.isFeature,
    isShowInSearch: data.isShowInSearch,
    offer: data.offer ? Number(data.offer) : undefined,
  });

  const submitProduct = (data: ProductFormData, isActive: boolean) => {
    const payload = buildPayload(data, isActive);
    if (isEditMode && id) {
      updateProduct.mutate(
        { id, payload },
        { onSuccess: () => navigate("/admin/products") }
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => navigate("/admin/products"),
      });
    }
  };

  const handleSaveDraft = handleSubmit((data) => {
    submitProduct(data, false);
  });

  const handlePublishClick = handleSubmit((data) => {
    setPendingPublishData(data);
    setShowPublishConfirm(true);
  });

  const handleConfirmPublish = () => {
    if (pendingPublishData) {
      submitProduct(pendingPublishData, true);
    }
    setShowPublishConfirm(false);
  };

  // Variations
  const addVariation = () => {
    setVariations([
      ...variations,
      { id: Date.now().toString(), depth: "", width: "", height: "", price: "", stock: "", sku: "" },
    ]);
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const updateVariation = (id: string, field: keyof VariationRow, value: string) => {
    setVariations(variations.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  // Gallery
  const addGalleryImage = () => {
    const trimmed = galleryInputUrl.trim();
    if (trimmed) {
      setGalleryImages([...galleryImages, trimmed]);
      setGalleryInputUrl("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Summary stats
  const totalVariations = variations.length;
  const activeVariations = variations.filter((v) => parseInt(v.stock) > 0).length;
  const totalStock = variations.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0);
  const prices = variations.map((v) => parseFloat(v.price) || 0).filter((p) => p > 0);
  const priceRange =
    prices.length > 0
      ? `৳${Math.min(...prices).toLocaleString()} – ৳${Math.max(...prices).toLocaleString()}`
      : "N/A";

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <AdminLayout>
      <PageHeader
        title={isEditMode ? "Edit Product" : "Add New Product"}
        subtitle={
          isEditMode
            ? "Update product details"
            : "Create a new product with variations and complete details"
        }
      />

      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Product Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. 4-Tier Chrome Wire Shelving Unit"
                    {...register("name", { required: true })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={watch("categoryId")}
                      onValueChange={(v) => setValue("categoryId", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Industry *</Label>
                    <Select
                      value={watch("industryId")}
                      onValueChange={(v) => setValue("industryId", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            {ind.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Product Type</Label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="BUY_ONLINE"
                        {...register("productType")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Buy Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="QUOTATION"
                        {...register("productType")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Quotation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="ALL"
                        {...register("productType")}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">All</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Brief product description"
                    {...register("shortDescription")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="offer">Offer / Discount (%)</Label>
                  <Input
                    id="offer"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0"
                    {...register("offer", { valueAsNumber: true })}
                    className="mt-1 w-32"
                  />
                </div>
              </div>
            </div>

            {/* Product Description – SunEditor */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <Label>Detailed Description</Label>
              <div className="mt-2 rounded-md overflow-hidden border border-border">
                <SunEditor
                  setContents={detailedDescription}
                  onChange={(content) => setDetailedDescription(content)}
                  setOptions={{
                    height: "220px",
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "underline", "italic", "strike"],
                      ["fontColor", "hiliteColor"],
                      ["list"],
                      ["align"],
                      ["link"],
                      ["removeFormat"],
                    ],
                  }}
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              <div className="space-y-6">
                {/* Main Image */}
                <div>
                  <Label htmlFor="mainImageUrl">Main Product Image URL</Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                    Recommended: 800×800px, PNG or JPG
                  </p>
                  <Input
                    id="mainImageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                  />
                  {mainImageUrl && (
                    <div className="mt-3 relative w-24 h-24">
                      <img
                        src={mainImageUrl}
                        alt="Main product"
                        className="w-24 h-24 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setMainImageUrl("")}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <Label>Gallery Images</Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                    Recommended: 800×800px, PNG or JPG — Add image URLs one by one
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/gallery-image.jpg"
                      value={galleryInputUrl}
                      onChange={(e) => setGalleryInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
                    />
                    <Button type="button" variant="outline" onClick={addGalleryImage}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {galleryImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {galleryImages.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 group">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='10'%3ENo img%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Settings */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Order Settings</h3>
              <div>
                <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
                <Input
                  id="minimumOrderQuantity"
                  type="number"
                  min={1}
                  className="w-32 mt-1"
                  {...register("minimumOrderQuantity", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Product Variations */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Product Variations</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage product size options with pricing and inventory
                  </p>
                </div>
                <Button type="button" onClick={addVariation} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Variation
                </Button>
              </div>

              {variations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-medium">Depth</th>
                        <th className="text-left py-2 px-2 font-medium">Width</th>
                        <th className="text-left py-2 px-2 font-medium">Height</th>
                        <th className="text-left py-2 px-2 font-medium">Price (৳)</th>
                        <th className="text-left py-2 px-2 font-medium">Stock</th>
                        <th className="text-left py-2 px-2 font-medium">SKU</th>
                        <th className="py-2 px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((v) => (
                        <tr key={v.id} className="border-b border-border">
                          {(["depth", "width", "height"] as const).map((field) => (
                            <td key={field} className="py-2 px-2">
                              <Input
                                value={v[field]}
                                onChange={(e) => updateVariation(v.id, field, e.target.value)}
                                className="w-20"
                                placeholder='e.g. 18"'
                              />
                            </td>
                          ))}
                          <td className="py-2 px-2">
                            <Input
                              value={v.price}
                              onChange={(e) => updateVariation(v.id, "price", e.target.value)}
                              className="w-24"
                              type="number"
                              min={0}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              value={v.stock}
                              onChange={(e) => updateVariation(v.id, "stock", e.target.value)}
                              className="w-20"
                              type="number"
                              min={0}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              value={v.sku}
                              onChange={(e) => updateVariation(v.id, "sku", e.target.value)}
                              className="w-32"
                              placeholder="SKU-001"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeVariation(v.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No variations added yet. Click "Add Variation" to start.
                </p>
              )}
            </div>
          </div>

          {/* ── Right Column / Sidebar ── */}
          <div className="space-y-6">
            {/* Visibility & Status */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Visibility & Status</h3>
              <div className="space-y-4">
                <div>
                  <Label>Product Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(v) => setValue("status", v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_STOCK">In Stock</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeature">Featured Product</Label>
                  <Switch
                    id="isFeature"
                    checked={watch("isFeature")}
                    onCheckedChange={(v) => setValue("isFeature", v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isShowInSearch">Show in Search</Label>
                  <Switch
                    id="isShowInSearch"
                    checked={watch("isShowInSearch")}
                    onCheckedChange={(v) => setValue("isShowInSearch", v)}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handlePublishClick}
                  disabled={isSubmitting}
                >
                  {isEditMode ? "Update & Publish" : "Publish Product"}
                </Button>
              </div>
            </div>

            {/* Product Summary */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Product Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Variations:</span>
                  <span className="font-medium">{totalVariations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Variations:</span>
                  <span className="font-medium">{activeVariations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Stock:</span>
                  <span className="font-medium">{totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Range:</span>
                  <span className="font-medium text-primary">{priceRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make the product visible on the website. Are you sure you want to publish this product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish} disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Yes, Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AddProduct;