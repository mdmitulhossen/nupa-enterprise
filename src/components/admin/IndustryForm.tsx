import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface IndustryFormProps {
    initialName?: string;
    initialImage?: string;
    initialDetails?: string;
    onSubmit: (name: string, details: string, image: File | null) => void;
    isPending: boolean;
    submitLabel: string;
    title: string;
    subtitle: string;
}

const IndustryForm = ({
    initialName = "",
    initialImage,
    initialDetails = "",
    onSubmit,
    isPending,
    submitLabel,
    title,
    subtitle,
}: IndustryFormProps) => {
    const [name, setName] = useState(initialName);
    const [details, setDetails] = useState(initialDetails);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialImage || "");

    useEffect(() => {
        setName(initialName);
        setDetails(initialDetails);
        setImage(null);
        setPreviewUrl(initialImage || "");
    }, [initialName, initialImage, initialDetails]);

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
        onSubmit(name, details, image);
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                    <Label htmlFor="name">Industry Name *</Label>
                    <Input
                        id="name"
                        value={name}
                        className="w-full mt-2"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter industry name"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="details">Industry Details</Label>
                    <Textarea
                        id="details"
                        value={details}
                        className="w-full mt-2 min-h-24"
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Enter industry description and details"
                    />
                </div>

                <div>
                    <Label htmlFor="image">
                        Industry Image {initialImage ? "(leave empty to keep current)" : ""}
                    </Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="w-full mt-2 cursor-pointer"
                        onChange={handleImageChange}
                    />
                    {previewUrl ? (
                        <div className="mt-3 relative w-24 h-24">
                            <img
                                src={previewUrl}
                                alt="Industry Preview"
                                className="w-24 h-24 object-cover rounded border border-border"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (previewUrl?.startsWith("blob:")) {
                                        URL.revokeObjectURL(previewUrl);
                                    }
                                    setImage(null);
                                    setPreviewUrl(initialImage || "");
                                }}
                                className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default IndustryForm;