import { enqueueToast } from "./utils";
import { ToastItem } from "./types";

describe("enqueueToast()", () => {
    it("should return an array with the new toast item", () => {
        const toastQueue: ToastItem[] = [];
        const newToast: ToastItem = { id: "1", message: "test", close: () => {} };
        const result = enqueueToast(toastQueue, newToast);
        expect(result).toEqual([newToast]);
    });

    it("should return an array with the new toast item and the previous toast item", () => {
        const toastQueue: ToastItem[] = [{ id: "1", message: "test", close: () => {} }];
        const newToast: ToastItem = { id: "2", message: "test", close: () => {} };
        const result = enqueueToast(toastQueue, newToast);
        expect(result).toEqual([toastQueue[0], newToast]);
    });

    it("should remove the first not persistent item if there are 5 or more items", () => {
        const toastQueue: ToastItem[] = [
            { id: "1", message: "test", close: () => {}, loading: true },
            { id: "2", message: "test", close: () => {} },
            { id: "3", message: "test", close: () => {} },
            { id: "4", message: "test", close: () => {} },
            { id: "5", message: "test", close: () => {} },
        ];
        const newToast: ToastItem = { id: "6", message: "test", close: () => {} };
        const result = enqueueToast(toastQueue, newToast);

        expect(result).toEqual([toastQueue[0], toastQueue[2], toastQueue[3], toastQueue[4], newToast]);
    });
});
