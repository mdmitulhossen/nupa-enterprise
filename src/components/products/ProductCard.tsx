import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { formatBDT, getDiscountedPrice, hasValidOffer } from "@/utils/formatDiscountPrice";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  IN_STOCK:     { label: "In Stock",     className: "bg-green-600 hover:bg-green-700" },
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-red-600 hover:bg-red-700"   },
  UPCOMING:     { label: "Upcoming",     className: "bg-yellow-600 hover:bg-yellow-700" },
};

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { addItem } = useCartStore();

  const firstVariation = product.productVariations?.[0];
  const originalPrice  = firstVariation?.price ?? 0;
  const finalPrice     = firstVariation ? getDiscountedPrice(originalPrice, product.offer) : 0;
  const showOffer      = hasValidOffer(product.offer) && !!firstVariation;
  const isUnavailable  = product.status === "OUT_OF_STOCK" || product.status === "UPCOMING";
  const status         = STATUS_MAP[product.status] ?? { label: product.status, className: "bg-gray-600" };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariation) {
      toast.error("No variation available.");
      return;
    }
    addItem({
      id:        `${product.id}-${firstVariation.sku}`,
      productId: product.id,
      sku:       firstVariation.sku,
      name:      `${product.name} - ${firstVariation.sku}`,
      image:     product.mainProductImage,
      price:     firstVariation.price,
      stock:     typeof firstVariation.stock === "number" ? firstVariation.stock : 999,
      depth:     firstVariation.depth,
      width:     firstVariation.width,
      height:    firstVariation.height,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* ── Image ── */}
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden bg-muted aspect-[4/3]"
      >
        <img
          src={product.mainProductImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* offer ribbon */}
        {showOffer && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
            -{product.offer}% OFF
          </span>
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {product.category?.name && (
            <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
              {product.category.name}
            </Badge>
          )}
          <Badge
            className={`text-[11px] px-2 py-0.5 text-white border-0 ${status.className}`}
          >
            {status.label}
          </Badge>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 leading-snug hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating?.average || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] text-muted-foreground">
            ({product.rating?.total || 0})
          </span>
        </div>


        {/* Price */}
        <div className="flex items-baseline gap-2">
          {firstVariation ? (
            <>
              <span className="text-lg font-bold text-foreground">
                {formatBDT(finalPrice)}
              </span>
              {showOffer && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatBDT(originalPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Price unavailable</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 text-xs h-9"
            size="sm"
            asChild
          >
            <Link to={`/product/${product.id}`}>View Details</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={handleAddToCart}
            disabled={isUnavailable}
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;