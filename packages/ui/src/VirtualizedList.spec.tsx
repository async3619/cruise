import React from "react";

import { render, screen } from "@testing-library/react";

import { VirtualizedList } from "./VirtualizedList";

describe("<VirtualizedList />", () => {
    it("should render given items properly", () => {
        render(
            <VirtualizedList items={[{ id: 10 }]} estimateSize={() => 35}>
                {({ id }) => <div data-testid="content">{id}</div>}
            </VirtualizedList>,
        );

        const content = screen.getByTestId("content");
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent("10");
    });
});
