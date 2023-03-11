import styled from "@emotion/styled";

export const Controls = styled.div`
    padding: ${({ theme }) => theme.spacing(1)};

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;

    opacity: 0;
    pointer-events: none;

    transition: ${({ theme }) => theme.transitions.create(["opacity"])};
`;

export const Root = styled.div`
    width: ${({ theme }) => theme.spacing(22)};

    margin: ${({ theme }) => theme.spacing(0, 0, 2)};
    padding: ${({ theme }) => theme.spacing(1)};
    border-radius: 4px;

    transform-origin: center center;
    transition: ${({ theme }) => theme.transitions.create(["transform"])};

    &:hover {
        background: #eff0f2;
        box-shadow: inset 0 0 0 1px #e9eaec;

        ${Controls} {
            opacity: 1;
            pointer-events: all;
        }
    }

    &:active {
        transform: scale(0.925);
    }
`;

export const Profile = styled.div<{ empty: boolean }>`
    width: ${({ theme }) => theme.spacing(20)};
    height: ${({ theme }) => theme.spacing(20)};

    margin: 0;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    flex: 0 0 auto;

    position: relative;

    background: ${({ theme, empty }) => (empty ? "#eeeeee" : theme.palette.background.default)};

    > svg {
        width: 30%;
        height: 30%;

        display: block;

        opacity: 0.5;
    }
`;

export const Button = styled.button`
    width: ${({ theme }) => theme.spacing(4)};
    height: ${({ theme }) => theme.spacing(4)};

    margin: 0;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.palette.text.secondary};
    border-radius: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background: white;
    opacity: 0.75;

    transition: ${({ theme }) => theme.transitions.create(["opacity"])};

    cursor: pointer;

    > svg {
        width: ${({ theme }) => theme.spacing(3)};
        height: ${({ theme }) => theme.spacing(3)};

        display: block;
    }

    &:hover {
        opacity: 0.85;
    }

    &:active {
        opacity: 1;
    }
`;
