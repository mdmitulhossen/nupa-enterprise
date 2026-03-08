// components/admin/RatingModal.tsx
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rating, useUpdateRating } from "@/services/ratingService";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    rating: Rating | null;
}

const RatingModal = ({ isOpen, onClose, rating }: RatingModalProps) => {
    const [ratingValue, setRatingValue] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [description, setDescription] = useState("");

    const updateRatingMutation = useUpdateRating();

    useEffect(() => {
        if (rating) {
            setRatingValue(rating.rating);
            setDescription(rating.description);
        }
    }, [rating]);

    const handleClose = () => {
        onClose();
        setRatingValue(0);
        setDescription("");
        setHoveredStar(0);
    };

    const handleSubmit = async () => {
        if (!rating) return;
        try {
            await updateRatingMutation.mutateAsync({
                id: rating.id,
                payload: {
                    rating: ratingValue,
                    description,
                },
            });
            handleClose();
        } catch (error) {
            // Error handled in mutation
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Rating</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* User & Product Info */}
                    <div className="rounded-md bg-muted px-4 py-3 text-sm space-y-1">
                        <p>
                            <span className="text-muted-foreground">User: </span>
                            <span className="font-medium">
                                {rating?.user?.firstName} {rating?.user?.lastName}
                            </span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">Product: </span>
                            <span className="font-medium">{rating?.product?.name}</span>
                        </p>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1.5">
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const starIndex = i + 1;
                                const filled = starIndex <= (hoveredStar || ratingValue);
                                return (
                                    <Star
                                        key={i}
                                        className={`w-7 h-7 cursor-pointer transition-colors ${
                                            filled
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                        }`}
                                        onMouseEnter={() => setHoveredStar(starIndex)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        onClick={() => setRatingValue(starIndex)}
                                    />
                                );
                            })}
                            <span className="ml-2 text-sm text-muted-foreground">
                                {ratingValue} / 5
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write a review..."
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateRatingMutation.isPending || !ratingValue}
                    >
                        {updateRatingMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RatingModal;