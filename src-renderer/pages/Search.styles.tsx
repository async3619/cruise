import styled from "@emotion/styled";

export const Root = styled.div`
    height: 100%;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(2, 0)};
`;

export const Section = styled.section`
    margin: ${({ theme }) => theme.spacing(0, 0, 4)};

    &:not(:first-of-type) {
        margin-bottom: 0;
    }
`;

export const SectionTitle = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing(1)};

    display: flex;
    align-items: center;
    justify-content: space-between;
`;
