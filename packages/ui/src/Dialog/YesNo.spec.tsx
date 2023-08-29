import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { YesNoDialog } from "./YesNo";
import { Wrapper } from "../../__test__/Wrapper";
import { DialogActionType } from "./types";

describe("<YesNoDialog />", () => {
    it("should render YesNoDialog component properly", () => {
        render(
            <YesNoDialog
                onClose={() => {}}
                onClosed={() => {}}
                title=""
                open
                description=""
                negativeLabel=""
                positiveLabel=""
            />,
            {
                wrapper: Wrapper,
            },
        );

        const item = screen.getByTestId("YesNoDialog");
        expect(item).toBeInTheDocument();
    });

    it("should render description when description is provided", () => {
        render(
            <YesNoDialog
                onClose={() => {}}
                onClosed={() => {}}
                title=""
                open
                description="DESCRIPTION"
                negativeLabel=""
                positiveLabel=""
            />,
            {
                wrapper: Wrapper,
            },
        );

        const item = screen.getByText("DESCRIPTION");
        expect(item).toBeInTheDocument();
    });

    it("should call onClose with data when clicking on negative button", () => {
        const onClose = jest.fn();
        render(
            <YesNoDialog
                onClose={onClose}
                onClosed={() => {}}
                title=""
                open
                description=""
                negativeLabel="NEGATIVE"
                positiveLabel=""
            />,
            { wrapper: Wrapper },
        );

        const item = screen.getByTestId("YesNoDialog");
        expect(item).toBeInTheDocument();

        const negativeButton = screen.getByText("NEGATIVE");
        act(() => {
            fireEvent.click(negativeButton);
        });

        expect(onClose).toBeCalledWith({ type: DialogActionType.Negative });
    });

    it("should call onClose with data when clicking on positive button", () => {
        const onClose = jest.fn();
        render(
            <YesNoDialog
                onClose={onClose}
                onClosed={() => {}}
                title=""
                open
                description=""
                negativeLabel=""
                positiveLabel="POSITIVE"
            />,
            { wrapper: Wrapper },
        );

        const item = screen.getByTestId("YesNoDialog");
        expect(item).toBeInTheDocument();

        const positiveButton = screen.getByText("POSITIVE");
        act(() => {
            fireEvent.click(positiveButton);
        });

        expect(onClose).toBeCalledWith({ type: DialogActionType.Positive });
    });
});
