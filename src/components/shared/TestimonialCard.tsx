import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  // location: string;
  date: string;
  rating: number;
  content: string;
  avatar?: string;
}

const TestimonialCard = ({ name, date, rating, content, avatar }: TestimonialCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-semibold text-foreground">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{name}</p>
          {/* <p className="text-xs text-muted-foreground">
            <span className="text-primary">📍 {location}</span> • {date}
          </p> */}
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted"}`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;
