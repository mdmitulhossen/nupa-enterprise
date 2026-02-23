// convenience re‑export so components can import from a single location
// and avoid having to know the path to the ui/sonner component

import { toast as sonnerToast } from "@/components/ui/sonner";

export const toast = sonnerToast;

// additional helpers can be added here (e.g. showSuccess, showError, etc.)
