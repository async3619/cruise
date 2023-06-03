import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
    align-items: center;

    > h2 {
        flex: 0 0 auto;
    }
`;

export const SearchInput = styled.input`
    width: 100%;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(2, 4)};
    border: 0;
    border-radius: 100px;

    font-family: inherit;
    font-size: 1rem;

    display: block;
    box-sizing: border-box;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        color: ${({ theme }) => theme.vars.palette.text.primary};
        background-color: ${backgroundColors["900"]};
    }
`;
