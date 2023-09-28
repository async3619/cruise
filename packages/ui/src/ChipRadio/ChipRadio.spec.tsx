import React from "react";
import { render, screen } from "@testing-library/react";

import { ChipRadio } from "./ChipRadio";
import { Wrapper } from "../../__test__/Wrapper";

describe("<ChipRadio />", () => {
    it("should render ChipRadio component properly", () => {
        render(<ChipRadio items={[]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("ChipRadio");
        expect(item).toBeInTheDocument();
    });

    it("should able to render given items correctly", () => {
        render(
            <ChipRadio
                items={[
                    { label: "item1", value: "item1" },
                    { label: "item2", value: "item2" },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const item1 = screen.getByText("item1");
        const item2 = screen.getByText("item2");

        expect(item1).toBeInTheDocument();
        expect(item2).toBeInTheDocument();
    });

    it("should call onChange function when item is clicked", () => {
        const onChange = jest.fn();
        render(
            <ChipRadio
                items={[
                    { label: "item1", value: "item1" },
                    { label: "item2", value: "item2" },
                ]}
                onChange={onChange}
            />,
            { wrapper: Wrapper },
        );

        const item1 = screen.getByText("item1");
        const item2 = screen.getByText("item2");

        item1.click();
        item2.click();

        expect(onChange).toHaveBeenNthCalledWith(1, "item1");
        expect(onChange).toHaveBeenNthCalledWith(2, "item2");
    });

    it("should not call onChange function if the callback function is not given", () => {
        render(
            <ChipRadio
                items={[
                    { label: "item1", value: "item1" },
                    { label: "item2", value: "item2" },
                ]}
            />,
            { wrapper: Wrapper },
        );

        const item1 = screen.getByText("item1");
        const item2 = screen.getByText("item2");

        expect(() => {
            item1.click();
            item2.click();
        }).not.toThrow();
    });

    it("should highlights selected item", () => {
        render(
            <ChipRadio
                items={[
                    { label: "item1", value: "item1" },
                    { label: "item2", value: "item2" },
                ]}
                value="item1"
            />,
            { wrapper: Wrapper },
        );

        const selectedItem = screen.getByTestId("chip-radio-item-selected");
        expect(selectedItem).toBeInTheDocument();
    });
});
