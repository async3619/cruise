import styled from "@emotion/styled";
import { TransitionGroup } from "react-transition-group";

export const Root = styled(TransitionGroup)`
    position: relative;

    .right-enter {
        position: absolute;
        top: 0;
        left: 0;

        opacity: 0.45;
    }

    .right-enter-active {
        opacity: 1;
        transition: ${({ theme }) => theme.transitions.create("opacity", { duration: 100 })};
    }

    .right-exit {
        position: absolute;
        top: 0;
        left: 0;

        opacity: 0;
    }
`;
