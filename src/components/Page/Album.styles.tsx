import styled from "@emotion/styled";

export const Wrapper = styled.div`
    margin: 0;

    padding-bottom: ${({ theme }) => theme.spacing(2)};

    background: ${({ theme }) => theme.palette.background.default};

    position: relative;
    z-index: 100;
`;

export const Root = styled.div`
    min-width: 0;

    margin: 0;
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: 4px;

    display: flex;

    background: white;
`;

export const Content = styled.div`
    min-width: 0;

    margin-left: ${({ theme }) => theme.spacing(2)};
    padding: ${({ theme }) => theme.spacing(0.5, 0)};

    display: flex;
    flex-direction: column;

    flex: 1 1 auto;

    h4 {
        max-width: 100%;
    }
`;

export const Metadata = styled.div`
    margin-top: ${({ theme }) => theme.spacing(2)};

    display: flex;

    color: ${({ theme }) => theme.palette.text.secondary};

    > * {
        padding-right: ${({ theme }) => theme.spacing(1.25)};
        margin-right: ${({ theme }) => theme.spacing(1)} !important;

        position: relative;

        &:not(:last-of-type) {
            &:before {
                content: "";

                width: ${({ theme }) => theme.spacing(0.25)};
                height: ${({ theme }) => theme.spacing(0.25)};

                border-radius: 100%;

                position: absolute;
                top: 50%;
                right: 0;

                background: ${({ theme }) => theme.palette.text.secondary};

                transform: translateY(-50%);
            }
        }
    }
`;

export const Information = styled.div`
    margin: 0;
    height: 0;
`;

export const ButtonContainer = styled.div`
    display: flex;

    > button {
        margin-right: ${({ theme }) => theme.spacing(1)};
    }
`;
