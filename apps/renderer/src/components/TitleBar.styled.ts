import styled from '@emotion/styled'

import { TITLE_BAR_HEIGHT } from '@constants/layout'

export const Root = styled.div`
  height: ${({ theme }) => theme.spacing(TITLE_BAR_HEIGHT)};

  border-bottom: 1px solid #505153;

  background-color: #3f4042;

  -webkit-app-region: drag;
  user-select: none;
`
