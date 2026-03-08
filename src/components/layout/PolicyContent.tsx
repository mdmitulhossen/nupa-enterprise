import { useRef } from "react";

interface PolicyContentProps {
  html: string;
}

/**
 * Renders CMS HTML policy content with proper typography styling.
 * Uses a ref-based approach to inject styles directly, avoiding Tailwind prose issues.
 */
const PolicyContent = ({ html }: PolicyContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{`
        .policy-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .policy-content h2:first-child {
          margin-top: 0;
        }
        .policy-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 2rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .policy-content p {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .policy-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .policy-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .policy-content li {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.75;
        }
        .policy-content strong {
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .policy-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .policy-content a:hover {
          text-decoration: none;
        }
        .policy-content hr {
          border-color: hsl(var(--border));
          margin: 2rem 0;
        }
      `}</style>
      <div
        ref={ref}
        className="policy-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default PolicyContent;