import React from "react";
import { z } from "zod";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { InputTextDialog } from "./InputText";

describe("<InputTextDialog />", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should render InputTextDialog correctly", () => {
        act(() => {
            render(
                <InputTextDialog
                    validationSchema={z.string()}
                    title=""
                    positiveLabel=""
                    negativeLabel=""
                    onClosed={() => {}}
                    onClose={() => {}}
                    open
                />,
            );
        });

        const root = screen.getByTestId("InputTextDialog");
        expect(root).toBeInTheDocument();
    });

    it("should render InputTextDialog correctly with description", () => {
        act(() => {
            render(
                <InputTextDialog
                    validationSchema={z.string()}
                    title=""
                    description="MOCK_DESCRIPTION"
                    positiveLabel=""
                    negativeLabel=""
                    onClosed={() => {}}
                    onClose={() => {}}
                    open
                />,
            );
        });

        const description = screen.getByText("MOCK_DESCRIPTION");
        expect(description).toBeInTheDocument();
    });

    it("should not able to submit if input is invalid", async () => {
        await act(async () =>
            render(
                <InputTextDialog
                    validationSchema={z.string().nonempty("non-empty")}
                    title=""
                    positiveLabel="SUBMIT"
                    negativeLabel=""
                    onClosed={() => {}}
                    onClose={() => {}}
                    open
                />,
            ),
        );

        const input = screen.getByRole("textbox");
        await act(async () => fireEvent.focus(input));
        await act(async () => fireEvent.blur(input));

        const submitButton = screen.getByText("SUBMIT");
        expect(submitButton).toBeDisabled();

        const helperText = screen.getByText("non-empty");
        expect(helperText).toBeInTheDocument();
    });

    it("should call corresponding callback when submit", async () => {
        const onClose = jest.fn();

        await act(async () =>
            render(
                <InputTextDialog
                    validationSchema={z.string().nonempty("non-empty")}
                    title=""
                    positiveLabel="SUBMIT"
                    negativeLabel=""
                    onClosed={() => {}}
                    onClose={onClose}
                    open
                />,
            ),
        );

        const input = screen.getByRole("textbox");
        await act(async () => fireEvent.change(input, { target: { value: "MOCK_VALUE" } }));

        const submitButton = screen.getByText("SUBMIT");
        await act(async () => fireEvent.click(submitButton));

        expect(onClose).toBeCalledWith({
            type: "submit",
            value: "MOCK_VALUE",
        });
    });
});
