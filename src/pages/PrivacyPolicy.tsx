import MainLayout from "@/components/layout/MainLayout";
import PolicyContent from "@/components/layout/PolicyContent";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { useFetchCms } from "@/services/CMSService";

const defaultPrivacyPolicy = `
<h2>Privacy Policy</h2>
<p>Last updated: Feb 2026</p>
<p>At <strong>Nupa Enterprise</strong>, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or place an order with us.</p>

<h3>Information We Collect</h3>
<p>We may collect the following types of information:</p>
<ul>
  <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and delivery address when you place an order, request a quotation, or contact us.</li>
  <li><strong>Business Information:</strong> Company name, business type, and operational requirements for customized storage solutions.</li>
  <li><strong>Usage Data:</strong> Pages visited, time spent on site, and browsing behavior to improve our services.</li>
  <li><strong>Payment Information:</strong> We do not store payment card details. All transactions are processed through secure, certified payment gateways.</li>
</ul>

<h3>How We Use Your Information</h3>
<ul>
  <li>To process and fulfill your orders or quotation requests.</li>
  <li>To communicate with you about your order status, delivery, or installation schedule.</li>
  <li>To provide after-sales support and respond to inquiries.</li>
  <li>To send relevant product updates, promotions, or service announcements (you may opt out at any time).</li>
  <li>To improve our website experience and product offerings.</li>
</ul>

<h3>Data Sharing</h3>
<p>We do not sell, trade, or rent your personal information to third parties. We may share data only with trusted logistics and installation partners strictly for the purpose of fulfilling your order.</p>

<h3>Data Security</h3>
<p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of internet transmission is 100% secure, and we encourage you to contact us directly if you have any concerns.</p>

<h3>Your Rights</h3>
<p>You have the right to access, update, or request deletion of your personal data at any time. To exercise these rights, contact us at <a href="mailto:info@nupaenterprise.com">info@nupaenterprise.com</a>.</p>

<h3>Changes to This Policy</h3>
<p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised date. We encourage you to review this policy periodically.</p>
<p>If you have any questions regarding this policy, please contact us at <a href="mailto:info@nupaenterprise.com">info@nupaenterprise.com</a>.</p>
`;

const PrivacyPolicy = () => {
  const { data: cmsResp } = useFetchCms(true);
  const privacyPolicy = cmsResp?.data?.privacyPolicy ?? defaultPrivacyPolicy;

  return (
    <MainLayout>
      <PageBanner
        title="Privacy Policy"
        subtitle="How We Collect, Use, and Protect Your Information"
      />
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      </div>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <PolicyContent html={privacyPolicy} />
        </div>
      </section>
      <CTASection />
    </MainLayout>
  );
};

export default PrivacyPolicy;