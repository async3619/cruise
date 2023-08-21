import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { BaseConfigListItem } from "./BaseItem";

import { Wrapper } from "../../__test__/Wrapper";
import { SWITCH_CONFIG_LIST_ITEM } from "../../__test__/ConfigList";

describe("<BaseConfigListItem />", () => {
    it("should render BaseConfigListItem component properly", () => {
        render(<BaseConfigListItem item={SWITCH_CONFIG_LIST_ITEM} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("BaseConfigListItem");
        expect(item).toBeInTheDocument();
    });

    it("should toggle opened state when clicked", () => {
        render(<BaseConfigListItem item={SWITCH_CONFIG_LIST_ITEM} />, {
            wrapper: Wrapper,
        });

        const header = screen.getByTestId("header");
        const closedIcon = screen.getByTestId("closed-icon");
        expect(closedIcon).toBeInTheDocument();
        act(() => {
            fireEvent.click(header);
        });

        const openedIcon = screen.getByTestId("opened-icon");
        expect(openedIcon).toBeInTheDocument();
    });
});
