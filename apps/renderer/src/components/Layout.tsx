import React from 'react'

import { Global } from '@emotion/react'
import { CssBaseline } from '@mui/material'

import TitleBar from '@components/TitleBar'
import Navigator from '@components/Navigator'

import * as Styled from '@components/Layout.styles'

export interface LayoutProps {}

export function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
  return (
    <Styled.Root>
      <Global styles={Styled.GlobalStyles} />
      <CssBaseline />
      <TitleBar />
      <Navigator />
      <Styled.Content>{children}</Styled.Content>
    </Styled.Root>
  )
}
