import { SOCIAL_OPTIONS } from "@/components/layout/Footer";
import { useFetchCms } from "@/services/CMSService";
import { Phone } from "lucide-react";

const defaultPhone = "+013 456 25 440";
const defaultSocialLinks: { name: string; key: string; url: string }[] = [];

const TopBar = () => {
  const { data: cmsResp } = useFetchCms(true);

  const phone = cmsResp?.data?.contactInfo?.phone ?? defaultPhone;
  const socialLinks: { name: string; key: string; url: string }[] =
    cmsResp?.data?.socialLinks ?? defaultSocialLinks;

  const resolvedSocialLinks = socialLinks
    .map((link) => {
      const option = SOCIAL_OPTIONS.find((o) => o.key === link.key);
      return option ? { ...link, icon: option.icon } : null;
    })
    .filter(Boolean) as { name: string; key: string; url: string; icon: React.ElementType }[];

  return (
    <div className="bg-foreground text-background py-2 px-4">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </div>

        {resolvedSocialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {resolvedSocialLinks.map(({ key, name, url, icon: Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;