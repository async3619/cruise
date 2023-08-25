import React from "react";
import { act, render, screen } from "@testing-library/react";

import { ToastContainer } from "./Container";
import { useToast } from "./Provider";
import { Wrapper } from "../../__test__/Wrapper";

describe("<ToastContainer />", () => {
    it("should render toasts in the queue", () => {
        function MockComponent() {
            const { enqueueToast } = useToast();

            React.useEffect(() => {
                enqueueToast({ message: "test" });
            }, [enqueueToast]);

            return <ToastContainer />;
        }

        act(() => {
            render(<MockComponent />, {
                wrapper: Wrapper,
            });
        });

        expect(screen.getByText("test")).toBeInTheDocument();
    });
});
