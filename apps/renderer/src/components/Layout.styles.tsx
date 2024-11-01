import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { NAVIGATOR_WIDTH, TITLE_BAR_HEIGHT } from '@constants/layout'

export const GlobalStyles = css`
  html,
  body,
  #app {
    height: 100vh;
  }
`

export const Root = styled.div`
  height: 100%;
`

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};

  position: fixed;
  top: ${({ theme }) => theme.spacing(TITLE_BAR_HEIGHT)};
  left: ${({ theme }) => theme.spacing(NAVIGATOR_WIDTH)};
  right: 0;
  bottom: 0;

  overflow: auto;
`
