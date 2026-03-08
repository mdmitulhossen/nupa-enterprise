import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import StatCard from "@/components/shared/StatCard";
import TestimonialCard from "@/components/shared/TestimonialCard";
import { Button } from "@/components/ui/button";
import { useFetchRatings } from "@/services/ratingService";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const stats = [
  { value: "500+",  label: "Happy Clients"       },
  { value: "1000+", label: "Projects Completed"   },
  { value: "3+",    label: "Years Experience"     },
  { value: "98%",   label: "Client Satisfaction"  },
];

const LIMIT = 8;

const Testimonials = () => {
  const [page, setPage] = useState(1);

  const { data: ratingsResponse, isLoading } = useFetchRatings({ page, limit: LIMIT });

  const ratings      = ratingsResponse?.data ?? [];
  const total        = ratingsResponse?.meta?.total ?? 0;
  const totalPages   = Math.ceil(total / LIMIT) || 1;

  // ── pagination pages helper ──
  const generatePages = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 4)           pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 3)   pages.push("...");
    pages.push(total);
    return pages;
  };

  const pages = generatePages(page, totalPages);

  return (
    <MainLayout>
      <PageBanner
        title="Trusted by Businesses Across Bangladesh"
        subtitle="Discover why hundreds of companies choose Nupa Enterprise for their storage and shelving needs"
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Testimonials" }]} />
      </div>

      {/* Stats Section — dummy data, unchanged */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Real stories from real businesses that trust Nupa Enterprise
          </p>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-muted/40 animate-pulse h-44" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && ratings.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reviews yet.</p>
            </div>
          )}

          {/* Cards */}
          {!isLoading && ratings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {ratings.map((rating, index) => (
                <TestimonialCard
                  key={rating.id ?? index}
                  name={`${rating.user?.firstName ?? ""} ${rating.user?.lastName ?? ""}`.trim() || "Anonymous"}
                  // location={rating.user?. ?? "Bangladesh"}
                  date={rating.createdAt ? new Date(rating.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  rating={rating.rating}
                  content={rating.description ?? ""}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {pages.map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="px-1 text-muted-foreground select-none">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="icon"
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </MainLayout>
  );
};

export default Testimonials;