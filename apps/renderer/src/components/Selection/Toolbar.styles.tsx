import styled from "@emotion/styled";
import { backgroundColors } from "ui";

export const Root = styled.div<{ isVisible: boolean }>`
    height: ${({ theme }) => theme.spacing(7)};

    padding: ${({ theme }) => theme.spacing(0, 2, 0, 0.75)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    display: flex;
    align-items: center;

    position: sticky;
    top: 0;
    z-index: 100;

    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    transform: translateY(${({ theme }) => theme.spacing(1)});

    pointer-events: ${({ isVisible }) => (isVisible ? "auto" : "none")};

    transition: ${({ theme }) =>
        theme.transitions.create(["opacity"], { duration: theme.transitions.duration.shortest })};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        border: 1px solid ${({ theme }) => theme.palette.divider};
        background-color: white;

        box-shadow: ${({ theme }) => theme.shadows[2]};
    }
`;

export const Wrapper = styled.div`
    height: 0;

    position: relative;
`;

export const ChildrenWrapper = styled.div`
    width: 100%;
    height: ${({ theme }) => theme.spacing(7)};

    display: flex;
    align-items: center;

    position: absolute;
    top: 0;

    transform: translateY(${({ theme }) => theme.spacing(1)});

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["800"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: #fff;
    }
`;

export const CheckboxWrapper = styled.div`
    width: ${({ theme }) => theme.spacing(5.5)};

    margin-right: ${({ theme }) => theme.spacing(1)};

    display: flex;
    justify-content: center;
    align-items: center;
`;
