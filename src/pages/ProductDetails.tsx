import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import ProductGallery from "@/components/products/ProductGallery";
import SpecTable, { ProductSpec } from "@/components/products/SpecTable";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { useFetchProduct } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: productData } = useFetchProduct(id);
  const product = productData?.data as Product;
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (product?.productVariations) {
      const formattedSpecs = product.productVariations.map((variation) => ({
        name: `${product.name} - ${variation.sku}`,
        depth: variation.depth || "N/A",
        width: variation.width || "N/A",
        height: variation.height || "N/A",
        price: variation.price,
        stock: variation.stock,
        sku: variation.sku,
        quantity: 0,
      }));
      setSpecs(formattedSpecs);
    }
  }, [product]);

  const handleQuantityChange = (index: number, delta: number) => {
    setSpecs((prev) =>
      prev.map((spec, i) => {
        if (i !== index) return spec;
        const stock = typeof spec.stock === "number" ? spec.stock : Infinity;
        const newQty = Math.max(0, spec.quantity + delta);
        return { ...spec, quantity: Math.min(newQty, stock) };
      })
    );
  };

  // Get selected specs (quantity > 0)
  const selectedSpecs = specs.filter((s) => s.quantity > 0);

  const handleAddToCart = () => {
    if (selectedSpecs.length === 0) {
      toast.error("Please select at least one product variation.");
      return;
    }
    selectedSpecs.forEach((spec) => {
      addItem({
        id: `${product.id}-${spec.sku}`,
        productId: product.id,
        sku: spec.sku,
        name: spec.name,
        image: product.mainProductImage,
        price: spec.price,
        quantity: spec.quantity,
        stock: typeof spec.stock === "number" ? spec.stock : 999,
      });
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (selectedSpecs.length === 0) {
      toast.error("Please select at least one product variation.");
      return;
    }
    selectedSpecs.forEach((spec) => {
      addItem({
        id: `${product.id}-${spec.sku}`,
        productId: product.id,
        sku: spec.sku,
        name: spec.name,
        image: product.mainProductImage,
        price: spec.price,
        quantity: spec.quantity,
        stock: typeof spec.stock === "number" ? spec.stock : 999,
      });
    });
    navigate("/delivery");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Products", path: "/products" },
            { label: product?.name || "Product Details" },
          ]}
        />

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Gallery */}
          <ProductGallery
            images={product?.galleryProductImages || [product?.mainProductImage] || []}
            productName={product?.name || "Product"}
          />

          {/* Details */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product?.name || "Product"}</h1>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-muted-foreground">Starting from</span>
              {product?.productVariations?.[0]?.price != null && (
                <>
                  <span className="text-xl font-bold">
                    BDT{" "}
                    {product.offer
                      ? (
                          product.productVariations![0].price *
                          (1 - product.offer / 100)
                        ).toLocaleString()
                      : product.productVariations![0].price.toLocaleString()}
                  </span>
                  {product.offer && product.offer !== 0 && (
                    <span className="text-muted-foreground line-through">
                      BDT {product.productVariations![0].price.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product?.rating?.total || 0} Reviews
              </span>
            </div>

            <h3 className="font-semibold mb-3">Product Description</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {product?.shortDescription ||
                "Made to maximize storage space and minimize set-up time."}
            </p>
            {product?.detailedDescription && (
              <div
                className="text-sm text-muted-foreground mb-6 prose prose-sm max-w-none block"
                dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
              />
            )}

            {/* Spec Table */}
            <SpecTable specs={specs || []} onQuantityChange={handleQuantityChange} />

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product?.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="py-16">
            <div className="flex items-center justify-between mb-8">
              <SectionHeader title="Related Products" className="mb-0 text-left" align="left" />
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CTASection />
    </MainLayout>
  );
};

export default ProductDetails;