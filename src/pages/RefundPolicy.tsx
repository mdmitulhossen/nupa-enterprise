import MainLayout from "@/components/layout/MainLayout";
import PolicyContent from "@/components/layout/PolicyContent";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { useFetchCms } from "@/services/CMSService";

const defaultRefundPolicy = `
<h2>Refund & Return Policy</h2>
<p>Last updated: Feb 2026</p>
<p>At <strong>Nupa Enterprise</strong>, we stand behind the quality of our storage solutions. We want you to be fully satisfied with your purchase. Please read our refund and return policy carefully before placing an order.</p>

<h3>Eligibility for Returns</h3>
<p>We accept returns or replacements under the following conditions:</p>
<ul>
  <li><strong>Manufacturing Defects:</strong> If a product arrives with a verified manufacturing defect, you are eligible for a replacement or full refund.</li>
  <li><strong>Damaged in Transit:</strong> If products are damaged during delivery, please document the damage at the time of receipt and notify us within <strong>48 hours</strong> of delivery.</li>
  <li><strong>Wrong Product Delivered:</strong> If you receive an incorrect product that does not match your confirmed order, we will arrange for a replacement at no additional cost.</li>
</ul>

<h3>Non-Returnable Items</h3>
<ul>
  <li>Custom-fabricated or made-to-order products are <strong>non-returnable</strong> unless there is a manufacturing defect.</li>
  <li>Products that have been installed, assembled, or modified after delivery.</li>
  <li>Items damaged due to misuse, improper installation (not carried out by our team), or overloading beyond specified capacity.</li>
</ul>

<h3>Refund Process</h3>
<ul>
  <li>To initiate a return or refund, contact us at <a href="mailto:info@nupaenterprise.com">info@nupaenterprise.com</a> or call <strong>+880-1700-000000</strong> within 7 days of delivery.</li>
  <li>Provide your order number, a description of the issue, and supporting photographs.</li>
  <li>Once your claim is reviewed and approved, refunds will be processed within <strong>7 business days</strong> via the original payment method or bank transfer.</li>
  <li>For replacements, our team will coordinate delivery of the corrected product as soon as possible.</li>
</ul>

<h3>Cancellation Policy</h3>
<ul>
  <li>Standard (non-custom) orders may be cancelled before dispatch without any cancellation fee.</li>
  <li>Custom orders can be cancelled within <strong>24 hours</strong> of order confirmation. After production begins, cancellations will incur a charge covering materials and labor costs incurred.</li>
</ul>

<h3>Need Help?</h3>
<p>If you have any concerns about your order or need assistance, our customer support team is available Saturday–Thursday, 9:00 AM – 6:00 PM. Reach us at <a href="mailto:info@nupaenterprise.com">info@nupaenterprise.com</a> or <strong>+880-1700-000000</strong>.</p>
`;

const RefundPolicy = () => {
  const { data: cmsResp } = useFetchCms(true);
  const refundPolicy = cmsResp?.data?.refundPolicy ?? defaultRefundPolicy;

  return (
    <MainLayout>
      <PageBanner
        title="Refund & Return Policy"
        subtitle="Our Commitment to Your Satisfaction"
      />
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Refund Policy" }]} />
      </div>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <PolicyContent html={refundPolicy} />
        </div>
      </section>
      <CTASection />
    </MainLayout>
  );
};

export default RefundPolicy;