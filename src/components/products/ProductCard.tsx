import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";


interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  // price formatting


  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block max-h-72 relative bg-muted p-4 overflow-hidden">
        <img
          src={product.mainProductImage}
          alt={product.name}
          className="w-full h-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300 rounded-lg"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="mb-2 text-xs ">
            {product.category?.name}
          </Badge>
          <Badge
            variant="default"
            className={`mb-2 text-xs text-white ${product.status === 'IN_STOCK'
                ? 'bg-green-600 hover:bg-green-700'
                : product.status === 'OUT_OF_STOCK'
                  ? 'bg-red-600 hover:bg-red-700'
                  : product.status === 'UPCOMING'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-600 hover:bg-gray-700'
              }`}
          >
            {product.status === 'IN_STOCK'
              ? 'In Stock'
              : product.status === 'OUT_OF_STOCK'
                ? 'Out of Stock'
                : product.status === 'UPCOMING'
                  ? 'Upcoming'
                  : product.status
            }
          </Badge>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Starting from</span>
          <span className="font-bold text-foreground">BDT {product?.productVariations?.[0]?.price?.toLocaleString()}</span>
          {/* {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              BDT {product?.originalPrice?.toLocaleString()}
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating?.average || 0)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{product.rating?.total || 0} reviews</span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" size="sm" asChild>
            <Link to={`/product/${product.id}`}>Buy Now</Link>
          </Button>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
