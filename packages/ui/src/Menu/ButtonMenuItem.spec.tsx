import { render, screen } from "@testing-library/react";
import { ButtonMenuItem, ButtonMenuItemProps } from "./ButtonMenuItem.tsx";

import { Wrapper } from "../../__test__/Wrapper.tsx";

describe("<ButtonMenuItem />", () => {
    it("should render ButtonMenuItem component properly", () => {
        render(<ButtonMenuItem item={{ icon: <div />, type: "button", label: "Test", id: "id" }} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("button-menu-item");
        expect(item).toBeInTheDocument();
    });

    it("should render given label properly", () => {
        render(<ButtonMenuItem item={{ icon: <div />, type: "button", label: "Test", id: "id" }} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByText("Test");
        expect(item).toBeInTheDocument();
    });

    it("should render given icon properly", () => {
        render(
            <ButtonMenuItem item={{ icon: <div data-testid="icon" />, type: "button", label: "Test", id: "id" }} />,
            { wrapper: Wrapper },
        );

        const item = screen.getByTestId("icon");
        expect(item).toBeInTheDocument();
    });

    it("should render with active status if active prop is true", () => {
        render(
            <ButtonMenuItem
                item={{ icon: <div data-testid="icon" />, type: "button", label: "Test", id: "id" }}
                active
            />,
            { wrapper: Wrapper },
        );

        const item = screen.getByTestId("button-menu-item");
        expect(item).toHaveAttribute("aria-pressed", "true");
    });

    it("should call onClick callback with item data if clicked", () => {
        const onClick = jest.fn();
        const targetItem: ButtonMenuItemProps["item"] = {
            icon: <div data-testid="icon" />,
            type: "button",
            label: "Test",
            id: "id",
        };

        render(<ButtonMenuItem item={targetItem} onClick={onClick} />, { wrapper: Wrapper });

        const item = screen.getByTestId("button-menu-item");
        item.click();

        expect(onClick).toHaveBeenCalledWith(targetItem);
    });
});
