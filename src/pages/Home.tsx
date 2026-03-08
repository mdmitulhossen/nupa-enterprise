import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import CTASection from "@/components/shared/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
// import { demoProducts } from "@/data/products";
import { useTitle } from '@/hooks/useTitle';
import { useFetchCategories } from "@/services/categoryService";
import { useFetchProducts } from "@/services/productService";
import { useFetchRatings } from "@/services/ratingService";
import { Category } from "@/types/category";
import { CheckCircle, Headphones, Search, Shield, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  { name: "Office Racks/Shelves", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", link: "/products?cat=office" },
  { name: "Supermarket Racks", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop", link: "/products?cat=supermarket" },
  { name: "Silo Racking", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop", link: "/products?cat=silo" },
  { name: "Meso Storage", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", link: "/products?cat=meso" },
  { name: "Wire Racks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", link: "/products?cat=wire" },
  { name: "Warehouse Storage", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop", link: "/products?cat=warehouse" },
];

const industries = [
  { name: "Supershops & Retail Stores", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop" },
  { name: "Warehouses & Logistics", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" },
  { name: "Factories & Manufacturing", image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop" },
  { name: "Offices & Archives", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
];

const testimonials = [
  { name: "Mahin Khan", company: "ABC Supershop", rating: 5, text: "Excellent quality shelving units. Our store organization improved significantly!" },
  { name: "Rahim Ahmed", company: "XYZ Warehouse", rating: 5, text: "Very professional service and the racks are extremely durable." },
  { name: "Sarah Islam", company: "Tech Solutions BD", rating: 5, text: "Best storage solutions provider in Bangladesh. Highly recommend!" },
];

const features = [
  { icon: Shield, title: "Heavy Duty Built Quality", desc: "Built to last with premium materials" },
  { icon: Truck, title: "Custom Storage Solutions", desc: "Tailored to your specific needs" },
  { icon: CheckCircle, title: "Easy Installation/Assembly", desc: "Quick and hassle-free setup" },
  { icon: Headphones, title: "24/7 Delivery Support", desc: "We're here whenever you need us" },
];

const Home = () => {
  useTitle("NUPA Enterprise - Home");

  const navigate = useNavigate();
  const [homeSearch, setHomeSearch] = useState("");
  const [homeCat, setHomeCat] = useState("");

   const { data: cats} = useFetchCategories({ limit: 100 });
     const { data: productsData } = useFetchProducts({ limit: 6, isFeature: true });

   const { data: ratingsResponse } = useFetchRatings({
             isFeatured:true
         });


  const submitSearch = () => {
    const params = new URLSearchParams();
    if (homeSearch.trim()) params.set("searchTerm", homeSearch.trim());
    if (homeCat) params.set("cat", homeCat);
    navigate(`/products?${params.toString()}`);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitSearch();
  };

  const categoryData = cats?.data ? cats?.data : categories

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-foreground text-background">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop"
            alt="Warehouse"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Industrial Storage & Shelving Solutions Built for Performance
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Premium quality storage systems for warehouses, supershops, and industrial facilities across Bangladesh.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Explore Now</Link>
            </Button>
          </div>

          {/* Search Bar */}
 <div className="mt-12 max-w-3xl mx-auto bg-background rounded-lg p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 bg-transparent outline-none text-foreground"
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
            onKeyDown={onKey}
          />
        </div>
        <select
          className="px-4 py-2 bg-muted rounded-lg text-foreground text-sm outline-none"
          value={homeCat}
          onChange={(e) => setHomeCat(e.target.value)}
        >
          <option value="">All Categories</option>
          {(cats?.data)?.map((c: Category) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button onClick={submitSearch}>Search</Button>
      </div>
          {/* Feature Icons */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-background/10 backdrop-blur-sm rounded-lg p-4">
                <feature.icon className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve (Alternating) */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Industries we serve"
            subtitle="Nupa Enterprise provides complete storage and shelving solutions for retail, commercial, and industrial sectors across Bangladesh."
          />

          {/* Storage Shelves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop"
                alt="Storage Shelves"
                className="w-full h-[300px] lg:h-[400px] object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Storage Shelves</h3>
              <p className="text-muted-foreground mb-6">
                Nupa Enterprise designs and supplies heavy-duty storage shelves for warehouse facilities tailored to Bangladesh's logistics and retail needs.
              </p>
              <h4 className="font-semibold mb-2">Available Shelving Systems:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multi-tier Shelving</li>
                <li>• Heavy-Duty Boltless Racks</li>
                <li>• Adjustable Metal Shelves</li>
              </ul>
              <Link to="/products" className="inline-block mt-6 text-primary font-medium hover:underline">
                View Products →
              </Link>
            </div>
          </div>

          {/* Supershop Shelving Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
            <div className="lg:order-2 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=500&fit=crop"
                alt="Supershop Shelving"
                className="w-full h-[300px] lg:h-[400px] object-cover"
              />
            </div>
            <div className="lg:order-1">
              <h3 className="text-2xl font-bold mb-4">Supershop Shelving Systems</h3>
              <p className="text-muted-foreground mb-6">
                Design the perfect retail display with our supershop and gondola shelving systems. From grocery stores to department stores, we have the solutions.
              </p>
              <h4 className="font-semibold mb-2">Supershop Shelving Types:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gondola Shelving</li>
                <li>• End Cap Displays</li>
                <li>• Checkout Counter Racks</li>
              </ul>
              <Link to="/products" className="inline-block mt-6 text-primary font-medium hover:underline">
                Read More →
              </Link>
            </div>
          </div>

          {/* Warehouse Racking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=500&fit=crop"
                alt="Warehouse Racking"
                className="w-full h-[300px] lg:h-[400px] object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Warehouse Racking Systems</h3>
              <p className="text-muted-foreground mb-6">
                Industrial-grade racking solutions for logistics centers and distribution warehouses. Maximize vertical space utilization.
              </p>
              <h4 className="font-semibold mb-2">Types of Warehouse Racks:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pallet Racking Systems</li>
                <li>• Cantilever Racks</li>
                <li>• Drive-In Racking</li>
              </ul>
              <Link to="/products" className="inline-block mt-6 text-primary font-medium hover:underline">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse our collection of industrial storage solutions organized by category"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categoryData?.map((cat, index) => (
              <Link
                key={index}
                to={'/products?cat=' + cat.id}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-medium text-sm">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Products"
            subtitle="Browse our bestselling storage and shelving solutions"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {productsData?.data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Nupa Enterprise */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Nupa Enterprise"
            subtitle="Premium Storage Solutions for Every Need"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 text-center border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Industries We Serve"
            subtitle="We provide customized shelving and storage solutions for various industry verticals."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="group relative rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src={industry.image}
                  alt={industry.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex items-end p-4">
                  <p className="text-background font-medium text-sm">{industry.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {
        ratingsResponse && ratingsResponse?.data && (
          <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Client Testimonials"
            subtitle="What our clients say about our storage solutions"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ratingsResponse?.data?.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{testimonial.user.firstName?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.user?.firstName}</p>
                    {/* <p className="text-sm text-muted-foreground">{testimonial.}</p> */}
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        )
      }

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  );
};

export default Home;
