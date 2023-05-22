import styled from "@emotion/styled";

export const Thumb = styled.div`
    width: ${({ theme }) => theme.spacing(1.5)};
    height: ${({ theme }) => theme.spacing(1.5)};

    border-radius: 100%;

    position: absolute;
    top: 0;
    left: 50%;

    background: white;
    transform: translate(-50%, 0);
    opacity: 0;

    user-select: none;
`;

export const Track = styled.div`
    width: 100%;
    height: 4px;
    border-radius: 2px;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: rgba(255, 255, 255, 0.2);
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: rgba(0, 0, 0, 0.2);
    }
`;

export const Rail = styled.div<{ active?: boolean }>`
    width: 50%;
    height: 4px;
    border-radius: 2px;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${({ theme, active }) => (active ? theme.vars.palette.primary.main : "rgba(255, 255, 255, 1)")};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${({ theme, active }) => (active ? theme.vars.palette.primary.main : "rgba(0, 0, 0, 0.5)")};
    }
`;

export const Root = styled.div`
    width: 100%;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0.5, 0)};

    position: relative;

    display: block;

    cursor: pointer;

    ${Rail} {
        ${({ theme }) => theme.getColorSchemeSelector("dark")} {
            background: rgba(255, 255, 255, 1);
        }
    }

    &:hover {
        ${Rail} {
            background: ${({ theme }) => theme.vars.palette.primary.main};
        }

        ${Thumb} {
            opacity: 1;
        }
    }
`;
