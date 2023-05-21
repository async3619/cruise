import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: 0;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const Header = styled.div`
    padding: ${({ theme }) => theme.spacing(1, 1, 1, 1.5)};

    display: flex;
    align-items: center;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["700"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5, 6.75, 1.5, 5.5)};
    border-top: 1px solid ${({ theme }) => theme.palette.divider};

    font-size: 0.9rem;

    color: ${({ theme }) => theme.vars.palette.text.secondary};

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background: ${backgroundColors["50"]};
    }
`;

export const ContentWrapper = styled.div`
    overflow: hidden;

    transition: ${({ theme }) => theme.transitions.create("max-height")};
`;

export const IconWrapper = styled.div`
    margin-right: ${({ theme }) => theme.spacing(1.5)};

    display: block;

    > svg {
        width: ${({ theme }) => theme.spacing(2.5)};
        height: ${({ theme }) => theme.spacing(2.5)};

        display: block;

        color: ${({ theme }) => theme.vars.palette.text.disabled};
    }
`;

export const Body = styled.div``;
