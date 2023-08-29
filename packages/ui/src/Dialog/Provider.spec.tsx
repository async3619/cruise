import React from "react";
import { act, render, screen } from "@testing-library/react";

import { DialogProvider } from "./Provider";
import { useDialog } from "./context";
import { BaseDialogProps, DialogActionType } from "./types";

function MockDialog({}: BaseDialogProps<any>) {
    return <div data-testid="mock-dialog" />;
}

function MockReturningDialog({ onClose }: BaseDialogProps<void>) {
    return (
        <button
            data-testid="close"
            onClick={() => {
                onClose({ type: DialogActionType.Positive });
            }}
        />
    );
}

describe("<DialogProvider />", () => {
    it("should render DialogProvider properly", () => {
        render(
            <DialogProvider>
                <div data-testid="root">Test</div>
            </DialogProvider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });

    it("should be able to open a dialog", async () => {
        function MockComponent() {
            const dialog = useDialog();
            React.useEffect(() => {
                dialog.openDialog(MockDialog, {});
            }, [dialog]);

            return null;
        }

        act(() => {
            render(
                <DialogProvider>
                    <MockComponent />
                </DialogProvider>,
            );
        });

        const mockDialog = screen.getByTestId("mock-dialog");
        expect(mockDialog).toBeInTheDocument();
    });

    it("should be able return a result from a dialog", async () => {
        function MockComponent() {
            const dialog = useDialog();
            React.useEffect(() => {
                dialog.openDialog(MockReturningDialog, {}).then(res => {
                    expect(res).toEqual({ type: DialogActionType.Positive });
                });
            }, [dialog]);

            return null;
        }

        act(() => {
            render(
                <DialogProvider>
                    <MockComponent />
                </DialogProvider>,
            );
        });

        const close = screen.getByTestId("close");
        act(() => {
            close.click();
        });
    });
});
