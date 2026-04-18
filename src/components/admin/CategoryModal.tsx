import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCategory, useUpdateCategory } from "@/services/categoryService";
import { useUploadFile } from "@/services/uploadService";
import { Category } from "@/types/category";
import CategoryForm from "./CategoryForm";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
    mode: "add" | "edit";
}

const CategoryModal = ({ isOpen, onClose, category, mode }: CategoryModalProps) => {
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const uploadFileMutation = useUploadFile();

    const handleSubmit = async (name: string, image: File | null) => {
        const payload: { name: string; image?: string } = { name };

        try {
            if (image instanceof File) {
                const uploadedImageUrl = await uploadFileMutation.mutateAsync(image);
                payload.image = uploadedImageUrl;
            }

            if (mode === "add") {
                await createCategoryMutation.mutateAsync(payload);
            } else if (mode === "edit" && category) {
                await updateCategoryMutation.mutateAsync({ id: category.id, payload });
            }
            onClose();
        } catch (error) {
            // Error handled in mutation
        }
    };

    const isPending =
        uploadFileMutation.isPending ||
        (mode === "add" ? createCategoryMutation.isPending : updateCategoryMutation.isPending);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add Category" : "Edit Category"}
                    </DialogTitle>
                </DialogHeader>
                <CategoryForm
                    initialName={category?.name || ""}
                    initialImage={category?.image}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    submitLabel={mode === "add" ? "Create Category" : "Update Category"}
                    title=""
                    subtitle=""
                />
            </DialogContent>
        </Dialog>
    );
};

export default CategoryModal;