import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(2, 0, 0)};
`;

export const Section = styled.section`
    margin: ${({ theme }) => theme.spacing(0, 0, 4)};

    &:last-of-type {
        margin-bottom: 0;
    }
`;

export const SectionTitle = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing(1)};

    display: flex;
    align-items: center;
    justify-content: space-between;
`;
