import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface CategoryFormProps {
    initialName?: string;
    initialImage?: string;
    onSubmit: (name: string, image: File | null) => void;
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
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialImage || "");

    useEffect(() => {
        setName(initialName);
        setImage(null);
        setPreviewUrl(initialImage || "");
    }, [initialName, initialImage]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setImage(selectedFile);

        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
            return;
        }

        setPreviewUrl(initialImage || "");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name, image);
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
                    <Label htmlFor="image">
                        Category Image {initialImage ? "(leave empty to keep current)" : ""}
                    </Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="w-full mt-2 cursor-pointer"
                        onChange={handleImageChange}
                    />
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Category Preview"
                            className="w-24 h-24 object-cover rounded mt-3 border"
                        />
                    ) : null}
                </div>
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