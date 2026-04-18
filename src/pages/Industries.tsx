import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import IndustryCard from "@/components/shared/IndustryCard";
import PageBanner from "@/components/shared/PageBanner";
import { Badge } from "@/components/ui/badge";
import { useFetchCms } from "@/services/CMSService";
import { useFetchIndustries } from "@/services/industryService";

const defaultStorageSolutionImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop",
];

const storageSolutions = [
  {
    title: "Storage Shelves",
    description: "Nupa Enterprise offers high-quality storage shelves and racks suitable for factories, workshops, and commercial storage spaces. Our industrial shelving systems are built for strength, flexibility, and safe storage of goods and materials.",
    features: ["Boltless Shelving", "Medium Duty Storage Shelves", "Heavy Duty Industrial Shelves", "Modular Storage Systems"],
    bestFor: ["Factories", "Workshops", "Commercial Storage", "Book Stores"],
    image: defaultStorageSolutionImages[0],
    reverse: false,
  },
  {
    title: "Supershop Shelving Systems",
    description: "Our supershop shelving systems are designed to improve product display, stock organization, and store efficiency. Nupa Enterprise supplies durable and customizable shelving solutions for supershops, grocery stores, and retail chains across Bangladesh.",
    features: ["Gondola Shelving", "Wall-Mounted Retail Shelves", "End Cap Displays", "Promotional Display Racks"],
    bestFor: ["Supershops", "Grocery Stores", "Retail Chains", "Showrooms"],
    image: defaultStorageSolutionImages[1],
    reverse: true,
  },
  {
    title: "Warehouse Racking Systems",
    description: "Nupa Enterprise supplies high-quality warehouse racking systems designed for heavy loads, efficient inventory management, and long-term industrial use. Our warehouse racks are ideal for logistics centers, distribution hubs, and large storage facilities that require safe and organized storage solutions.",
    features: ["Heavy-Duty Pallet Racks", "Selective Racking Systems", "Long Span Storage Racks", "Custom Warehouse Racks"],
    bestFor: ["Warehouses & Logistics Centers", "Distribution Facilities", "Manufacturing Units"],
    image: defaultStorageSolutionImages[2],
    reverse: false,
  },
];

const industries = [
  { title: "Supershops & Retail Stores", description: "Optimized shelving systems for product display and inventory storage.", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop" },
  { title: "Warehouses & Logistics", description: "High-capacity racking systems for organized and safe bulk storage.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" },
  { title: "Factories & Manufacturing", description: "Durable industrial shelves for raw materials and finished goods.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" },
  { title: "Offices & Archives", description: "Clean and efficient storage solutions for documents and equipment.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
];

const Industries = () => {
  const { data: cmsResp } = useFetchCms(true);
  const { data: industriesData } = useFetchIndustries({ limit: 100 });
  const cmsStorageImages = Array.isArray(cmsResp?.data?.storageSolutions)
    ? cmsResp.data.storageSolutions
    : [];

  const resolveStorageImage = (index: number) => cmsStorageImages[index]?.trim() || defaultStorageSolutionImages[index];

  const storageSolutionsWithCmsImages = storageSolutions.map((solution, index) => ({
    ...solution,
    image: resolveStorageImage(index),
  }));

  const industriesListData = industriesData?.data && industriesData?.data.length > 0 ? industriesData?.data : industries;
  const shouldShowIndustries = industriesData?.data && industriesData?.data.length > 0;
  return (
    <MainLayout>
      <PageBanner 
        title="Trusted by Businesses Across Bangladesh" 
        subtitle="Nupa Enterprise provides industrial storage shelves, warehouse racking systems, and supershop shelving solutions tailored to the unique needs of different industries. From retail stores to large warehouses, our storage systems are designed to improve organization, safety, and operational efficiency." 
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Industries" }]} />
      </div>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Storage Solutions Designed Around Real Operations</h2>
          <p className="text-muted-foreground max-w-3xl mb-12">
            Different industries require different storage systems. Load capacity, accessibility, space optimization, and safety standards vary depending on usage. At Nupa Enterprise, we design and supply industry-specific storage shelving and racking solutions that support smooth workflow and long-term reliability.
          </p>

          {/* Storage Solutions */}
          <div className="space-y-16">
            {storageSolutionsWithCmsImages.map((solution, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${solution.reverse ? "lg:flex-row-reverse" : ""}`}>
                <div className={solution.reverse ? "lg:order-2" : ""}>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden">
                    <img src={solution.image} alt={solution.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className={solution.reverse ? "lg:order-1" : ""}>
                  <h3 className="text-xl font-bold mb-4">{solution.title}</h3>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>
                  <div className="mb-4">
                    <p className="font-semibold text-sm mb-2">Available Shelving Systems</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {solution.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Best Used For</p>
                    <div className="flex flex-wrap gap-2">
                      {solution.bestFor.map((item, i) => (
                        <Badge key={i} variant="outline" className="border-primary text-primary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      {shouldShowIndustries && (
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Industries We Serve</h2>
            <p className="text-sm text-muted-foreground mb-2">Storage Solutions Designed for Real Business Needs</p>
            <p className="text-muted-foreground max-w-3xl mb-12">
              Our industrial shelving and storage rack systems are trusted by businesses across multiple industries where safety, organization, and efficiency matter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industriesListData.map((industry, index) => (
                <IndustryCard key={index} {...industry} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </MainLayout>
  );
};

export default Industries;
