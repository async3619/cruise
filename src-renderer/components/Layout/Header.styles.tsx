import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1, 1.5)};

    -webkit-app-region: drag;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: white;
        background: #1e1f22;
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: black;
        background: #e3e5e8;
    }
`;

export const Title = styled.h1`
    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: rgba(255, 255, 255, 0.5);
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: rgba(0, 0, 0, 0.75);
    }
`;
