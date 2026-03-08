import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCreateRating } from "@/services/ratingService";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateRatingModal({
  isOpen,
  onClose,
  productId,
  productName,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
}) {
  const [rating, setRating] = useState<number>(5);
  const [description, setDescription] = useState<string>("");
  const createRating = useCreateRating();

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setDescription("");
    }
  }, [isOpen]);

  const submit = async () => {
    if (!productId) return;
    try {
      await createRating.mutateAsync({
        productId,
        rating,
        description: description.trim(),
      });
      onClose();
    } catch {
      // handled by hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Leave Feedback</h3>
              <p className="text-xs text-muted-foreground">{productName ?? productId}</p>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-2">Rating</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`p-2 rounded ${s <= rating ? "bg-yellow-400 text-white" : "bg-muted/20 text-muted-foreground"}`}
                  aria-label={`${s} star`}
                >
                  <Star className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm block mb-2">Comment</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded"
              placeholder="Share your experience (optional)"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={createRating.isPending}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}