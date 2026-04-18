interface IndustryCardProps {
  image: string;
  name: string;
  details: string;
}

const IndustryCard = ({ image, name, details }: IndustryCardProps) => {
  return (
    <div className="group">
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground">{details}</p>
    </div>
  );
};

export default IndustryCard;
