import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import ProductGallery from "@/components/products/ProductGallery";
import SpecTable, { ProductSpec } from "@/components/products/SpecTable";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { useFetchProduct } from "@/services/productService";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const initialSpecs: ProductSpec[] = [
  { name: "12 x 36 x 84 h - Lyon Gray 6-Shelf Light-Duty Boltless Shelving", depth: "24", width: "48", height: "25 Dec, 2025", price: 108, quantity: 0 },
  { name: "12 x 42 x 84 h - Lyon Gray 6-Shelf Light-Duty Boltless Shelving", depth: "42", width: "12", height: "25 Dec, 2025", price: 102, quantity: 0 },
  { name: "12 x 36 x 84 h - Lyon Gray 6-Shelf Light-Duty Boltless Shelving Starter", depth: "21", width: "18", height: "20 Dec, 2025", price: 61, quantity: 0 },
  { name: "12 x 42 x 84 h - Lyon Gray 6-Shelf Light-Duty Boltless Shelving", depth: "36", width: "64", height: "25 Dec, 2025", price: 218, quantity: 0 },
  { name: "12 x 36 x 84 h - Lyon Gray 6-Shelf Light-Duty Boltless Shelving", depth: "48", width: "12", height: "25 Dec, 2025", price: 205, quantity: 0 },
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: productData } = useFetchProduct(id);
  const product = productData?.data as Product;
  const [specs, setSpecs] = useState<ProductSpec[]>(initialSpecs);

  const handleQuantityChange = (index: number, delta: number) => {
    setSpecs((prev) =>
      prev.map((spec, i) =>
        i === index
          ? { ...spec, quantity: Math.max(0, spec.quantity + delta) }
          : spec
      )
    );
  };

  // calculate offer price if offer exists

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
          <ProductGallery images={product?.galleryProductImages || [product?.mainProductImage] || []} productName={product?.name || "Product"} />

          {/* Details */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product?.name || "Product"}</h1>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-muted-foreground">Starting from</span>
              {product?.productVariations?.[0]?.price != null && (
                <>
                  <span className="text-xl font-bold">
                    BDT {product.offer
                      ? (product.productVariations![0].price * (1 - product.offer / 100)).toLocaleString()
                      : product.productVariations![0].price.toLocaleString()}
                  </span>
                  {product.offer && (
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
              <span className="text-sm text-muted-foreground">{product?.rating?.total || 100} Reviews</span>
            </div>

            <h3 className="font-semibold mb-3">Product Description</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {product?.shortDescription || "Made to maximize storage space and minimize set-up time. All components attach firmly to one another without the use of fasteners."}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>• Open access to contents from all sides</li>
              <li>• Made of 14-gauge, powder-coated steel</li>
              <li>• 1-1/2"d x 1-1/2"w x 84"h angle posts</li>
              <li>• Levels easily adjust on 1-1/2" centers</li>
              <li>• Optional 5/8" thick particle board decking</li>
              <li>• Configurable with casters (sold separately)</li>
              <li>• Easy to assemble</li>
            </ul>

            {/* Spec Table */}
            <SpecTable specs={specs} onQuantityChange={handleQuantityChange} />

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="flex-1">
                Add to Cart
              </Button>
              <Button className="flex-1">Buy Now</Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
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
            {(product?.relatedProducts || []).map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </div>

      <CTASection />
    </MainLayout>
  );
};

export default ProductDetails;
