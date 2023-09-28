import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
    flex-wrap: wrap;

    > .MuiChip-root {
        margin-right: ${({ theme }) => theme.spacing(1)};
    }
`;
