import styled from "@emotion/styled";
import IconButton from "@components/UI/IconButton";

export const Root = styled.div`
    height: 50px;

    padding: ${({ theme }) => theme.spacing(0, 1, 0, 6)};
    border: 1px solid #eaeaea;
    border-radius: 4px;

    position: relative;
    z-index: 10;

    display: flex;
    align-items: center;

    background: #fefdfe;

    &:hover {
        ${IconButton} {
            background: rgba(0, 0, 0, 0.05);
        }
    }

    &:active {
        ${IconButton} {
            background: rgba(0, 0, 0, 0.025);
        }
    }
`;

export const IconWrapper = styled.div`
    width: ${({ theme }) => theme.spacing(6)};

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    > svg {
        display: block;
    }
`;

export const ContentWrapper = styled.div`
    height: 0;

    overflow: hidden;

    transition: ${({ theme }) =>
        theme.transitions.create("height", {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut,
        })};
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5, 7.5, 1.5, 6)};
    border: 1px solid #eaeaea;
    border-top: 0;

    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;

    background: #f7f7f7;

    transform: translateY(-100%);
    transition: ${({ theme }) =>
        theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut,
        })};
`;

export const Wrapper = styled.div<{ opened: boolean }>`
    margin: ${({ theme }) => theme.spacing(0, 0, 0.25)};

    position: relative;

    ${Root} {
        border-bottom-left-radius: ${({ opened }) => (opened ? 0 : 4)}px;
        border-bottom-right-radius: ${({ opened }) => (opened ? 0 : 4)}px;

        ${IconButton} {
            svg {
                transform: ${({ opened }) => (opened ? "rotate(180deg)" : "rotate(0deg)")};
                transition: ${({ theme }) => theme.transitions.create("transform")};
            }
        }
    }

    ${Content} {
        transform: ${({ opened }) => (opened ? "translateY(0)" : "translateY(-100%)")};
    }
`;
