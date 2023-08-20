import styled from "@emotion/styled";

import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 1.5)};

    flex: 0 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;

    -webkit-app-region: drag;

    background-color: ${backgroundColors["950"]};
`;
