import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ContactInfoCard from "@/components/shared/ContactInfoCard";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFetchCms } from "@/services/CMSService";
import { useCreateContact } from "@/services/contactService";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";

// ─── Default fallback ─────────────────────────────────────────────────────────

const defaultContactInfo = {
  phone: "01739-748268",
  email: "sales@nupaenterprise.com",
  address:
    "House-18,20, Road-10, Block-1, South Banasree,ঢাকা মার্কেটের বিপরীতে, Khilgaon, Dhaka, Bangladesh",
  businessHours: "Saturday – Thursday: 9:00 AM – 6:00 PM",
};

// ─── Form types ───────────────────────────────────────────────────────────────

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

const Contact = () => {
  const createContact = useCreateContact();
  const { data: cmsResp } = useFetchCms(true);

  const ci = cmsResp?.data?.contactInfo ?? defaultContactInfo;

  // Build contact info cards from CMS data
  const contactInfoCards = [
    ci.phone && {
      icon: <Phone className="w-5 h-5 text-primary" />,
      title: "Phone",
      subtitle: "Call us anytime",
      value: ci.phone,
    },
    ci.email && {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "Email",
      subtitle: "Send us an email",
      value: ci.email,
    },
    ci.address && {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Location",
      subtitle: "Visit our showroom",
      value: ci.address,
    },
    ci.businessHours && {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Business Hours",
      subtitle: "We're open",
      value: ci.businessHours,
    },
  ].filter(Boolean) as { icon: React.ReactNode; title: string; subtitle: string; value: string }[];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContact.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        subject: data.subject.trim(),
        message: data.message.trim(),
      });
      reset();
    } catch {
      /* handled by hook (toasts) */
    }
  };

  return (
    <MainLayout>
      <PageBanner
        title="Contact Us"
        subtitle="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Contact Us" }]} />
      </div>

      {/* Contact Section */}
      <section className="pb-12 pt-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
              </p>
              <div className="space-y-4">
                {contactInfoCards.map((info, index) => (
                  <ContactInfoCard key={index} {...info} />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background border border-border rounded-xl p-6 lg:p-8">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Your name"
                    className="mt-1"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{String(errors.name.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{String(errors.email.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+8801XXXXXXXXX"
                    className="mt-1"
                    {...register("phone", {
                      pattern: { value: /^\+?\d{7,15}$/, message: "Invalid phone number" },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{String(errors.phone.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="mt-1"
                    {...register("subject", { required: "Subject is required" })}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive mt-1">{String(errors.subject.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={4}
                    className="mt-1"
                    {...register("message", {
                      required: "Message is required",
                      minLength: { value: 5, message: "Too short" },
                    })}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">{String(errors.message.message)}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || createContact.isPending}
                >
                  {createContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 lg:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Find Our Showroom</h2>
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.6877611667384!2d90.42743831543154!3d23.75501809458685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bd5c53f67f%3A0x4d6bf3e27af2a8ee!2sTejgaon%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nupa Enterprise Location"
            />
          </div>
        </div>
      </section>

      <CTASection />
    </MainLayout>
  );
};

export default Contact;