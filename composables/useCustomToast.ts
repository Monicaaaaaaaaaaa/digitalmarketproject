import { toast } from "vue-sonner";

type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading"
  | "dismiss";

export function useCustomToast() {
  function showToast(
    msg: string,
    type: ToastType,
    id?: string | number,
    duration: number = 5000,
    richColors: boolean = true
  ): string | number {
    // Helper function to create a toast
    const createToast = (): string | number => {
      switch (type) {
        case "error":
          return toast.error(msg, {
            duration,
            richColors: richColors,
          });
        case "info":
          return toast.info(msg, {
            duration,
            richColors: richColors,
          });
        case "loading":
          return toast.loading(msg, {
            duration: Infinity, // Keep it infinite until you update it
            richColors: richColors,
          });
        case "success":
          return toast.success(msg, {
            id,
            duration,
            richColors: richColors,
          });
        case "dismiss":
          toast.dismiss(id);
          return id ?? 0;
        case "warning":
          return toast.warning(msg, {
            duration,
            richColors: richColors,
          });
      }
    };

    // Handle existing toast dismissal with a delay
    if (id != null) {
      toast.dismiss(); // Dismiss the old toast
      // Use a setTimeout to create the new toast after a delay
      setTimeout(() => createToast(), 300); // Delay of 300ms
      return id; // Return the ID immediately for consistency
    }

    // Create a new toast directly if no ID is provided
    return createToast();
  }

  return { showToast };
}
