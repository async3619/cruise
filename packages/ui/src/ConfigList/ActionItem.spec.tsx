import React from "react";
import { render, screen } from "@testing-library/react";

import { ActionConfigListItem } from "./ActionItem";

import { Wrapper } from "../../__test__/Wrapper";
import { ACTION_CONFIG_LIST_ITEM, MOCK_CONFIG } from "../../__test__/ConfigList";

describe("<ActionConfigListItem />", () => {
    it("should render ActionConfigListItem component properly", () => {
        render(<ActionConfigListItem item={ACTION_CONFIG_LIST_ITEM} config={MOCK_CONFIG} setConfig={jest.fn()} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("ActionConfigListItem");
        expect(item).toBeInTheDocument();
    });

    it("should render description text if description is provided", () => {
        const item = {
            ...ACTION_CONFIG_LIST_ITEM,
            description: "description",
        };

        render(<ActionConfigListItem item={item} config={MOCK_CONFIG} setConfig={jest.fn()} />, {
            wrapper: Wrapper,
        });

        const description = screen.getByText(item.description);
        expect(description).toBeInTheDocument();
    });

    it("should call action function when button is clicked", () => {
        const action = jest.fn();
        const item = {
            ...ACTION_CONFIG_LIST_ITEM,
            action,
        };

        render(<ActionConfigListItem item={item} config={MOCK_CONFIG} setConfig={jest.fn()} />, {
            wrapper: Wrapper,
        });

        const button = screen.getByText(item.button.label);
        button.click();

        expect(action).toBeCalledTimes(1);
    });
});
