import React from "react";
import { act, render, screen } from "@testing-library/react";

import { Slider } from "./Slider";
import { Wrapper } from "../__test__/Wrapper";

describe("<Slider />", () => {
    it("should render Slider component properly", () => {
        render(<Slider value={0} max={0} min={0} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Slider");
        expect(item).toBeInTheDocument();
    });

    it("should update value if mouse is down on the slider", () => {
        render(<Slider value={0} max={0} min={0} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Slider");
        expect(item).toBeInTheDocument();

        act(() => {
            item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        });
    });

    it("should call onValueChange if thumb is moved", () => {
        const onValueChange = jest.fn();

        render(<Slider value={0} max={0} min={0} onValueChange={onValueChange} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Slider");
        expect(item).toBeInTheDocument();

        act(() => {
            item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        });

        act(() => {
            item.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
        });

        expect(onValueChange).toHaveBeenCalled();
    });

    it("should call onValueChangeEnd if mouse is up on the slider", () => {
        const onValueChangeEnd = jest.fn();

        render(<Slider value={0} max={0} min={0} onValueChangeEnd={onValueChangeEnd} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Slider");
        expect(item).toBeInTheDocument();

        act(() => {
            item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        });

        act(() => {
            item.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        });

        expect(onValueChangeEnd).toHaveBeenCalled();
    });

    it("should not call onValueChangeEnd if mouse is up on the slider but its not on dragging mode", () => {
        const onValueChangeEnd = jest.fn();

        render(<Slider value={0} max={0} min={0} onValueChangeEnd={onValueChangeEnd} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Slider");
        expect(item).toBeInTheDocument();

        act(() => {
            item.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        });

        expect(onValueChangeEnd).not.toHaveBeenCalled();
    });
});
