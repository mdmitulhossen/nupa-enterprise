import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import IndustryCard from "@/components/shared/IndustryCard";
import PageBanner from "@/components/shared/PageBanner";
import ProcessStep from "@/components/shared/ProcessStep";
import { Headphones, Lightbulb, Palette, Truck } from "lucide-react";
import { useState } from "react";

const galleryImages = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=300&fit=crop",
];

const problems = [
  "Poor space utilization",
  "Shelves aren't built to last",
  "Disorganized inventory",
  "Limited accessibility",
];

const solutions = [
  "Purpose-driven shelving systems",
  "Load-tested industrial racks",
  "Modular expansion options",
  "Long-term durability",
  "Accessible, cost-effective solutions",
];

const workingMethods = [
  "We analyze your space and storage needs",
  "We recommend the right shelving system",
  "We confirm specs, load capacity, size, count",
  "We deliver + provide installation",
  "We stay available for ongoing support",
];

const processSteps = [
  { icon: <Lightbulb className="w-8 h-8 text-primary" />, title: "Understand" },
  { icon: <Palette className="w-8 h-8 text-primary" />, title: "Design" },
  { icon: <Truck className="w-8 h-8 text-primary" />, title: "Deliver" },
  { icon: <Headphones className="w-8 h-8 text-primary" />, title: "Support" },
];

const industries = [
  { title: "Supershops & Retail Stores", description: "Optimized shelving systems for product display and inventory storage.", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop" },
  { title: "Warehouses & Logistics", description: "High-capacity racking systems for organized and safe bulk storage.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" },
  { title: "Factories & Manufacturing", description: "Durable industrial shelves for raw materials and finished goods.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" },
  { title: "Offices & Archives", description: "Clean and efficient storage solutions for documents and equipment.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
];

const teamMembers = [
  { name: "Minhaz Nokir", role: "Co-Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { name: "Cameron", role: "Business Manager", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Arlene", role: "Head of Sales", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Kristin", role: "HR", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { name: "Arthur", role: "HR", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { name: "Greg", role: "Chief Instructor", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face" },
];

const About = () => {
  const [teamPage, setTeamPage] = useState(0);
  const membersPerPage = 5;
  const totalTeamPages = Math.ceil(teamMembers.length / membersPerPage);
  const currentMembers = teamMembers.slice(teamPage * membersPerPage, (teamPage + 1) * membersPerPage);

  return (
    <MainLayout>
      <PageBanner 
        title="About Nupa Enterprise" 
        subtitle="Nupa Enterprise is Bangladesh's trusted industrial storage provider. We supply shelving systems and supershop shelving solutions — engineered for utility, designed for scale, and built to last across warehouses, factories, retail stores, and more." 
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "About Us" }]} />
      </div>

      {/* Who We Are */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-muted-foreground max-w-4xl mb-8">
            We work closely with retailers, warehouse owners, factories, and offices to deliver storage solutions that match real operational needs. Our focus is not just selling shelves — it's providing the right storage system that supports long-term performance and growth.
          </p>
          <p className="text-muted-foreground max-w-4xl mb-8">
            From off-the-shelf simple industrial racks to Nupa, we've delivered products that are cost-friendly, durable and have efficient re-storage and order satisfaction levels.
          </p>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=450&fit=crop" alt="Warehouse" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">The problem we solve</h2>
              <p className="text-sm text-muted-foreground mb-2">When Spaces Become a Challenge</p>
              <p className="text-muted-foreground mb-6">Businesses across sectors often struggle with:</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                {problems.map((problem, i) => (
                  <li key={i}>• {problem}</li>
                ))}
              </ul>
              <p className="text-muted-foreground text-sm">
                We stepped up to fix that challenge: because we believe fresh, world-standard storage solutions turn these into strategic advantages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution Philosophy */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Solution Philosophy</h2>
              <p className="text-muted-foreground mb-2">Storage that works the way you do.</p>
              <p className="text-muted-foreground mb-6">Every business is different. That's why we focus on:</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                {solutions.map((solution, i) => (
                  <li key={i}>• {solution}</li>
                ))}
              </ul>
              <p className="font-semibold text-sm mb-2">Our goal is simple:</p>
              <p className="text-muted-foreground text-sm">Make storage easier, your space tidier, and more cost-effective.</p>
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=450&fit=crop" alt="Storage" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">How We Work</h2>
          
          {/* Process Steps */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {processSteps.map((step, index) => (
              <ProcessStep key={index} {...step} showArrow={index < processSteps.length - 1} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=450&fit=crop" alt="Working" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Our Working Method</h3>
              <ol className="space-y-3">
                {workingMethods.map((method, i) => (
                  <li key={i} className="text-muted-foreground text-sm">{i + 1}. {method}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Industries We Serve</h2>
          <p className="text-sm text-muted-foreground text-center mb-2">Storage Solutions Designed for Real Business Needs</p>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Our industrial shelving and storage rack systems are trusted by businesses across multiple industries where safety, organization, and efficiency matter.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <IndustryCard key={index} {...industry} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Meet Our Dynamic Team</h2>
          <div className="flex justify-center gap-8 flex-wrap mb-8">
            {currentMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTeamPage(p => Math.max(0, p - 1))}
              disabled={teamPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTeamPage(p => Math.min(totalTeamPages - 1, p + 1))}
              disabled={teamPage === totalTeamPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section> */}

      <CTASection />
    </MainLayout>
  );
};

export default About;
