import React from "react";

import { render, screen } from "@testing-library/react";

import { WindowControlButton } from "./WindowControlButton";
import { Wrapper } from "../__test__/Wrapper";

describe("<WindowControlButton />", () => {
    it("should render WindowControlButton component properly", () => {
        render(<WindowControlButton type="minimize" />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("window-control-button");
        expect(item).toBeInTheDocument();
    });

    it("should render with proper icons", () => {
        render(<WindowControlButton type="minimize" />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("minimize-icon");
        expect(item).toBeInTheDocument();

        render(<WindowControlButton type="maximize" />, {
            wrapper: Wrapper,
        });

        const item2 = screen.getByTestId("maximize-icon");
        expect(item2).toBeInTheDocument();

        render(<WindowControlButton type="close" />, {
            wrapper: Wrapper,
        });

        const item3 = screen.getByTestId("close-icon");
        expect(item3).toBeInTheDocument();
    });
});
