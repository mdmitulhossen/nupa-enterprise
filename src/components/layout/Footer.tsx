import logo from "@/assets/logo.svg";
import { useFetchCms } from "@/services/CMSService";
import {
  Bookmark,
  Facebook, // TikTok placeholder (lucide has no TikTok)
  Ghost,
  Instagram,
  Linkedin, // WhatsApp placeholder
  Mail,
  MapPin, // not in lucide, using Bookmark
  MessageCircle, // Reddit placeholder
  MessageSquare,
  Music2,
  Phone,
  Twitter,
  Youtube
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Static nav data ──────────────────────────────────────────────────────────

const productLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Industries", path: "/industries" },
  { label: "Request a Quote", path: "/request-quote" },
  { label: "Track your Order", path: "/track-order" },
];

const companyLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms Of Service", path: "/terms-of-service" },
  { label: "Refund Policy", path: "/refund-policy" },
];

// ─── Default fallback data ────────────────────────────────────────────────────

const defaultContactInfo = {
  phone: "01739-748268",
  email: "sales@nupaenterprise.com",
  address: "House-18,20, Road-10, Block-L South Banasree, Dhaka, Bangladesh",
  businessHours: "Saturday – Thursday: 9:00 AM – 6:00 PM",
};

const defaultSocialLinks: { name: string; key: string; url: string }[] = [];

// ─── Social icon map ──────────────────────────────────────────────────────────

export const SOCIAL_OPTIONS = [
  { name: "Facebook",  key: "facebook",  icon: Facebook        },
  { name: "Instagram", key: "instagram", icon: Instagram       },
  { name: "YouTube",   key: "youtube",   icon: Youtube         },
  { name: "Twitter",   key: "twitter",   icon: Twitter         },
  { name: "LinkedIn",  key: "linkedin",  icon: Linkedin        },
  { name: "TikTok",    key: "tiktok",    icon: Music2          },
  { name: "Snapchat",  key: "snapchat",  icon: Ghost           },
  { name: "Pinterest", key: "pinterest", icon: Bookmark        },
  { name: "Reddit",    key: "reddit",    icon: MessageCircle   },
  { name: "WhatsApp",  key: "whatsapp",  icon: MessageSquare   },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Footer = () => {
  const { data: cmsResp } = useFetchCms(true);

  const contactInfo = cmsResp?.data?.contactInfo ?? defaultContactInfo;
  const socialLinks: { name: string; key: string; url: string }[] =
    cmsResp?.data?.socialLinks ?? defaultSocialLinks;

  // Match CMS social links with icon map
  const resolvedSocialLinks = socialLinks
    .map((link) => {
      const option = SOCIAL_OPTIONS.find((o) => o.key === link.key);
      return option ? { ...link, icon: option.icon } : null;
    })
    .filter(Boolean) as { name: string; key: string; url: string; icon: React.ElementType }[];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="NUPA Logo" className="h-8 w-auto invert" />
              <div>
                <h3 className="font-bold text-lg">NUPA</h3>
                <p className="text-xs tracking-widest text-muted-foreground">ENTERPRISE</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Bangladesh's trusted provider of industrial storage solutions, warehouse racks, and supershop shelving systems.
            </p>

            {/* Dynamic social links */}
            {resolvedSocialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {resolvedSocialLinks.map(({ key, name, url, icon: Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Contact Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {contactInfo.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{contactInfo.email}</span>
                </li>
              )}
              {contactInfo.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nupa Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;