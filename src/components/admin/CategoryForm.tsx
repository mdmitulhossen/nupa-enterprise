/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface CategoryFormProps {
    initialName?: string;
    initialImage?: string;
    onSubmit: (name: string, image: File | null | string) => void;
    isPending: boolean;
    submitLabel: string;
    title: string;
    subtitle: string;
}

const CategoryForm = ({
    initialName = "",
    initialImage,
    onSubmit,
    isPending,
    submitLabel,
    title,
    subtitle,
}: CategoryFormProps) => {
    const [name, setName] = useState(initialName);
    const [image, setImage] = useState<File | null | string>(null);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name, image as File | null | string);
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                    <Label htmlFor="name" >Category Name</Label>
                    <Input
                        id="name"
                        value={name}
                        className="w-full mt-2"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="image">Category Image</Label>
                    <Input
                        id="image"
                        value={image as any}
                        className="w-full mt-2"
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Enter category image URL"
                        required
                    />
                </div>
                {/* <div>
                    <Label htmlFor="image">
                        Category Image {initialImage ? "(leave empty to keep current)" : ""}
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

export default CategoryForm;