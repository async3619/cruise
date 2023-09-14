import React from "react";

import { createTheme } from "@mui/material";
import { render, screen } from "@testing-library/react";

import { Menu } from "./Menu";
import { Wrapper } from "../../__test__/Wrapper";

describe("<Menu />", () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should render Menu component properly", () => {
        render(<Menu items={[]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("root");
        expect(item).toBeInTheDocument();
    });

    it("should render given items properly", () => {
        render(
            <Menu
                items={[
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

        const item = screen.getByTestId("icon");
        expect(item).toBeInTheDocument();

        const item2 = screen.getByTestId("label-menu-item");
        expect(item2).toBeInTheDocument();

        const item3 = screen.getByTestId("menu-divider");
        expect(item3).toBeInTheDocument();
    });

    it("should throw error if unknown item type is given", () => {
        expect(() => {
            render(
                <Menu
                    items={[
                        {
                            type: "unknown" as any,
                            label: "Test",
                            icon: <div data-testid="icon" />,
                        },
                    ]}
                />,
                { wrapper: Wrapper },
            );
        }).toThrowError("Unknown menu item type: unknown");
    });

    it("should activate item if selectedId is given", () => {
        render(
            <Menu
                selectedId="test1"
                items={[
                    {
                        id: "test1",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon" />,
                    },
                    {
                        id: "test2",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon2" />,
                    },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const items = screen.getAllByTestId("button-menu-item");
        expect(items[0]).toHaveAttribute("aria-pressed", "true");
    });

    it("should call onClick callback when item is clicked", () => {
        const onClick = jest.fn();

        render(
            <Menu
                onClick={onClick}
                items={[
                    {
                        id: "test1",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon" />,
                    },
                    {
                        id: "test2",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon2" />,
                    },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const items = screen.getAllByTestId("button-menu-item");
        items[0].click();

        expect(onClick).toHaveBeenCalled();
    });

    it("should call onClick callback of button item when item is clicked", () => {
        const onClick = jest.fn();

        render(
            <Menu
                items={[
                    {
                        id: "test1",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon" />,
                        onClick,
                    },
                    {
                        id: "test2",
                        type: "button",
                        label: "Test",
                        icon: <div data-testid="icon2" />,
                    },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const items = screen.getAllByTestId("button-menu-item");
        items[0].click();

        expect(onClick).toHaveBeenCalled();
    });

    it("should provide standalone mode with different styling", () => {
        render(<Menu standalone={false} items={[]} />, { wrapper: Wrapper });

        const item = screen.getByTestId("root");
        expect(item).toHaveStyle({
            padding: createTheme().spacing(0.75),
        });
    });
});
