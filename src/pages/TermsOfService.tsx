import MainLayout from "@/components/layout/MainLayout";
import PolicyContent from "@/components/layout/PolicyContent";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { useFetchCms } from "@/services/CMSService";

const defaultTermsOfService = `
<h2>Terms of Service</h2>
<p>Last updated: Feb 2026</p>
<p>Welcome to <strong>Nupa Enterprise</strong>. By accessing our website or purchasing our products and services, you agree to be bound by the following Terms of Service. Please read them carefully before proceeding.</p>

<h3>1. About Us</h3>
<p>Nupa Enterprise is a storage solutions provider based in Dhaka, Bangladesh. We work closely with retailers, warehouse owners, factories, and offices to deliver storage solutions that match real operational needs — from off-the-shelf industrial racks to fully customized racking systems designed for long-term performance and growth.</p>

<h3>2. Use of Our Website</h3>
<ul>
  <li>You must be at least 18 years of age or represent a registered business entity to place orders.</li>
  <li>You agree to provide accurate and complete information when registering, placing orders, or requesting quotations.</li>
  <li>You may not use our website for any unlawful purpose or in any way that could damage, disable, or impair our services.</li>
</ul>

<h3>3. Products & Orders</h3>
<ul>
  <li>Product descriptions, dimensions, and load capacities are provided to the best of our knowledge. For custom orders, final specifications will be confirmed in the quotation document.</li>
  <li>All orders are subject to availability. We reserve the right to cancel or modify orders in case of stock unavailability or pricing errors.</li>
  <li>Customized products are manufactured based on approved specifications and may not be returned unless there is a manufacturing defect.</li>
</ul>

<h3>4. Pricing & Payment</h3>
<ul>
  <li>Prices listed on our website are in Bangladeshi Taka (BDT) and are subject to change without prior notice.</li>
  <li>Full or partial advance payment may be required depending on order value and product type.</li>
  <li>Custom and bulk orders require a confirmed purchase order and advance payment before production begins.</li>
</ul>

<h3>5. Delivery</h3>
<ul>
  <li>Delivery timelines are estimates and may vary based on order complexity, location, and logistics conditions.</li>
  <li>Risk of damage or loss passes to the customer upon delivery. We recommend inspecting goods upon receipt.</li>
</ul>

<h3>6. Installation Services</h3>
<p>Where installation is included or requested, our technicians will carry out the work per agreed specifications. Any site-related requirements (power access, space clearance) are the customer's responsibility.</p>

<h3>7. Intellectual Property</h3>
<p>All content on our website, including images, product designs, and text, is the property of Nupa Enterprise. Unauthorized reproduction or use is strictly prohibited.</p>

<h3>8. Limitation of Liability</h3>
<p>Nupa Enterprise shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products beyond the purchase value of the order in question.</p>

<h3>9. Governing Law</h3>
<p>These Terms of Service are governed by the laws of the People's Republic of Bangladesh. Any disputes shall be resolved under the jurisdiction of Dhaka courts.</p>

<h3>10. Contact</h3>
<p>For any questions about these terms, please reach out to us at <a href="mailto:info@nupaenterprise.com">info@nupaenterprise.com</a> or call <strong>+880-1700-000000</strong>.</p>
`;

const TermsOfService = () => {
  const { data: cmsResp } = useFetchCms(true);
  const termsOfService = cmsResp?.data?.termsOfService ?? defaultTermsOfService;

  return (
    <MainLayout>
      <PageBanner
        title="Terms of Service"
        subtitle="Please Read These Terms Carefully Before Using Our Services"
      />
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Terms of Service" }]} />
      </div>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <PolicyContent html={termsOfService} />
        </div>
      </section>
      <CTASection />
    </MainLayout>
  );
};

export default TermsOfService;