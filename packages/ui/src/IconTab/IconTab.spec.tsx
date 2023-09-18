import React from "react";
import { render, screen } from "@testing-library/react";

import { IconTab } from "./IconTab";
import { Wrapper } from "../../__test__/Wrapper";

describe("<IconTab />", () => {
    it("should render IconTab component properly", () => {
        render(<IconTab items={[]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("IconTab");
        expect(item).toBeInTheDocument();
    });

    it("should render IconTab items properly", () => {
        render(<IconTab items={[{ id: "1", label: "1", icon: <div data-testid="icon" /> }]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("icon");
        expect(item).toBeInTheDocument();
    });

    it("should update value if IconTab item is clicked", () => {
        const onChange = jest.fn();
        render(<IconTab items={[{ id: "1", label: "1", icon: <div data-testid="icon" /> }]} onChange={onChange} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("icon");
        item.click();

        expect(onChange).toBeCalledWith("1");
    });

    it("should not call onChange if onChange is not provided", () => {
        const onChange = jest.fn();
        render(<IconTab items={[{ id: "1", label: "1", icon: <div data-testid="icon" /> }]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("icon");
        item.click();

        expect(onChange).not.toBeCalled();
    });

    it("should make item active if value is provided", () => {
        render(<IconTab items={[{ id: "1", label: "1", icon: <div data-testid="icon" /> }]} value="1" />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("item-selected");
        expect(item).toBeInTheDocument();
    });
});
