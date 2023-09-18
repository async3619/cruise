import styled from "@emotion/styled";

export const Control = styled.div`
    max-width: 0;
    width: ${({ theme }) => theme.spacing(10)};

    margin-right: ${({ theme }) => theme.spacing(1.5)};

    box-sizing: border-box;

    opacity: 0;

    transition: ${({ theme }) =>
        theme.transitions.create(["opacity"], {
            duration: theme.transitions.duration.shortest,
        })};

    &:has(:active) {
        opacity: 1;
        max-width: ${({ theme }) => theme.spacing(10)};
    }
`;

export const Root = styled.div`
    display: flex;
    align-items: center;

    &:hover {
        ${Control} {
            max-width: ${({ theme }) => theme.spacing(10)};
            opacity: 1;
        }
    }
`;
