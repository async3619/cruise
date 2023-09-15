import styled from "@emotion/styled";
import { backgroundColors } from "ui";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: 4px;

    display: flex;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background-color: ${backgroundColors["900"]};
    }

    ${({ theme }) => theme.getColorSchemeSelector("light")} {
        background-color: ${backgroundColors["50"]};
        border: 1px solid ${({ theme }) => theme.palette.divider};
    }
`;

export const Content = styled.div`
    min-width: 0;
    padding-left: ${({ theme }) => theme.spacing(2)};

    display: flex;
    flex-direction: column;

    flex: 1 1;
`;

export const ImageWrapper = styled.div`
    width: 200px;

    flex: 0 0 200px;
`;

export const Description = styled.div`
    height: 0;
`;
