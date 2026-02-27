import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const DeleteConfirmationDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the item.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
}: DeleteConfirmationDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;