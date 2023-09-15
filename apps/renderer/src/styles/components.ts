import styled from "@emotion/styled";

export const DisabledText = styled.p`
    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        color: ${({ theme }) => theme.palette.text.secondary};
    }

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: ${({ theme }) => theme.palette.text.disabled};
    }
`;
