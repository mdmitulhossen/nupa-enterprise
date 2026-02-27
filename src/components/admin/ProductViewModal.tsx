import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product";
import { ImageOff, Layers, Package, Star, Tag } from "lucide-react";

interface ProductViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
        <span className="text-sm font-medium text-foreground">{value ?? "—"}</span>
    </div>
);

const statusColorMap: Record<string, string> = {
    IN_STOCK: "bg-green-100 text-green-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    UPCOMING: "bg-yellow-100 text-yellow-700",
};

const typeColorMap: Record<string, string> = {
    BUY_ONLINE: "bg-blue-100 text-blue-700",
    QUOTATION: "bg-purple-100 text-purple-700",
};

const ProductViewModal = ({ product, isOpen, onClose }: ProductViewModalProps) => {
    if (!product) return null;

    const statusClass = statusColorMap[product.status ?? ""] ?? "bg-gray-100 text-gray-600";
    const typeClass = typeColorMap[product.productType ?? ""] ?? "bg-gray-100 text-gray-600";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold leading-tight pr-6">
                        {product.name}
                    </DialogTitle>
                    {product.p_id && (
                        <p className="text-xs text-muted-foreground">ID: {product.p_id}</p>
                    )}
                </DialogHeader>

                <div className="space-y-6 mt-2">
                    {/* ── Images ── */}
                    <div className="flex gap-4 flex-wrap">
                        {/* Main Image */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Main Image</span>
                            {product.mainProductImage ? (
                                <img
                                    src={product.mainProductImage}
                                    alt={product.name}
                                    className="w-28 h-28 object-cover rounded-lg border border-border"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-lg border border-border bg-muted flex items-center justify-center">
                                    <ImageOff className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {product.galleryProductImages && product.galleryProductImages.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Gallery</span>
                                <div className="flex gap-2 flex-wrap">
                                    {product.galleryProductImages.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Gallery ${i + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-border"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* ── Basic Info ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-primary" />
                            <h4 className="font-semibold text-sm">Basic Information</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="Category" value={product.category?.name} />
                            <Field label="Industry" value={product.industry?.name} />
                            <Field
                                label="Product Type"
                                value={
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeClass}`}>
                                        {product.productType === "BUY_ONLINE" ? "Buy Online" : product.productType === "QUOTATION" ? "Quotation" : product.productType}
                                    </span>
                                }
                            />
                            <Field
                                label="Status"
                                value={
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                                        {product.status?.replace(/_/g, " ")}
                                    </span>
                                }
                            />
                            <Field
                                label="Active"
                                value={
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {product.isActive !== false ? "Active" : "Draft"}
                                    </span>
                                }
                            />
                            <Field
                                label="Featured"
                                value={
                                    product.isFeature ? (
                                        <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400" /> Yes
                                        </span>
                                    ) : "No"
                                }
                            />
                            <Field label="Show in Search" value={product.isShowInSearch ? "Yes" : "No"} />
                            <Field label="Min. Order Qty" value={product.minimumOrderQuantity ?? 1} />
                            <Field label="Offer / Discount" value={product.offer ? `${product.offer}%` : "None"} />
                        </div>
                    </div>

                    {/* ── Descriptions ── */}
                    {(product.shortDescription || product.detailedDescription) && (
                        <>
                            <Separator />
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-primary" />
                                    <h4 className="font-semibold text-sm">Description</h4>
                                </div>
                                {product.shortDescription && (
                                    <div className="mb-3">
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">Short Description</span>
                                        <p className="text-sm text-foreground">{product.shortDescription}</p>
                                    </div>
                                )}
                                {product.detailedDescription && (
                                    <div>
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">Detailed Description</span>
                                        <div
                                            className="text-sm text-foreground prose prose-sm max-w-none border border-border rounded-lg p-3 bg-muted/30"
                                            dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Variations ── */}
                    {product.productVariations && product.productVariations.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Layers className="w-4 h-4 text-primary" />
                                    <h4 className="font-semibold text-sm">
                                        Product Variations
                                        <Badge variant="secondary" className="ml-2 text-xs">{product.productVariations.length}</Badge>
                                    </h4>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                {["Depth", "Width", "Height", "Price (৳)", "Stock", "SKU"].map((h) => (
                                                    <th key={h} className="text-left px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.productVariations.map((v, i) => (
                                                <tr key={i} className="border-t border-border">
                                                    <td className="px-3 py-2">{v.depth ?? "—"}</td>
                                                    <td className="px-3 py-2">{v.width ?? "—"}</td>
                                                    <td className="px-3 py-2">{v.height ?? "—"}</td>
                                                    <td className="px-3 py-2 font-medium">৳{v.price.toLocaleString()}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            {v.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 font-mono text-xs">{v.sku}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Rating ── */}
                    {product.rating && (
                        <>
                            <Separator />
                            <div className="flex gap-6">
                                <Field
                                    label="Rating"
                                    value={
                                        <span className="inline-flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                                            {product.rating.average.toFixed(1)}
                                        </span>
                                    }
                                />
                                <Field label="Total Reviews" value={product.rating.total} />
                            </div>
                        </>
                    )}

                    {/* ── Timestamps ── */}
                    {(product.createdAt || product.updatedAt) && (
                        <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                {product.createdAt && (
                                    <Field label="Created At" value={new Date(product.createdAt).toLocaleString()} />
                                )}
                                {product.updatedAt && (
                                    <Field label="Last Updated" value={new Date(product.updatedAt).toLocaleString()} />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductViewModal;
