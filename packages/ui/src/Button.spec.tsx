import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { Button } from "./Button";
import { Wrapper } from "../__test__/Wrapper";

describe("<Button />", () => {
    it("should render Button component properly", () => {
        render(<Button />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Button");
        expect(item).toBeInTheDocument();
    });

    it("should render given children properly", () => {
        render(<Button>Test</Button>, {
            wrapper: Wrapper,
        });

        const item = screen.getByText("Test");
        expect(item).toBeInTheDocument();
    });

    it("should render normal button if empty menu item array is given", () => {
        render(<Button menuItems={[]}>Test</Button>, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Button");
        expect(item).toBeInTheDocument();
    });

    it("should render given menu items properly", () => {
        render(
            <Button
                menuItems={[
                    {
                        id: "test1",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon" />,
                    },
                    {
                        type: "label",
                        label: "Test",
                    },
                    { type: "divider" },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const button = screen.getByTestId("Button");
        act(() => {
            fireEvent.click(button);
        });

        const item = screen.getByTestId("icon");
        expect(item).toBeInTheDocument();

        const item2 = screen.getByTestId("label-menu-item");
        expect(item2).toBeInTheDocument();

        const item3 = screen.getByTestId("menu-divider");
        expect(item3).toBeInTheDocument();
    });
});
