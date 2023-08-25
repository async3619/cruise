import { ToastItem } from "./types";

export function enqueueToast(toastQueue: ToastItem[], newToast: ToastItem): ToastItem[] {
    const newItems = [...toastQueue, newToast];
    // if 5 or more items, remove the first not persistent item
    if (newItems.length > 5) {
        const firstIndex = newItems.findIndex(item => !item.persist && !item.loading);
        if (firstIndex >= 0) {
            newItems.splice(firstIndex, 1);
        }
    }

    return newItems;
}
