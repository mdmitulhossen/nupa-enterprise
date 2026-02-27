import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface IndustryFormProps {
    initialName?: string;
    initialImage?: string;
    onSubmit: (name: string, image: File | null) => void;
    isPending: boolean;
    submitLabel: string;
    title: string;
    subtitle: string;
}

const IndustryForm = ({
    initialName = "",
    initialImage,
    onSubmit,
    isPending,
    submitLabel,
    title,
    subtitle,
}: IndustryFormProps) => {
    const [name, setName] = useState(initialName);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name, image);
    };

    return (
        <div className="w-full mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Industry Name</Label>
                    <Input
                        id="name"
                        value={name}
                        className="mt-2"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter industry name"
                        required
                    />
                </div>
                {/* <div>
                    <Label htmlFor="image">
                        Industry Image {initialImage ? "(leave empty to keep current)" : ""}
                    </Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                    {initialImage && (
                        <img src={initialImage} alt="Current" className="w-24 h-24 object-cover rounded mt-2" />
                    )}
                </div> */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : submitLabel}
                    </Button>
                    {/* <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button> */}
                </div>
            </form>
        </div>
    );
};

export default IndustryForm;