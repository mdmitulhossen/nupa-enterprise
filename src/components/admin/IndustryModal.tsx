import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateIndustry, useUpdateIndustry } from "@/services/industryService";
import { useUploadFile } from "@/services/uploadService";
import { Industry } from "@/types/industry";
import IndustryForm from "./IndustryForm";

interface IndustryModalProps {
    isOpen: boolean;
    onClose: () => void;
    industry?: Industry | null;
    mode: "add" | "edit";
}

const IndustryModal = ({ isOpen, onClose, industry, mode }: IndustryModalProps) => {
    const createIndustryMutation = useCreateIndustry();
    const updateIndustryMutation = useUpdateIndustry();
    const uploadFileMutation = useUploadFile();

    const handleSubmit = async (name: string, details: string, image: File | null) => {
        const payload: { name: string; details?: string; image?: string } = { name };
        
        if (details) {
            payload.details = details;
        }

        try {
            if (image instanceof File) {
                const uploadedImageUrl = await uploadFileMutation.mutateAsync(image);
                payload.image = uploadedImageUrl;
            }

            if (mode === "add") {
                await createIndustryMutation.mutateAsync(payload);
            } else if (mode === "edit" && industry) {
                await updateIndustryMutation.mutateAsync({ id: industry.id, payload });
            }
            onClose();
        } catch (error) {
            // Error handled in mutation
        }
    };

    const isPending =
        uploadFileMutation.isPending ||
        (mode === "add" ? createIndustryMutation.isPending : updateIndustryMutation.isPending);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add Industry" : "Edit Industry"}
                    </DialogTitle>
                </DialogHeader>
                <IndustryForm
                    initialName={industry?.name || ""}
                    initialImage={industry?.image}
                    initialDetails={industry?.details || ""}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    submitLabel={mode === "add" ? "Create Industry" : "Update Industry"}
                    title=""
                    subtitle=""
                />
            </DialogContent>
        </Dialog>
    );
};

export default IndustryModal;