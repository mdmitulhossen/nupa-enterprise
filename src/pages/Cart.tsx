import CartItem from "@/components/cart/CartItem";
import MainLayout from "@/components/layout/MainLayout";
import ShippingAddressModal from "@/components/orders/ShippingAddressModal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Lock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, totalPrice } = useCartStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subtotal = totalPrice();
  const shipping = subtotal >= 50000 ? 0 : subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    if (!user) {
      // redirect to login, remember to come back to /cart
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <PageBanner
        title="My Cart"
        subtitle={`${items.length} Products Found`}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "My Cart" }]} />
      </div>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border border-border rounded-xl overflow-hidden">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary mt-4 text-sm hover:underline"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">BDT {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 && subtotal > 0
                          ? "Free"
                          : `BDT ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping === 0 && subtotal > 0 && (
                      <p className="text-xs text-primary">
                        Free shipping on orders over ৳50,000
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-border pt-4 mb-6">
                    <span>Total</span>
                    <span>BDT {total.toLocaleString()}</span>
                  </div>

                  <Button className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to your cart to get started.
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <CTASection />

      {/* Shipping Address Modal */}
      <ShippingAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
};

export default Cart;