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

    it("should action button if button typed helperOption is provided", () => {
        const onClick = jest.fn();

        render(
            <BaseConfigListItem
                item={SWITCH_CONFIG_LIST_ITEM}
                helperOption={{ type: "button", label: "button", onClick }}
            />,
            { wrapper: Wrapper },
        );

        const button = screen.getByTestId("action-button");
        button.click();

        expect(button).toBeInTheDocument();
        expect(onClick).toBeCalledTimes(1);
    });

    it("should helper text if text typed helperOption is provided", () => {
        render(<BaseConfigListItem item={SWITCH_CONFIG_LIST_ITEM} helperOption={{ type: "text", text: "text" }} />, {
            wrapper: Wrapper,
        });

        const text = screen.getByTestId("action-helper-text");
        expect(text).toBeInTheDocument();
    });
});
