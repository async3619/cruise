import React from "react";

import { act, render, screen } from "@testing-library/react";

import { useToast, useToastQueue } from "./Provider";
import { ToastContainer } from "./Container";
import { Wrapper } from "../../__test__/Wrapper";

describe("useToast()", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should get the toast context values", () => {
        function MockComponent() {
            const context = useToast();

            expect(context).toBeDefined();
            expect(context.queue).toBeDefined();
            expect(context.enqueueToast).toBeDefined();
            expect(context.doWork).toBeDefined();

            return null;
        }

        render(<MockComponent />, {
            wrapper: Wrapper,
        });
    });

    it("should throw an error if used outside of a <ToastProvider />", () => {
        function MockComponent() {
            useToast();

            return null;
        }

        expect(() => render(<MockComponent />)).toThrowError("useToast must be used within a ToastProvider");
    });
});

describe("useToastQueue()", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should get the toast queue", () => {
        function MockComponent() {
            const queue = useToastQueue();
            expect(queue).toBeDefined();

            return null;
        }

        render(<MockComponent />, {
            wrapper: Wrapper,
        });
    });

    it("should throw an error if used outside of a <ToastProvider />", () => {
        function MockComponent() {
            useToast().queue;

            return null;
        }

        expect(() => render(<MockComponent />)).toThrowError("useToast must be used within a ToastProvider");
    });
});

describe("<ToastProvioder />", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should be able to enqueue toast item", () => {
        function MockComponent() {
            const { enqueueToast } = useToast();
            const toastQueue = useToastQueue();

            React.useEffect(() => {
                enqueueToast({ message: "test" });
            }, [enqueueToast]);

            return <div data-testid="root">{toastQueue.length}</div>;
        }

        act(() => {
            render(<MockComponent />, {
                wrapper: Wrapper,
            });
        });

        const root = screen.getByTestId("root");
        expect(root).toHaveTextContent("1");
    });

    it("should be able to update enqueued toast item", () => {
        function MockComponent() {
            const { enqueueToast } = useToast();
            const toastQueue = useToastQueue();

            React.useEffect(() => {
                const toast = enqueueToast({ message: "test" });
                toast.update({ message: "test2" });
            }, [enqueueToast]);

            return <div data-testid="root">{toastQueue[0]?.message}</div>;
        }

        act(() => {
            render(<MockComponent />, {
                wrapper: Wrapper,
            });
        });

        const root = screen.getByTestId("root");
        expect(root).toHaveTextContent("test2");
    });

    it("should be able to close enqueued toast item", () => {
        function MockComponent() {
            const { enqueueToast, queue } = useToast();

            React.useEffect(() => {
                enqueueToast({ message: "test" });
            }, [enqueueToast]);

            return (
                <>
                    <ToastContainer />
                    <div data-testid="result">{queue.length}</div>
                </>
            );
        }

        act(() => {
            render(<MockComponent />, {
                wrapper: Wrapper,
            });
        });

        const toast = screen.getByTestId("Toast");
        act(() => toast.click());

        const result = screen.getByTestId("result");
        expect(result).toHaveTextContent("0");
    });

    it("should be able to do long running work with toast", async () => {
        let resolveFn: () => void;
        function MockComponent() {
            const { doWork } = useToast();

            React.useEffect(() => {
                doWork({
                    work: () => new Promise<void>(resolve => (resolveFn = resolve)),
                    messages: { error: "error", pending: "pending", success: "success" },
                });
            }, [doWork]);

            return <ToastContainer />;
        }

        act(() => {
            render(<MockComponent />, {
                wrapper: Wrapper,
            });
        });

        const toast = screen.getByTestId("Toast");
        expect(toast).toHaveTextContent("pending");

        await act(async () => {
            resolveFn();
        });

        expect(toast).toHaveTextContent("success");
    });

    it("should show error message if work throws an error", async () => {
        let rejectFn: () => void;
        function MockComponent() {
            const { doWork } = useToast();

            React.useEffect(() => {
                doWork({
                    work: () => new Promise<void>((_, reject) => (rejectFn = reject)),
                    messages: { error: "error", pending: "pending", success: "success" },
                }).catch(() => {
                    // ignore
                });
            }, [doWork]);

            return <ToastContainer />;
        }

        act(() => {
            render(<MockComponent />, { wrapper: Wrapper });
        });

        const toast = screen.getByTestId("Toast");
        expect(toast).toHaveTextContent("pending");

        await act(async () => {
            rejectFn();
        });

        expect(toast).toHaveTextContent("error");
    });

    it("should show error message provided by error object if work throws an error", async () => {
        let rejectFn: (e: Error) => void;
        function MockComponent() {
            const { doWork } = useToast();

            React.useEffect(() => {
                doWork({
                    work: () => new Promise<void>((_, reject) => (rejectFn = reject)),
                    messages: { error: "error", pending: "pending", success: "success" },
                }).catch(() => {
                    // ignore
                });
            }, [doWork]);

            return <ToastContainer />;
        }

        act(() => {
            render(<MockComponent />, { wrapper: Wrapper });
        });

        const toast = screen.getByTestId("Toast");
        expect(toast).toHaveTextContent("pending");

        await act(async () => {
            rejectFn(new Error("test"));
        });

        expect(toast).toHaveTextContent("test");
    });
});
