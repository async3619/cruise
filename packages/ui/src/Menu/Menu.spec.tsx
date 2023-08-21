import { render, screen } from "@testing-library/react";
import { Menu } from "./Menu.tsx";

import { Wrapper } from "../../__test__/Wrapper.tsx";

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
                ]}
            />,
            { wrapper: Wrapper },
        );

        const item = screen.getByTestId("icon");
        expect(item).toBeInTheDocument();

        const item2 = screen.getByTestId("label-menu-item");
        expect(item2).toBeInTheDocument();
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
});
