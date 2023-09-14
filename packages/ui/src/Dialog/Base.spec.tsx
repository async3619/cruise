import React from "react";
import { render, screen } from "@testing-library/react";

import { BaseDialog } from "./Base";
import { DialogActionType } from "./types";

describe("<BaseDialog />", () => {
    it("should render children properly", () => {
        render(
            <BaseDialog open onClose={() => {}} onClosed={() => {}} title="Test" actions={[]}>
                <div data-testid="root">Test</div>
            </BaseDialog>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });

    it("should render actions properly", () => {
        render(
            <BaseDialog
                open
                onClose={() => {}}
                onClosed={() => {}}
                title="Test"
                actions={[{ label: "Action", type: DialogActionType.Positive }]}
            >
                <div data-testid="root">Test</div>
            </BaseDialog>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();

        const testButton = screen.getByText("Action");
        expect(testButton).toBeInTheDocument();
    });

    it("should render a submit button if action type is submit", () => {
        render(
            <BaseDialog
                open
                onClose={() => {}}
                onClosed={() => {}}
                title="Test"
                actions={[{ label: "Action", type: DialogActionType.Submit }]}
            >
                <div data-testid="root">Test</div>
            </BaseDialog>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();

        const testButton = screen.getByText("Action");
        expect(testButton).toBeInTheDocument();
        expect(testButton).toHaveAttribute("type", "submit");
    });
});
