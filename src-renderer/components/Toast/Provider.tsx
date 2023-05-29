import shortid from "shortid";

import React from "react";

import { ToastContextValues, ToastItem } from "@components/Toast/types";
import { enqueueToast as enqueueToastUtil } from "@components/Toast/utils";

export interface ToastProviderProps {
    children: React.ReactNode;
}

const ToastContext = React.createContext<ToastContextValues | null>(null);

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
export function useToastQueue() {
    return useToast().queue;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [queue, setQueue] = React.useState<ToastItem[]>([]);
    const close = React.useCallback((id: string) => {
        setQueue(oldQueue => {
            return oldQueue.filter(item => item.id !== id);
        });
    }, []);

    const enqueueToast = React.useCallback<ToastContextValues["enqueueToast"]>(
        options => {
            const id = shortid();
            const item: ToastItem = { id, close: () => close(id), ...options };
            setQueue(oldQueue => enqueueToastUtil(oldQueue, item));

            return {
                update: newOptions => {
                    setQueue(oldQueue => {
                        const newQueue = [...oldQueue];
                        const index = newQueue.findIndex(item => item.id === id);
                        if (index !== -1) {
                            newQueue[index] = { ...newQueue[index], ...newOptions };
                        }

                        return newQueue;
                    });
                },
            };
        },
        [close],
    );

    const doWork = React.useCallback<ToastContextValues["doWork"]>(
        async options => {
            const toast = enqueueToast({
                message: options.messages.pending,
                loading: true,
            });

            try {
                const value = await options.work();

                toast.update({
                    message: options.messages.success,
                    severity: "success",
                    loading: false,
                    action: typeof options.action === "function" ? options.action(value) : options.action,
                });

                return value;
            } catch (error) {
                let message: string | undefined;
                if (error instanceof Error) {
                    message = error.message;
                }

                toast.update({
                    message: message || options.messages.error,
                    severity: "error",
                    loading: false,
                });

                throw error;
            }
        },
        [enqueueToast],
    );

    const contextValue = React.useMemo<ToastContextValues>(() => {
        return {
            queue,
            enqueueToast,
            doWork,
        };
    }, [enqueueToast, doWork, queue]);

    return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
}
