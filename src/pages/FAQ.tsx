
import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchCms } from "@/services/CMSService";

const defaultFaqs = [
  {
    question: "What types of storage shelves and racking systems do you provide?",
    answer:
      "Nupa Enterprise provides a wide range of industrial and commercial storage solutions, including warehouse racking systems, heavy-duty storage racks, supershop shelving, retail display shelves, and customized storage systems. Our products are designed to support different load capacities, space layouts, and business needs, making them suitable for warehouses, retail stores, factories, offices, and commercial facilities across Bangladesh.",
  },
  {
    question: "Can I purchase products directly from your website?",
    answer:
      "Yes, many of our products are available for direct purchase through our website. You can browse our catalog, add items to your cart, and complete your purchase online. For custom solutions or bulk orders, we recommend requesting a quotation.",
  },
  {
    question: "Why are some products available only through quotation?",
    answer:
      "Some products require customization based on your specific needs, space dimensions, or load requirements. These products are available through quotation to ensure we provide you with the most accurate pricing and specifications.",
  },
  {
    question: "Do you offer customized storage solutions?",
    answer:
      "Yes, we specialize in creating customized storage solutions tailored to your specific requirements. Our team will work with you to understand your needs and design a system that maximizes your space efficiency.",
  },
  {
    question: "How do I choose the right shelving or racking system for my business?",
    answer:
      "Our experts can help you choose the right system based on factors like your space dimensions, load capacity requirements, accessibility needs, and budget. Contact us for a free consultation.",
  },
  {
    question: "What load capacity do your storage racks support?",
    answer:
      "Our storage racks support various load capacities ranging from light-duty (up to 150kg per shelf) to heavy-duty (up to 3000kg per level). The specific capacity depends on the type of racking system you choose.",
  },
  {
    question: "What materials are used in your shelving systems?",
    answer:
      "We use high-quality materials including powder-coated steel, galvanized steel, and heavy-duty industrial-grade metals. All our products are designed for durability and long-term use.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "You can request a quotation by filling out our online quote form, calling our sales team, or sending an email to sales@nupaenterprise.com. We typically respond within 24 hours.",
  },
  {
    question: "Do you deliver storage systems across Bangladesh?",
    answer:
      "Yes, we deliver to all locations across Bangladesh. Delivery times and costs may vary based on your location and order size.",
  },
  {
    question: "Do you provide installation services?",
    answer:
      "Yes, we offer professional installation services for all our products. Our trained technicians will ensure your storage system is properly installed and ready for use.",
  },
  {
    question: "How long does delivery usually take?",
    answer:
      "Standard delivery typically takes 3-7 business days within Dhaka and 7-14 business days for other locations. Custom orders may require additional time for manufacturing.",
  },
  {
    question: "Why should I choose Nupa Enterprise over other suppliers?",
    answer:
      "We offer high-quality products, competitive pricing, professional installation services, and excellent customer support. Our team has extensive experience in storage solutions and we're committed to helping you find the perfect system for your needs.",
  },
];

const FAQ = () => {
  const { data: cmsResp } = useFetchCms(true);
  const faqs = cmsResp?.data?.faqs ?? defaultFaqs;

  return (
    <MainLayout>
      <PageBanner
        title="Frequently Asked Questions (FAQ)"
        subtitle="Everything You Need to Know About Our Storage Solutions"
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "FAQ" }]} />
      </div>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Any Doubts?</h2>
            <p className="text-xl md:text-2xl font-bold">We are here to help.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-sm font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection />
    </MainLayout>
  );
};

export default FAQ;