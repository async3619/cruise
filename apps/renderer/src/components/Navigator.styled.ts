import styled from '@emotion/styled'

import { NAVIGATOR_WIDTH, TITLE_BAR_HEIGHT } from '@constants/layout'

export const Root = styled.div`
  width: ${({ theme }) => theme.spacing(NAVIGATOR_WIDTH)};

  border-right: 1px solid #505153;

  position: fixed;
  top: ${({ theme }) => theme.spacing(TITLE_BAR_HEIGHT)};
  left: 0;
  bottom: 0;

  background-color: #3f4042;
`
